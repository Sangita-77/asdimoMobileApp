import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { ROUTES } from "@/constants/routes";
import {
  AvailabilitySlot,
  createAppointment,
  getAccessToken,
  getLoggedInUserId,
  getUserById,
} from "@/services/authService";
import { processPayment } from "@/services/paymentService";
import { doctorStyles } from "../../constants/globalStyle";

type ReviewAppointmentItem = {
  id: string;
  sl: number;
  date: string;
  rawDate: string;
  time: string;
  rawTime: string;
  medium: string;
  therapist: string;
};

function formatDisplayDate(dateStr: string) {
  if (!dateStr) return "";
  const parts = dateStr.trim().split("-").map(Number);
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return dateStr;
}

function formatDisplayTime(timeStr: string) {
  if (!timeStr) return "";
  const trimmed = timeStr.trim();
  if (/[ap]m$/i.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  const parts = trimmed.split(":").map(Number);
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    const hours24 = parts[0];
    const minutes = String(parts[1]).padStart(2, "0");
    const period = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  }
  return trimmed;
}

function extractFeeFromUser(userData: any): number | null {
  if (!userData) return null;
  const rawFee =
    userData?.teacherData?.fees ??
    userData?.roleData?.fees ??
    userData?.fees ??
    userData?.relatedData?.teacher?.fees ??
    userData?.roleData?.amount ??
    userData?.amount;
  const parsed = Number(rawFee);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export default function Bookings() {
  const params = useLocalSearchParams<{
    therapistId?: string;
    therapistName?: string;
    therapistFee?: string;
    slots?: string;
  }>();

  const therapistId = Number(params.therapistId);
  const initialFee = Number(params.therapistFee);

  const [therapistDisplayName, setTherapistDisplayName] = useState(
    params.therapistName || "Therapist",
  );
  const [appointmentPrice, setAppointmentPrice] = useState<number>(
    Number.isFinite(initialFee) && initialFee > 0 ? initialFee : 0,
  );
  const [isLoadingFee, setIsLoadingFee] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const parsedSlots = useMemo<AvailabilitySlot[]>(() => {
    if (!params.slots) return [];
    try {
      const raw = JSON.parse(params.slots);
      return Array.isArray(raw) ? raw : [];
    } catch {
      return [];
    }
  }, [params.slots]);

  const appointments = useMemo<ReviewAppointmentItem[]>(() => {
    return parsedSlots.map((slot, index) => ({
      id: slot._id || String(index + 1),
      sl: index + 1,
      date: formatDisplayDate(slot.date),
      rawDate: slot.date,
      time: formatDisplayTime(slot.time),
      rawTime: slot.time,
      medium: slot.medium || "online",
      therapist: therapistDisplayName,
    }));
  }, [parsedSlots, therapistDisplayName]);

  const firstAppointmentId = appointments[0]?.id;

  const [selected, setSelected] = useState<string[]>(() =>
    parsedSlots.map((s, idx) => s._id || String(idx + 1)),
  );

  // Ensure the first appointment is always checked
  useEffect(() => {
    if (appointments.length === 0) {
      setSelected([]);
      return;
    }
    setSelected((prev) => {
      if (prev.length === 0) {
        return appointments.map((item) => item.id);
      }
      if (firstAppointmentId && !prev.includes(firstAppointmentId)) {
        return [firstAppointmentId, ...prev];
      }
      return prev;
    });
  }, [appointments, firstAppointmentId]);

  // Fetch therapist fees from auth/getAllUsersById
  useEffect(() => {
    if (!Number.isFinite(therapistId) || therapistId <= 0) return;

    let active = true;
    async function fetchTherapistDetails() {
      try {
        setIsLoadingFee(true);
        const userData = await getUserById(therapistId);
        if (!active || !userData) return;

        if (userData.name) {
          setTherapistDisplayName(userData.name);
        }
        const fetchedFee = extractFeeFromUser(userData);
        if (fetchedFee !== null) {
          setAppointmentPrice(fetchedFee);
        }
      } catch (err) {
        console.warn("Unable to fetch therapist fees:", err);
      } finally {
        if (active) {
          setIsLoadingFee(false);
        }
      }
    }

    void fetchTherapistDetails();
    return () => {
      active = false;
    };
  }, [therapistId]);

  const toggleSelection = (id: string, index: number) => {
    // First appointment must always remain checked
    if (index === 0 || id === firstAppointmentId) {
      return;
    }

    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id],
    );
  };

  const totalAmount = selected.length * appointmentPrice;

  const proceedToPayment = async () => {
    if (appointments.length === 0 || selected.length === 0 || isProcessing) {
      return;
    }

    const parentId = await getLoggedInUserId();
    if (!parentId) {
      setStatusMessage({
        type: "error",
        text: "Unable to identify your account. Please sign in again.",
      });
      return;
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      setStatusMessage({
        type: "error",
        text: "Your session has expired. Please sign in again.",
      });
      return;
    }

    if (!Number.isFinite(appointmentPrice) || appointmentPrice <= 0) {
      setStatusMessage({
        type: "error",
        text: "Therapist consultation fee is unavailable.",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setStatusMessage(null);

      const paymentResult = await processPayment({
        amount: totalAmount,
        description: `Consultation with ${therapistDisplayName} (${selected.length} slot${selected.length > 1 ? "s" : ""})`,
        user: { parentId },
        metadata: {
          source: "mobile-review-appointments",
          therapistId,
          paidAppointmentIds: selected,
          totalAppointments: appointments.length,
        },
      });

      if (!paymentResult.success || !paymentResult.paymentId) {
        throw new Error("Payment could not be confirmed.");
      }

      let lastMessage = "";
      for (const item of appointments) {
        const isPaid = selected.includes(item.id);
        const response = await createAppointment({
          teacherId: therapistId,
          date: item.rawDate,
          time: item.rawTime,
          medium: item.medium || "online",
          parentId,
          paymentId: isPaid ? paymentResult.paymentId : " ",
          paymentStatus: isPaid ? "completed" : "pending",
          amount: appointmentPrice,
        });
        if (response.message) {
          lastMessage = response.message;
        }
      }

      setStatusMessage({
        type: "success",
        text:
          lastMessage ||
          (appointments.length > 1
            ? "Appointments booked successfully."
            : "Appointment booked successfully."),
      });

      router.replace(ROUTES.AUTH.UPCOMINGBOOKING);
    } catch (err) {
      setStatusMessage({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "Unable to complete payment and booking. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <OrientationLock variant="portrait" />

      <Header title="Review Appointments" />

      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <Text style={doctorStyles.heading}>Review Appointments</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerText, styles.slCol]}>Sl</Text>
                <Text style={[styles.headerText, styles.dateCol]}>Date</Text>
                <Text style={[styles.headerText, styles.timeCol]}>Time</Text>
                <Text style={[styles.headerText, styles.therapistCol]}>
                  Therapist
                </Text>
                <Text style={[styles.headerText, styles.payCol]}>
                  Pay Now
                </Text>
              </View>
            </>
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.cellText}>No appointments selected.</Text>
            </View>
          }
          renderItem={({ item, index }) => {
            const isFirst = index === 0;
            const isSelected = isFirst || selected.includes(item.id);

            return (
              <View style={styles.tableRow}>
                <Text style={[styles.cellText, styles.slCol]}>
                  {item.sl}
                </Text>

                <Text style={[styles.cellText, styles.dateCol]}>
                  {item.date}
                </Text>

                <Text style={[styles.cellText, styles.timeCol]}>
                  {item.time}
                </Text>

                <Text
                  style={[styles.cellText, styles.therapistCol]}
                  numberOfLines={1}
                >
                  {item.therapist}
                </Text>

                <View style={styles.payCol}>
                  <Pressable
                    disabled={isFirst || isProcessing}
                    onPress={() => toggleSelection(item.id, index)}
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <>
              <View style={styles.summaryCard}>
                <View style={styles.summaryTitle}>
                  <Text style={styles.infoIcon}>i</Text>
                  <Text style={styles.summaryHeading}>
                    Payment Summary
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Total Appointments
                  </Text>
                  <Text style={styles.summaryValue}>
                    {appointments.length}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    Selected for Payment
                  </Text>
                  <Text style={styles.summaryValue}>
                    {selected.length}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  {isLoadingFee && appointmentPrice === 0 ? (
                    <ActivityIndicator size="small" color="#1688E8" />
                  ) : (
                    <Text style={styles.totalValue}>
                      ₹{totalAmount.toFixed(2)}
                    </Text>
                  )}
                </View>
              </View>

              {statusMessage ? (
                <Text
                  style={[
                    styles.statusMessage,
                    statusMessage.type === "error"
                      ? styles.errorText
                      : styles.successText,
                  ]}
                >
                  {statusMessage.text}
                </Text>
              ) : null}
            </>
          }
        />

        <View style={styles.bottomButtons}>
          <Pressable
            style={styles.backButton}
            disabled={isProcessing}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}> Back</Text>
          </Pressable>

          <Pressable
            style={[
              styles.paymentButton,
              (selected.length === 0 || isProcessing) && styles.disabledButton,
            ]}
            onPress={() => void proceedToPayment()}
            disabled={selected.length === 0 || isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  listContent: {
    paddingBottom: 15,
  },

  tableHeader: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 13,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },

  headerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#252525",
    textAlign: "center",
  },

  cellText: {
    fontSize: 12,
    color: "#7B8296",
    textAlign: "center",
  },

  slCol: {
    flex: 0.5,
  },

  dateCol: {
    flex: 1.5,
  },

  timeCol: {
    flex: 1.1,
  },

  therapistCol: {
    flex: 1.2,
  },

  payCol: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 51,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9",
    elevation: 1,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#BFC4CC",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#1688E8",
    borderColor: "#1688E8",
  },

  checkMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 16,
  },

  summaryCard: {
    backgroundColor: "#F0F4FA",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginTop: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  summaryTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  infoIcon: {
    width: 17,
    height: 17,
    borderRadius: 10,
    backgroundColor: "#1688E8",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },

  summaryHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1688E8",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#7B8296",
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 13,
    color: "#7B8296",
    fontWeight: "600",
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },

  totalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },

  backButton: {
    flex: 1,
    backgroundColor: "#31BDCA",
    borderRadius: 30,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentButton: {
    flex: 1.25,
    backgroundColor: "#FFBF00",
    borderRadius: 30,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "600",
  },

  emptyWrap: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  statusMessage: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
  },

  errorText: {
    color: "#DC2626",
  },

  successText: {
    color: "#16A34A",
  },
});
