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
} from "@/services/authService";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  StyleSheet,
  Text,
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

export default function Bookings() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const parentId = await getLoggedInUserId();
      if (!parentId)
        throw new Error("Please sign in again to view your bookings.");
      const list = await getParentAppointments(parentId);
      list.sort((a, b) => {
        const da = parseAppointmentDate(a.date, a.time)?.getTime() || 0;
        const db = parseAppointmentDate(b.date, b.time)?.getTime() || 0;
        return db - da;
      });
      setAppointments(list);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load bookings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  const handleBookAgain = (item: Appointment) => {
    const therapistId =
      item.teacherId || item.teacher?.teacherId || item.teacher?.userId;
    const currentSlot = Array.isArray(item.availability)
      ? item.availability.find(
          (s) =>
            s._id === item.availabilityId ||
            (s.date === item.date && s.time === item.time)
        )
      : item.availability;
    router.push({
      pathname: ROUTES.AUTH.BOOKDOCTOR,
      params: {
        therapistId: String(therapistId),
        therapistName: item.teacherUser?.name || "Therapist",
        profileImg: item.teacherUser?.profileImg || "",
        therapistCategory: item.teacher?.therapist_category || "Therapist",
        yearsOfExperience: String(item.teacher?.yearsOfExperience ?? 0),
        medium: currentSlot?.medium || "online",
      },
    });
  };

  const handleViewDetails = (item: Appointment) => {
    router.push({
      pathname: ROUTES.AUTH.BOOKINGDETAILS,
      params: {
        appointmentId: item._id,
      },
    });
  };

  return (
    <>
      <OrientationLock variant="portrait" />
      <Header title="History" />
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={doctorStyles.heading}>Booking History</Text>
            <Text style={globalStyle.smallText2}>
              Here are the details of your Booking History.
            </Text>
          </>
        }
        ListEmptyComponent={
          <View style={styles.statusContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#2563EB" />
            ) : (
              <Text style={styles.emptyText}>
                {error || "No bookings found."}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const status = (item.status || "").toLowerCase().trim();
          const isPast =
            isPastAppointment(item.date, item.time) || status === "completed";
          const isWaitingApproval =
            !isPast && (status === "cancelled" || status === "rescheduled");
          const isRejected = !isPast && status === "rejected";
          const currentSlot = Array.isArray(item.availability)
            ? item.availability.find(
                (s) =>
                  s._id === item.availabilityId ||
                  (s.date === item.date && s.time === item.time)
              )
            : item.availability;
          const zoom = item.zoomLink || currentSlot?.zoomLink;
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
          let showViewDetails = true;

          if (isPast) {
            actionButtonText = "Book Again";
            actionButtonVariant = "solid";
            onActionButtonPress = () => handleBookAgain(item);
            showViewDetails = true;
          } else if (isWaitingApproval) {
            noticeText = "Your request is waiting for approval from admin";
            actionButtonText = undefined;
            onActionButtonPress = undefined;
            showViewDetails = true;
          } else if (isRejected) {
            actionButtonText = "Reschedule";
            actionButtonVariant = "Sky";
            onActionButtonPress = () => handleViewDetails(item);
            showViewDetails = true;
          } else if (zoom) {
            actionButtonText = "Join Meeting";
            actionButtonVariant = "green";
            onActionButtonPress = () => void Linking.openURL(zoom);
            showViewDetails = true;
          } else if (medium === "center" || medium === "clinic") {
            actionButtonText = "At Clinic";
            actionButtonVariant = "blue";
            onActionButtonPress = () => handleViewDetails(item);
            showViewDetails = true;
          } else if (medium === "home") {
            actionButtonText = "At Home";
            actionButtonVariant = "blue";
            onActionButtonPress = () => handleViewDetails(item);
            showViewDetails = true;
          } else {
            actionButtonText = "Online";
            actionButtonVariant = "Sky";
            onActionButtonPress = () => handleViewDetails(item);
            showViewDetails = true;
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
              showViewDetails={showViewDetails}
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
  listContent: { flexGrow: 1, padding: 20, backgroundColor: "#fff", },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
  },
  sessionText: { color: "#4B5563", fontSize: 16 },
  doctorName: { color: "#111827", fontWeight: "700" },
  dateTime: { color: "#6B7280", fontSize: 15, marginTop: 8 },
  status: {
    alignSelf: "flex-start",
    borderRadius: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pending: { backgroundColor: "#DBEAFE" },
  completed: { backgroundColor: "#DCFCE7" },
  cancelled: { backgroundColor: "#FEE2E2" },
  statusText: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  joinButton: {
    alignItems: "center",
    backgroundColor: "#16A34A",
    borderRadius: 9,
    marginTop: 14,
    paddingVertical: 11,
  },
  joinButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
  },
  emptyText: { color: "#6B7280", fontSize: 16, textAlign: "center" },
});
