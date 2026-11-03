import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import DoctorListCard from "@/components/ui/ListComponents";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import {
  Appointment,
  AvailabilitySlot,
  getLoggedInUserId,
  getParentAppointments,
  updateAppointmentPaymentStatus,
} from "@/services/authService";
import { processPayment } from "@/services/paymentService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { doctorStyles, globalStyle } from "../../constants/globalStyle";
import { ButtonVariant } from "@/components/ButtonCompo/Button";

function formatDate(date: string) {
  if (!date) return "";
  const [day, month, year] = date.split("-").map(Number);
  if (!day || !month || !year) return date;
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function parseAppointmentDate(dateStr: string, timeStr?: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.trim().split("-").map(Number);
  if (
    parts.length !== 3 ||
    isNaN(parts[0]) ||
    isNaN(parts[1]) ||
    isNaN(parts[2])
  ) {
    return null;
  }
  const [day, month, year] = parts;
  let hours = 0;
  let minutes = 0;
  if (timeStr) {
    const timeParts = timeStr.trim().split(":").map(Number);
    if (timeParts.length >= 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1])) {
      hours = timeParts[0];
      minutes = timeParts[1];
    }
  }
  return new Date(year, month - 1, day, hours, minutes);
}

function isPastAppointment(dateStr: string, timeStr?: string): boolean {
  const d = parseAppointmentDate(dateStr, timeStr);
  if (!d) return false;
  return d.getTime() < Date.now();
}

function formatProfileImage(rawImg?: string | null) {
  if (!rawImg) return undefined;
  if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
    return { uri: rawImg };
  }
  const cleanBase = API_BASE_URL.replace(/\/api$/, "");
  const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
  return { uri: `${cleanBase}${cleanPath}` };
}

function getStatusVariant(status?: string): ButtonVariant {
  const s = (status || "").toLowerCase().trim();
  if (s === "approved" || s === "completed") return "green";
  if (s === "cancelled" || s === "rejected" || s === "rescheduled") return "Red";
  return "Sky";
}

function checkTherapistAvailability(
  availability?: AvailabilitySlot | AvailabilitySlot[]
): boolean {
  if (!availability) return false;
  const slots: AvailabilitySlot[] = Array.isArray(availability)
    ? availability
    : [availability];

  if (slots.length === 0) return false;

  const futureSlots = slots.filter((slot) => {
    if (!slot?.date) return false;
    return !isPastAppointment(slot.date, slot.time);
  });

  if (futureSlots.length === 0) {
    return false;
  }

  return futureSlots.some((slot) => slot.isBooked === false);
}

export default function UpcomingBooking() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState<string | null>(null);
  const [paymentBanner, setPaymentBanner] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const parentId = await getLoggedInUserId();
      if (!parentId)
        throw new Error("Please sign in again to view your bookings.");
      const list = await getParentAppointments(parentId);
      
      const upcoming = list.filter(
        (item) => !isPastAppointment(item.date, item.time)
      );

      upcoming.sort((a, b) => {
        const da = parseAppointmentDate(a.date, a.time)?.getTime() || 0;
        const db = parseAppointmentDate(b.date, b.time)?.getTime() || 0;
        return db - da;
      });

      setAppointments(upcoming);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load upcoming bookings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const handleViewDetails = (item: Appointment) => {
    router.push({
      pathname: ROUTES.AUTH.BOOKINGDETAILS,
      params: {
        appointmentId: item._id,
      },
    });
  };

  const handlePayNow = async (item: Appointment) => {
    if (payingId) return;

    try {
      setPayingId(item._id);
      setPaymentBanner(null);

      const loggedInParentId = await getLoggedInUserId();
      const parentId = item.parentId || loggedInParentId;
      const parsedAmount = Number(item.amount);
      const payableAmount =
        Number.isFinite(parsedAmount) && parsedAmount > 0 ? parsedAmount : 499;

      const paymentResult = await processPayment({
        amount: payableAmount,
        description: `Consultation with ${item.teacherUser?.name || "Therapist"}`,
        user: {
          parentId: parentId || undefined,
          name: item.parentUser?.name,
          email: item.parentUser?.email,
          phone: item.parentUser?.phone,
        },
        metadata: {
          source: "mobile-upcoming-booking",
          appointmentId: item._id,
        },
      });

      if (!paymentResult.success || !paymentResult.paymentId) {
        throw new Error("Payment could not be confirmed.");
      }

      const updateResponse = await updateAppointmentPaymentStatus(item._id, {
        paymentStatus: "completed",
        status: "approved",
        paymentId: paymentResult.paymentId,
      });

      setAppointments((current) =>
        current.map((appt) =>
          appt._id === item._id
            ? {
                ...appt,
                ...(updateResponse.data || {}),
                paymentStatus: updateResponse.data?.paymentStatus || "completed",
                status: updateResponse.data?.status || "approved",
                paymentId: paymentResult.paymentId,
              }
            : appt
        )
      );

      setPaymentBanner({
        type: "success",
        text: updateResponse.message || "Payment completed successfully.",
      });
    } catch (payError) {
      setPaymentBanner({
        type: "error",
        text:
          payError instanceof Error
            ? payError.message
            : "Unable to complete payment. Please try again.",
      });
    } finally {
      setPayingId(null);
    }
  };

  return (
    <>
      <OrientationLock variant="portrait" />
      <Header title="Upcoming Bookings" />
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={doctorStyles.heading}>Upcoming Bookings</Text>
            <Text style={globalStyle.smallText2}>
              Here are your scheduled upcoming appointments.
            </Text>
            {paymentBanner ? (
              <View
                style={[
                  styles.banner,
                  paymentBanner.type === "success"
                    ? styles.bannerSuccess
                    : styles.bannerError,
                ]}
              >
                <Ionicons
                  name={
                    paymentBanner.type === "success"
                      ? "checkmark-circle"
                      : "alert-circle"
                  }
                  size={18}
                  color={paymentBanner.type === "success" ? "#16A34A" : "#DC2626"}
                />
                <Text
                  style={[
                    styles.bannerText,
                    paymentBanner.type === "success"
                      ? styles.bannerTextSuccess
                      : styles.bannerTextError,
                  ]}
                >
                  {paymentBanner.text}
                </Text>
                <TouchableOpacity
                  onPress={() => setPaymentBanner(null)}
                  style={{ padding: 2 }}
                >
                  <Ionicons name="close" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        }
        ListEmptyComponent={
          <View style={styles.statusContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#2563EB" />
            ) : (
              <Text style={styles.emptyText}>
                {error || "No upcoming bookings found."}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const currentSlot = Array.isArray(item.availability)
            ? item.availability.find(
                (s) =>
                  s._id === item.availabilityId ||
                  (s.date === item.date && s.time === item.time)
              )
            : item.availability;
          const zoom = item.zoomLink || currentSlot?.zoomLink;
          const status = (item.status || "").toLowerCase().trim();
          const paymentStatus = (item.paymentStatus || "").toLowerCase().trim();
          const isPaymentPending = paymentStatus === "pending";
          const isWaitingApproval =
            status === "cancelled" || status === "rescheduled";
          const isRejected = status === "rejected";
          const rawImg =
            item.teacherUser?.profileImg ||
            item.teacherUser?.googleProfile?.picture ||
            item.teacherUser?.facebookProfile?.picture;
          const imageSource = formatProfileImage(rawImg);
          const isAvailable = checkTherapistAvailability(item.availability);
          const medium = (currentSlot?.medium || "").toLowerCase().trim();

          let actionButtonText: string | undefined = undefined;
          let actionButtonVariant: ButtonVariant = "green";
          let onActionButtonPress: (() => void) | undefined = undefined;
          let noticeText: string | undefined = undefined;

          if (isWaitingApproval) {
            noticeText = "Your request is waiting for approval from admin";
            actionButtonText = undefined;
            onActionButtonPress = undefined;
          } else if (isRejected) {
            actionButtonText = "Reschedule";
            actionButtonVariant = "Sky";
            onActionButtonPress = () => handleViewDetails(item);
          } else if (isPaymentPending) {
            actionButtonText =
              payingId === item._id ? "Processing..." : "Pay Now";
            actionButtonVariant = "blue";
            onActionButtonPress = () => void handlePayNow(item);
          } else if (zoom) {
            actionButtonText = "Join Meeting";
            actionButtonVariant = "green";
            onActionButtonPress = () => void Linking.openURL(zoom);
          } else if (medium === "center" || medium === "clinic") {
            actionButtonText = "At Clinic";
            actionButtonVariant = "blue";
            onActionButtonPress = () => handleViewDetails(item);
          } else if (medium === "home") {
            actionButtonText = "At Home";
            actionButtonVariant = "blue";
            onActionButtonPress = () => handleViewDetails(item);
          } else {
            actionButtonText = "Online";
            actionButtonVariant = "Sky";
            onActionButtonPress = () => handleViewDetails(item);
          }

          return (
            <DoctorListCard
              slotVariant="compact"
              image={imageSource}
              name={item.teacherUser?.name || "Therapist"}
              category={item.teacher?.therapist_category || "Therapist"}
              experience={item.teacher?.yearsOfExperience ?? 0}
              isAvailable={isAvailable}
              AppointDate={`${formatDate(item.date)} · ${item.time}`}
              AppointStatus={item.status}
              AppoinStatusVar={getStatusVariant(item.status)}
              noticeText={noticeText}
              actionButtonText={actionButtonText}
              actionButtonVariant={actionButtonVariant}
              onActionButtonPress={onActionButtonPress}
              showViewDetails={true}
              onViewDetails={() => handleViewDetails(item)}
            />
          );
        }}
        showsVerticalScrollIndicator={false}
      />
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
  },
  emptyText: { color: "#6B7280", fontSize: 16, textAlign: "center" },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 10,
    gap: 8,
    borderWidth: 1,
  },
  bannerSuccess: {
    backgroundColor: "#F0FDF4",
    borderColor: "#86EFAC",
  },
  bannerError: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FCA5A5",
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
  },
  bannerTextSuccess: {
    color: "#166534",
  },
  bannerTextError: {
    color: "#991B1B",
  },
});
