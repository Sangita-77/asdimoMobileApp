import Button from "@/components/ButtonCompo/Button";
import Calender from "@/components/ui/Calender";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
// import { ROUTES } from "@/constants/routes";
import MyList, { ListItem } from "@/components/ui/IconTitleText";

import {
  AvailabilitySlot,
  createAppointment,
  getAccessToken,
  getLoggedInUserId,
  getTherapistAvailability,
  getUserById,
  Therapist,
} from "@/services/authService";
import { processPayment } from "@/services/paymentService";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { globalStyle } from "../../constants/globalStyle";

function toDateValue(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isPastDate(date: string) {
  const selectedDate = toDateValue(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selectedDate < today;
}

function isPastTime(slot: AvailabilitySlot) {
  const selectedDate = toDateValue(slot.date);
  const now = new Date();
  if (selectedDate.toDateString() !== now.toDateString()) return false;

  const [hours, minutes] = slot.time.split(":").map(Number);
  selectedDate.setHours(hours, minutes, 0, 0);
  return selectedDate <= now;
}

export default function BookDoctor() {
  const {
    therapistId: therapistIdParam,
    therapistName,
    profileImg,
    therapistCategory,
    yearsOfExperience,
  } = useLocalSearchParams<{
    therapistId?: string;
    therapistName?: string;
    profileImg?: string;
    therapistCategory?: string;
    yearsOfExperience?: string;
  }>();
  const therapistId = Number(therapistIdParam);
  const [therapist, setTherapist] = useState<Therapist | null>(null);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingError, setIsBookingError] = useState(false);

  const loadData = useCallback(async () => {
    if (!Number.isFinite(therapistId)) {
      setError("Therapist details are missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const [slots, therapistData] = await Promise.all([
        getTherapistAvailability(therapistId).catch(() => []),
        getUserById(therapistId).catch((err) => {
          console.warn("Failed to fetch user by id:", err);
          return null;
        }),
      ]);

      setAvailability(slots);
      if (therapistData) {
        setTherapist(therapistData);
      }
      const firstAvailableDate = [...new Set(slots.map((slot) => slot.date))]
        .sort((a, b) => toDateValue(a).getTime() - toDateValue(b).getTime())
        .find((date) => !isPastDate(date));
      setSelectedDate(firstAvailableDate || "");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load details.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [therapistId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const dates = useMemo(
    () =>
      [...new Set(availability.map((slot) => slot.date))].sort(
        (a, b) => toDateValue(a).getTime() - toDateValue(b).getTime(),
      ),
    [availability],
  );
  const slotsForSelectedDate = availability.filter(
    (slot) => slot.date === selectedDate && !slot.isBooked,
  );

  const rawProfileImg =
    therapist?.profileImg ||
    therapist?.googleProfile?.picture ||
    therapist?.facebookProfile?.picture ||
    profileImg ||
    "";
  const imageUri = rawProfileImg
    ? rawProfileImg.startsWith("http")
      ? rawProfileImg
      : `${API_BASE_URL.replace(/\/api$/, "")}${rawProfileImg}`
    : "";

  const name = therapist?.name || therapistName || "Therapist";
  const category =
    therapist?.roleData?.therapist_category ||
    therapistCategory ||
    "Therapist";

  const expYears =
    therapist?.roleData?.yearsOfExperience ??
    (yearsOfExperience ? Number(yearsOfExperience) : null);

  const languages = therapist?.roleData?.languages;
  const languagesText =
    Array.isArray(languages) && languages.length > 0
      ? languages.join(", ")
      : "English";

  const clinicName = therapist?.roleData?.cliniqueName?.trim();

  const specialities: ListItem[] = useMemo(() => {
    const items: ListItem[] = [];

    // Show Clinic only when cliniqueName exists
    if (clinicName) {
      items.push({
        icon: "home-outline",
        title: "Clinic",
        text: clinicName,
      });
    }

    // Languages always shown
    items.push({
      icon: "language",
      title: "Languages",
      text: languagesText,
    });

    return items;
  }, [clinicName, languagesText]);

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setIsBookingError(true);
      setBookingMessage("Please choose an available time slot.");
      return;
    }

    const parentId = await getLoggedInUserId();
    if (!parentId) {
      setIsBookingError(true);
      setBookingMessage(
        "Unable to identify your account. Please sign in again.",
      );
      return;
    }

    try {
      setIsBooking(true);
      setBookingMessage("");
      const appointmentPayload = {
        teacherId: therapistId,
        date: selectedSlot.date,
        time: selectedSlot.time,
        parentId,
      };
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const paymentResult = await processPayment({
        amount: 499,
        description: `Consultation with ${name}`,
        user: { parentId },
        metadata: {
          source: "mobile-book-appointment",
          appointment: appointmentPayload,
        },
      });

      if (!paymentResult.success || !paymentResult.paymentId) {
        throw new Error("Payment could not be confirmed.");
      }

      const response = await createAppointment({
        ...appointmentPayload,
        paymentId: paymentResult.paymentId,
      });
      setAvailability((current) =>
        current.map((slot) =>
          slot._id === selectedSlot._id ? { ...slot, isBooked: true } : slot,
        ),
      );
      setSelectedSlot(null);
      setIsBookingError(false);
      setBookingMessage(response.message || "Appointment booked successfully.");
    } catch (bookingError) {
      setIsBookingError(true);
      setBookingMessage(
        bookingError instanceof Error
          ? bookingError.message
          : "Unable to book appointment. Please try again.",
      );
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <>
      <OrientationLock variant="portrait" />
      <View style={globalStyle.container}>
        <Header title="Doctor Profile" showBack={true} />
        <ScrollView contentContainerStyle={styles.container}>
         {isLoading ? (
            <View style={styles.statusContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
            </View>
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <View style={styles.profileContainer}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.avatar} />
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}> {name.charAt(0).toUpperCase()} </Text>
                  </View>
                )}
                <View style={styles.profileDetails}>
                  <Text style={styles.doctorName}>{name}</Text>
                  <Text style={globalStyle.smallText2}>{category}</Text>
                  <View style={styles.specialitiesRow}>
                    <MyList items={specialities} />
                  </View>
                </View>
              </View>
              <Text style={styles.doctorName}>About {name}</Text>
               <Text style={globalStyle.smallText2}>
                 {name} is a dedicated specialist in {category.toLowerCase()}
                 {expYears !== null && expYears !== undefined && expYears > 0
                   ? ` with over ${expYears} years of experience.`
                   : " with extensive experience in therapy and child development."}
               </Text>
                  <Text style={styles.doctorName}>Select Date</Text>
                  <View style={styles.selectDateWrap}>
                    <Calender
                      selectedDate={selectedDate}
                      availableDates={dates}
                      onDateChange={(date) => {
                        setSelectedDate(date);
                        setSelectedSlot(null);
                      }}
                    />
                  </View>

                  <View style={styles.selectTimeWrap}>
                    <Text style={styles.doctorName}>Select Time</Text>
                    <View style={styles.timeContainer}>
                      {slotsForSelectedDate.map((slot) => {
                        const disabled = isPastTime(slot);
                        const isSelected = selectedSlot?._id === slot._id;
                        return (
                          <Pressable
                            key={slot._id}
                            disabled={disabled}
                            onPress={() => setSelectedSlot(slot)}
                            style={[
                              styles.timeButton,
                              isSelected && styles.selectedTime,
                              disabled && styles.disabledTime,
                            ]}
                          >
                            <Text
                              style={[
                                styles.timeText,
                                isSelected && styles.selectedTimeText,
                                disabled && styles.disabledTimeText,
                              ]}
                            >
                              {slot.time}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                  {!slotsForSelectedDate.length ? (
                    <Text style={styles.noSlots}>
                      No available time slots for this date.
                    </Text>
                  ) : null}

                  {bookingMessage ? (
                    <Text
                      style={[
                        styles.bookingMessage,
                        isBookingError
                          ? styles.bookingError
                          : styles.bookingSuccess,
                      ]}
                    >
                      {bookingMessage}
                    </Text>
                  ) : null}
                  <Button
                    text={isBooking ? "Booking..." : "Book Appointment"}
                    textSize="lg"
                    width="full"
                    icon={
                      <AntDesign
                        name="calendar"
                        size={24}
                        color="white"
                      />
                    }
                    variant="blue"
                    disabled={!selectedSlot || isBooking}
                    onPress={handleBookAppointment}
                  />

                {/* <Button
                  style={styles.PastbookingBtn}
                  text="Bookings"
                  textSize="lg"
                  width="full"
                  onPress={() => {
                    router.push(ROUTES.AUTH.BOOKINGS);
                  }}
                /> */}
          </>
          )}
        </ScrollView>
  
      </View>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  PastbookingBtn: { marginTop: 20 },
  container: { padding: 20, flexGrow: 1, paddingBottom: 85 },
  profileContainer: { alignItems: "center", flexDirection: "row", gap: 15 },
  profileDetails: { flex: 1 },
  specialitiesRow: { flexDirection: "row", gap: 15, alignItems: "center" },
  avatar: { width: 125, height: 140, borderRadius: 20 },
  placeholder: {
    width: 125,
    height: 140,
    borderRadius: 44,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#FFF", fontSize: 34, fontWeight: "700" },
  doctorName: { color: "#000000", fontSize: 16, fontWeight: "600", marginTop: 10 },
  timeContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingTop: 15, },
  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#93C5FD",
    backgroundColor: "#FFF",
  },
  selectedTime: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  disabledTime: { backgroundColor: "#d8d5d5", borderColor: "#E5E7EB" },
  timeText: { color: "#1D4ED8", fontWeight: "600" },
  selectedTimeText: { color: "#FFF" },
  disabledTimeText: { color: "#95a0b6" },
  noSlots: { color: "#888e99", marginBottom: 20 },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
  },
  errorText: { color: "#DC2626", textAlign: "center", fontSize: 16 },
  bookingMessage: { textAlign: "center", fontSize: 15, marginBottom: 12 },
  bookingError: { color: "#DC2626" },
  bookingSuccess: { color: "#16A34A" },

  selectDateWrap: { backgroundColor: "#fff", padding: 17, borderRadius: 10, boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)", },
  selectTimeWrap: {marginTop: 27, marginBottom: 27, backgroundColor: "#fff", padding: 17, borderRadius: 10, boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",},
});
