import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect, router } from "expo-router";

import Button from "@/components/ButtonCompo/Button";
import BookingSection from "@/components/ui/BookingSection";
import { Doctor } from "@/components/ui/DoctorBookingCard";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import {
  Appointment,
  getAppointmentsForParent,
  getLoggedInUserId,
} from "@/services/authService";

function parseAppointmentDateTime(
  dateStr: string,
  timeStr?: string,
): Date | null {
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

function formatProfileImage(rawImg?: string | null) {
  if (!rawImg) return undefined;
  if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
    return { uri: rawImg };
  }
  const cleanBase = API_BASE_URL.replace(/\/api$/, "");
  const cleanPath = rawImg.startsWith("/") ? rawImg : `/${rawImg}`;
  return { uri: `${cleanBase}${cleanPath}` };
}

function mapAppointmentToDoctor(item: Appointment): Doctor {
  const teacherUser = item.teacherUser;
  const teacher = item.teacher;
  const rawImg =
    teacherUser?.profileImg ||
    teacherUser?.googleProfile?.picture ||
    teacherUser?.facebookProfile?.picture;

  return {
    id: item._id,
    name: teacherUser?.name || "Therapist",
    specialty:
      teacher?.therapist_category ||
      (Array.isArray(teacher?.languages) && teacher.languages.length > 0
        ? teacher.languages.join(", ")
        : "Therapist"),
    image: formatProfileImage(rawImg),
    date: item.date,
    time: item.time,
    status: item.status,
    teacherId: item.teacherId || teacher?.teacherId || teacher?.userId,
    rawAppointment: item,
  };
}

export default function BookingsScreen() {
  const [pastBookings, setPastBookings] = useState<Doctor[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (isPullToRefresh = false) => {
    try {
      if (isPullToRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const parentId = await getLoggedInUserId();
      if (!parentId) {
        throw new Error("Please log in to view your appointments.");
      }

      // API call: POST appointments/getAppointmentsForParent with Bearer token & parentId payload
      const responseData = await getAppointmentsForParent(parentId);

      const now = new Date();
      const pastList: { appointment: Appointment; dateObj: Date }[] = [];
      const upcomingList: { appointment: Appointment; dateObj: Date }[] = [];

      (responseData || []).forEach((appointment) => {
        const dateObj = parseAppointmentDateTime(
          appointment.date,
          appointment.time,
        );
        if (dateObj){
          if (dateObj.getTime() < now.getTime()) {
            pastList.push({ appointment, dateObj });
          } else {
            upcomingList.push({ appointment, dateObj });
          }
        } else {
          // Fallback if date is not parsable
          pastList.push({ appointment, dateObj: new Date(0) });
        }
      });

      // Sort upcoming ascending (nearest first)
      upcomingList.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

      // Sort past descending (most recent first)
      pastList.sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());

      setUpcomingBookings(
        upcomingList.map((item) => mapAppointmentToDoctor(item.appointment)),
      );
      setPastBookings(
        pastList.map((item) => mapAppointmentToDoctor(item.appointment)),
      );
    } catch (err: any) {
      console.log("Error fetching appointments:", err);
      setError(
        err?.message || "Failed to load appointments. Please try again.",
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchAppointments();
    }, [fetchAppointments]),
  );

  const handleDoctorPress = (doctor: Doctor) => {
    const teacherId = doctor.teacherId;
    if (teacherId) {
      router.push({
        pathname: ROUTES.AUTH.BOOKDOCTOR,
        params: {
          therapistId: String(teacherId),
          therapistName: doctor.name,
          profileImg: doctor.rawAppointment?.teacherUser?.profileImg || "",
          therapistCategory: doctor.specialty || "Therapist",
          yearsOfExperience: String(
            doctor.rawAppointment?.teacher?.yearsOfExperience ?? 0,
          ),
          medium: "online",
        },
      });
    } else {
      router.push(ROUTES.AUTH.BOOKINGHISTORY);
    }
  };

  return (
    <>
      <OrientationLock variant="portrait" />
      <Header title="Doctor Booking" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void fetchAppointments(true)}
            colors={["#1386E7"]}
            tintColor="#1386E7"
          />
        }
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Past Booking */}
        <BookingSection
          title="Past Booking"
          icon="reload-outline"
          doctors={pastBookings}
          buttonVar="solid"
          buttonText="Book Again"
          emptyMessage="No past bookings"
          isLoading={isLoading && !isRefreshing}
          onDoctorPress={handleDoctorPress}
          onButtonPress={() => {
            router.push(ROUTES.AUTH.PASTBOOKING);
          }}
        />

        {/* Upcoming Booking */}
        <BookingSection
          title="Upcoming Bookings"
          icon="calendar"
          doctors={upcomingBookings}
          buttonVar="transparent"
          buttonText="View All"
          emptyMessage="No upcoming bookings"
          isLoading={isLoading && !isRefreshing}
          onDoctorPress={handleDoctorPress}
          onButtonPress={() => {
            router.push(ROUTES.AUTH.UPCOMINGBOOKING);
          }}
        />
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          text="New Appointment"
          width="half"
          textSize="md"
          onPress={() => {
            router.push(ROUTES.AUTH.DOCTORSLIST);
          }}
        />
        <Button
          text="Booking History"
          width="half"
          textSize="md"
          variant="green"
          onPress={() => {
            router.push(ROUTES.AUTH.BOOKINGHISTORY);
          }}
        />
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    paddingBottom: 30,
    padding: 10,
    gap: 10,
    backgroundColor: "#fff",
  },
  content: {
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 8,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    textAlign: "center",
  },
});