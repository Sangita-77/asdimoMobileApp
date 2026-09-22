import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import DoctorListCard from "@/components/ui/ListComponents";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import {
  Appointment,
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
  const s = (status || "").toLowerCase();
  if (s === "approved" || s === "completed") return "green";
  if (s === "cancelled" || s === "rejected") return "Red";
  return "Sky";
}

export default function UpcomingBooking() {
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
    const therapistId =
      item.teacherId || item.teacher?.teacherId || item.teacher?.userId;
    router.push({
      pathname: ROUTES.AUTH.BOOKDOCTOR,
      params: {
        therapistId: String(therapistId),
        therapistName: item.teacherUser?.name || "Therapist",
        profileImg: item.teacherUser?.profileImg || "",
        therapistCategory: item.teacher?.therapist_category || "Therapist",
        yearsOfExperience: String(item.teacher?.yearsOfExperience ?? 0),
        medium: item.availability?.medium || "online",
      },
    });
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
          const zoom = item.zoomLink || item.availability?.zoomLink;
          const status = (item.status || "").toLowerCase().trim();
          const isCancelledOrRejected =
            status === "cancelled" || status === "rejected";
          const rawImg =
            item.teacherUser?.profileImg ||
            item.teacherUser?.googleProfile?.picture ||
            item.teacherUser?.facebookProfile?.picture;
          const imageSource = formatProfileImage(rawImg);
          const isAvailable = item.availability?.isBooked === false;
          const medium = (item.availability?.medium || "").toLowerCase().trim();

          let actionButtonText = "Join Meeting";
          let actionButtonVariant: ButtonVariant = "green";
          let onActionButtonPress: () => void = () => {};

          if (isCancelledOrRejected || !zoom) {
            if (medium === "center" || medium === "clinic") {
              actionButtonText = "Meet at Clinic";
              actionButtonVariant = "blue";
              onActionButtonPress = () => handleViewDetails(item);
            } else if (medium === "home") {
              actionButtonText = "Meet at Home";
              actionButtonVariant = "blue";
              onActionButtonPress = () => handleViewDetails(item);
            } else {
              actionButtonText = "Online";
              actionButtonVariant = "Sky";
              onActionButtonPress = () => handleViewDetails(item);
            }
          } else {
            actionButtonText = "Join Meeting";
            actionButtonVariant = "green";
            onActionButtonPress = () => Linking.openURL(zoom);
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
});
