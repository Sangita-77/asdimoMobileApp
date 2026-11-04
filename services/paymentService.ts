import { API_BASE_URL, AUTH_ENDPOINTS } from "@/constants/config";
import { getAccessToken } from "@/services/authService";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { NativeModules, Platform } from "react-native";

export interface PaymentOrder {
  orderId: string;
  amount: number;
  currency: string;
  receipt?: string;
  [key: string]: any;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface PaymentUserData {
  parentId?: number;
  name?: string;
  email?: string;
  phone?: string;
  contact?: string;
}

export interface ProcessPaymentOptions {
  amount: number; // in rupees, e.g. 499
  description?: string;
  user?: PaymentUserData;
  metadata?: Record<string, any>;
  receipt?: string;
}

let NativeRazorpayCheckout: any = null;
try {
  const RNRazorpay = require("react-native-razorpay");
  NativeRazorpayCheckout = RNRazorpay.default || RNRazorpay;
} catch {
  NativeRazorpayCheckout = null;
}

function loadWebRazorpayScript(): Promise<void> {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.reject(new Error("Web environment is not available."));
  }
  if ((window as any).Razorpay) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener(
        "error",
        () => reject(new Error("Unable to load Razorpay Checkout.")),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Unable to load Razorpay Checkout."));
    document.body.appendChild(script);
  });
}

/**
 * Fetch active Razorpay Key ID from backend
 */
export async function getRazorpayKey(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.paymentKey}`);
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || "Failed to retrieve payment configuration.",
    );
  }

  const key = data.data?.key || data.key;
  if (!key) {
    throw new Error("Razorpay Key ID is missing from server response.");
  }

  return key;
}

/**
 * Create Razorpay order on backend
 */
export async function createPaymentOrder(payload: {
  amount: number;
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
  metadata?: Record<string, any>;
}): Promise<PaymentOrder> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.createOrder}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      amount: payload.amount,
      currency: payload.currency || "INR",
      receipt: payload.receipt,
      notes: payload.notes || { source: "mobile-app" },
      metadata: payload.metadata,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to create payment order.");
  }

  return data.data as PaymentOrder;
}

/**
 * Verify Razorpay payment signature on backend
 */
export async function verifyPayment(payload: {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}): Promise<boolean> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const response = await fetch(
    `${API_BASE_URL}${AUTH_ENDPOINTS.verifyPayment}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Payment signature verification failed.");
  }

  return true;
}

/**
 * Verify that the completed payment amount on the server matches the expected database amount
 */
async function verifyPaidAmountMatches(
  paymentId: string,
  expectedAmountInRupees: number,
  accessToken: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/payments/${encodeURIComponent(paymentId)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.success || !data?.data) {
    return;
  }

  const paymentRecord = data.data;
  const rawPaidAmount = Number(paymentRecord.amount);
  if (!Number.isFinite(rawPaidAmount) || rawPaidAmount <= 0) {
    return;
  }

  // Razorpay stores amount in paise (e.g. 49900) or backend may normalize to rupees (499)
  const expectedPaise = Math.round(expectedAmountInRupees * 100);
  const expectedRupees = Math.round(expectedAmountInRupees);

  const matchesRupees = Math.round(rawPaidAmount) === expectedRupees;
  const matchesPaise = Math.round(rawPaidAmount) === expectedPaise;

  if (!matchesRupees && !matchesPaise) {
    throw new Error(
      `Paid amount does not match the required fee of ₹${expectedAmountInRupees}.`,
    );
  }
}

/**
 * Unified Payment Processor for Android, iOS, and Web.
 * 1. On Web, opens official Razorpay Checkout modal directly with a server-locked order amount.
 * 2. On Native with react-native-razorpay linked, opens native Razorpay checkout with locked order amount.
 * 3. In Expo Go (without native binary), opens Web checkout with locked order & verifies paid amount.
 */
export async function processPayment(
  options: ProcessPaymentOptions,
): Promise<{ success: boolean; paymentId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const lockedAmount = Number(options.amount);
  if (!Number.isFinite(lockedAmount) || lockedAmount <= 0) {
    throw new Error("Invalid payable amount.");
  }

  const razorpayKey = await getRazorpayKey();

  // 1. Web platform: open official Razorpay checkout modal directly (amount is locked to orderId)
  if (Platform.OS === "web") {
    const order = await createPaymentOrder({
      amount: lockedAmount,
      currency: "INR",
      receipt: options.receipt,
      metadata: options.metadata,
      notes: {
        source: "mobile-web",
        parentId: String(options.user?.parentId || ""),
      },
    });

    await loadWebRazorpayScript();
    const RazorpayConstructor = (window as any).Razorpay;
    if (!RazorpayConstructor) {
      throw new Error("Razorpay Checkout is unavailable.");
    }

    return new Promise<{ success: boolean; paymentId: string }>(
      (resolve, reject) => {
        const rzp = new RazorpayConstructor({
          key: razorpayKey,
          amount: order.amount,
          currency: order.currency || "INR",
          name: "ASdimo",
          description: options.description || "ASdimo Appointment Booking",
          image: "https://dreamgroupsindia.com/dev/asDimoWebApp/favicon.svg",
          order_id: order.orderId,
          prefill: {
            email: options.user?.email || "",
            contact: options.user?.phone || options.user?.contact || "",
            name: options.user?.name || "ASdimo Customer",
          },
          theme: { color: "#2563EB" },
          modal: {
            ondismiss: () => {
              reject(new Error("Payment was cancelled."));
            },
          },
          handler: async (response: RazorpaySuccessResponse) => {
            try {
              if (!response.razorpay_payment_id) {
                throw new Error(
                  "Payment was completed but payment ID is missing.",
                );
              }
              await verifyPayment({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id || order.orderId,
                razorpay_signature: response.razorpay_signature || "",
              });
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
              });
            } catch (err) {
              reject(
                err instanceof Error
                  ? err
                  : new Error("Payment verification failed."),
              );
            }
          },
        });

        rzp.open();
      },
    );
  }

  // 2. Native Android/iOS with react-native-razorpay native module linked
  const hasNativeBridge = Boolean(
    NativeModules?.RNRazorpayCheckout || NativeModules?.RazorpayCheckout,
  );
  const isNativeSupported =
    hasNativeBridge &&
    NativeRazorpayCheckout &&
    typeof NativeRazorpayCheckout.open === "function";

  if (isNativeSupported) {
    const order = await createPaymentOrder({
      amount: lockedAmount,
      currency: "INR",
      receipt: options.receipt,
      metadata: options.metadata,
      notes: {
        source: `mobile-${Platform.OS}`,
        parentId: String(options.user?.parentId || ""),
      },
    });

    const checkoutOptions = {
      description: options.description || "ASdimo Appointment Booking",
      image: "https://dreamgroupsindia.com/dev/asDimoWebApp/favicon.svg",
      currency: order.currency || "INR",
      key: razorpayKey,
      amount: String(order.amount),
      name: "ASdimo",
      order_id: order.orderId,
      prefill: {
        email: options.user?.email || "",
        contact: options.user?.phone || options.user?.contact || "",
        name: options.user?.name || "ASdimo Customer",
      },
      theme: { color: "#2563EB" },
    };

    try {
      const response: RazorpaySuccessResponse =
        await NativeRazorpayCheckout.open(checkoutOptions);

      if (!response.razorpay_payment_id) {
        throw new Error("Payment was completed but payment ID is missing.");
      }

      await verifyPayment({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id || order.orderId,
        razorpay_signature: response.razorpay_signature || "",
      });

      return {
        success: true,
        paymentId: response.razorpay_payment_id,
      };
    } catch (error: any) {
      if (error?.code === 0 || error?.description === "Payment Cancelled") {
        throw new Error("Payment was cancelled.");
      }
      throw new Error(
        error?.description ||
          error?.message ||
          "Payment could not be completed. Please try again.",
      );
    }
  }

  // 3. Fallback: In-App browser session (Expo Go)
  const order = await createPaymentOrder({
    amount: lockedAmount,
    currency: "INR",
    receipt: options.receipt,
    metadata: options.metadata,
    notes: {
      source: `mobile-browser-${Platform.OS}`,
      parentId: String(options.user?.parentId || ""),
    },
  });

  const returnUrl = Linking.createURL("payment-complete");
  const paymentUrl = new URL(
    "https://dreamgroupsindia.com/dev/asDimoWebApp/payment",
  );
  paymentUrl.searchParams.set("accessToken", accessToken);
  paymentUrl.searchParams.set("amount", String(lockedAmount));
  paymentUrl.searchParams.set("orderId", order.orderId);
  paymentUrl.searchParams.set("readOnly", "true");
  paymentUrl.searchParams.set("lockAmount", "true");
  if (options.user) {
    paymentUrl.searchParams.set("user", JSON.stringify(options.user));
  }
  if (options.metadata) {
    paymentUrl.searchParams.set(
      "metadata",
      JSON.stringify({
        ...options.metadata,
        fixedAmount: lockedAmount,
        orderId: order.orderId,
      }),
    );
  }
  if (options.receipt || order.receipt) {
    paymentUrl.searchParams.set(
      "receipt",
      String(options.receipt || order.receipt),
    );
  }
  paymentUrl.searchParams.set("returnUrl", returnUrl);

  const paymentResult = await WebBrowser.openAuthSessionAsync(
    paymentUrl.toString(),
    returnUrl,
  );

  if (paymentResult.type !== "success") {
    throw new Error("Payment was cancelled or dismissed.");
  }

  const paymentParams = Linking.parse(paymentResult.url).queryParams || {};
  if (paymentParams.payment !== "success") {
    throw new Error(
      typeof paymentParams.error === "string"
        ? paymentParams.error
        : "Payment could not be confirmed.",
    );
  }

  const paymentId = paymentParams.paymentId;
  if (typeof paymentId !== "string" || !paymentId.trim()) {
    throw new Error("Payment reference is missing.");
  }

  await verifyPaidAmountMatches(paymentId, lockedAmount, accessToken);

  return {
    success: true,
    paymentId,
  };
}
