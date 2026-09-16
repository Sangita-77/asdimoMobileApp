import { API_BASE_URL, AUTH_ENDPOINTS } from "@/constants/config";
import { getAccessToken } from "@/services/authService";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

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

/**
 * Fetch active Razorpay Key ID from backend
 */
export async function getRazorpayKey(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}${AUTH_ENDPOINTS.paymentKey}`);
  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Failed to retrieve payment configuration.");
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
 * Unified Payment Processor for Android, iOS, and Web.
 * 1. Checks if native react-native-razorpay SDK is available.
 * 2. If available, opens native Razorpay checkout and verifies signature on backend.
 * 3. If running on Web or in Expo Go (without native binary), falls back to secure Web checkout.
 */
export async function processPayment(
  options: ProcessPaymentOptions,
): Promise<{ success: boolean; paymentId: string }> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  const razorpayKey = await getRazorpayKey();

  const isNativeSupported =
    Platform.OS !== "web" &&
    NativeRazorpayCheckout &&
    typeof NativeRazorpayCheckout.open === "function";

  if (isNativeSupported) {
    // 1. Create order on backend
    const order = await createPaymentOrder({
      amount: options.amount,
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

      // Verify payment on backend
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

  // Fallback: Web / In-App browser session
  const returnUrl = Linking.createURL("payment-complete");
  const paymentUrl = new URL(
    "https://dreamgroupsindia.com/dev/asDimoWebApp/payment",
  );
  paymentUrl.searchParams.set("accessToken", accessToken);
  paymentUrl.searchParams.set("amount", String(options.amount));
  if (options.user) {
    paymentUrl.searchParams.set("user", JSON.stringify(options.user));
  }
  if (options.metadata) {
    paymentUrl.searchParams.set("metadata", JSON.stringify(options.metadata));
  }
  if (options.receipt) {
    paymentUrl.searchParams.set("receipt", options.receipt);
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

  return {
    success: true,
    paymentId,
  };
}
