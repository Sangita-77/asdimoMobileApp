import Button from "@/components/ButtonCompo/Button";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import Calender from "@/components/ui/Calender";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { LinearGradient } from "expo-linear-gradient";
import { styles as globalStyle } from "../../constants/globalStyle";
import { ROUTES } from "@/constants/routes";
import { router } from "expo-router";
import {
  AvailabilitySlot,
  createAppointment,
  getLoggedInUserId,
  getTherapistAvailability,
} from "@/services/authService";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
  const { therapistId: therapistIdParam, therapistName, profileImg } =
    useLocalSearchParams<{
      therapistId?: string;
      therapistName?: string;
      profileImg?: string;
    }>();
  const therapistId = Number(therapistIdParam);
  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");
  const [isBookingError, setIsBookingError] = useState(false);

  const loadAvailability = useCallback(async () => {
    if (!Number.isFinite(therapistId)) {
      setError("Therapist details are missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      const slots = await getTherapistAvailability(therapistId);
      setAvailability(slots);
      const firstAvailableDate = [...new Set(slots.map((slot) => slot.date))]
        .sort((a, b) => toDateValue(a).getTime() - toDateValue(b).getTime())
        .find((date) => !isPastDate(date));
      setSelectedDate(firstAvailableDate || "");
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load availability.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [therapistId]);

  useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

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

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setIsBookingError(true);
      setBookingMessage("Please choose an available time slot.");
      return;
    }

    const parentId = await getLoggedInUserId();
    if (!parentId) {
      setIsBookingError(true);
      setBookingMessage("Unable to identify your account. Please sign in again.");
      return;
    }

    try {
      setIsBooking(true);
      setBookingMessage("");
      const response = await createAppointment({
        teacherId: therapistId,
        date: selectedSlot.date,
        time: selectedSlot.time,
        parentId,
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

  const imageUri = profileImg
    ? `${API_BASE_URL.replace(/\/api$/, "")}${profileImg}`
    : "";
  const name = therapistName || "Therapist";

  return (
    <>
      <OrientationLock variant="portrait" />
      <View style={globalStyle.container}>
      <Header title="Book Appointment"/>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.profileContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={styles.doctorName}>{name}</Text>
        </View>

        {isLoading ? (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.heading}>Select Date</Text>
            <Calender
              selectedDate={selectedDate}
              availableDates={dates}
              onDateChange={(date) => {
                setSelectedDate(date);
                setSelectedSlot(null);
              }}
            />

            <Text style={styles.heading}>Select Time</Text>
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
            {!slotsForSelectedDate.length ? (
              <Text style={styles.noSlots}>No available time slots for this date.</Text>
            ) : null}

            {bookingMessage ? (
              <Text
                style={[
                  styles.bookingMessage,
                  isBookingError ? styles.bookingError : styles.bookingSuccess,
                ]}
              >
                {bookingMessage}
              </Text>
            ) : null}
            <Button
              text={isBooking ? "Booking..." : "Book Appointment"}
              textSize="lg"
              width="full"
              disabled={!selectedSlot || isBooking}
              onPress={handleBookAppointment}
            />
          </>
        )}
        <Button
         style={styles.PastbookingBtn}
          text="Bookings"
          textSize="lg"
          width="full"
          onPress={() => {
            router.push(ROUTES.AUTH.BOOKINGS);
          }}
        />
      </ScrollView>

      <Footer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  PastbookingBtn:{marginTop: 20},
  container: { padding: 20, flexGrow: 1 },
  profileContainer: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  placeholder: { width: 88, height: 88, borderRadius: 44, backgroundColor: "#2563EB", justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#FFF", fontSize: 34, fontWeight: "700" },
  doctorName: { color: "#111827", fontSize: 21, fontWeight: "700", marginTop: 10 },
  heading: { color: "#1F2937", fontSize: 18, fontWeight: "700", marginBottom: 10, marginTop: 14 },
  timeContainer: { flexDirection: "row", flexWrap: "wrap", gap: 12, paddingBottom: 20 },
  timeButton: { paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, borderWidth: 1, borderColor: "#93C5FD", backgroundColor: "#FFF" },
  selectedTime: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  disabledTime: { backgroundColor: "#d8d5d5", borderColor: "#E5E7EB" },
  timeText: { color: "#1D4ED8", fontWeight: "600" },
  selectedTimeText: { color: "#FFF" },
  disabledTimeText: { color: "#95a0b6" },
  noSlots: { color: "#888e99", marginBottom: 20 },
  statusContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 36 },
  errorText: { color: "#DC2626", textAlign: "center", fontSize: 16 },
  bookingMessage: { textAlign: "center", fontSize: 15, marginBottom: 12 },
  bookingError: { color: "#DC2626" },
  bookingSuccess: { color: "#16A34A" },
});
