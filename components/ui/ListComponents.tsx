import { AvailabilitySlot } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import { router } from "expo-router";
import { ROUTES } from "@/constants/routes";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface DoctorListCardProps {
  image?: ImageSourcePropType;
  name: string;
  availability: AvailabilitySlot[];
  onBookNow: (slot: AvailabilitySlot) => void;
  appointmentBooking: () => void;
}

function formatDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  if (!day || !month || !year) return date;

  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function dateValue(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}

export default function DoctorListCard({
  image,
  name,
  availability,
  onBookNow,
  appointmentBooking,
}: DoctorListCardProps) {
  const availableSlots = useMemo(
    () => availability.filter((slot) => !slot.isBooked),
    [availability],
  );
  const dates = useMemo(
    () => [...new Set(availableSlots.map((slot) => slot.date))].sort((a, b) => dateValue(a) - dateValue(b)),
    [availableSlots],
  );
  const [selectedDate, setSelectedDate] = useState(dates[0] || "");
  const [showAllSlots, setShowAllSlots] = useState(false);

  useEffect(() => {
    setSelectedDate(dates[0] || "");
    setShowAllSlots(false);
  }, [dates]);

  const slotsForDate = availableSlots.filter(
    (slot) => slot.date === selectedDate,
  );
  const displayedSlots = showAllSlots ? slotsForDate : slotsForDate.slice(0, 3);
  const hasMoreSlots = slotsForDate.length > 3;
  const transition = useTransition();
  const selectNextDate = () => {
    const currentIndex = dates.indexOf(selectedDate);
    setSelectedDate(dates[(currentIndex + 1) % dates.length]);
    setShowAllSlots(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topSection}>
        <View>
          {image ? (
            <Image source={image} style={styles.image} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarLetter}>
                {name.trim().charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.availabilityStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Available</Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>Therapist</Text>
        </View>
      </View>

      {dates.length ? (
        <>
          <Pressable style={styles.dateBar} onPress={selectNextDate}>
            <Ionicons name="calendar-outline" size={27} color="#1682E7" />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
            {dates.length > 1 ? (
              <Ionicons name="chevron-forward" size={22} color="#1682E7" />
            ) : null}
          </Pressable>

          <View style={styles.slotsRow}>
            {displayedSlots.map((slot) => (
              <Pressable
                key={slot._id}
                style={styles.slotButton}
                onPress={() => onBookNow(slot)}
              >
                <Text style={styles.slotText}>{slot.time}</Text>
              </Pressable>
            ))}
            {hasMoreSlots ? (
              <Pressable
                style={styles.moreButton}
                onPress={() => setShowAllSlots((current) => !current)}
              >
                <Text style={styles.moreText}>{showAllSlots ? "Less" : "More"}</Text>
                <Ionicons
                  name={showAllSlots ? "chevron-up" : "chevron-down"}
                  size={19}
                  color="#1682E7"
                />
              </Pressable>
            ) : null}
            <View>
                  <Pressable
                    style={styles.button}
                    onPress={() => {
                      appointmentBooking();

                      transition.current?.cover(() => {
                        router.push(ROUTES.AUTH.BOOKDOCTOR);
                      });
                    }}
                  >
                <Text style={styles.buttonText}>Book Now</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noSlots}>No available slots at the moment.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 18,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 28,
    padding: 18,
    marginVertical: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  topSection: { flexDirection: "row", marginBottom: 16 },
  image: { width: 104, height: 104, borderRadius: 18 },
  avatarPlaceholder: {
    width: 104,
    height: 104,
    borderRadius: 18,
    backgroundColor: "#1682E7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { color: "#FFF", fontSize: 40, fontWeight: "700" },
  availabilityStatus: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 14 },
  statusDot: { width: 11, height: 11, borderRadius: 6, backgroundColor: "#49AD3D", marginRight: 8 },
  statusText: { color: "#49AD3D", fontSize: 15, fontWeight: "700" },
  details: { flex: 1, paddingLeft: 18, paddingTop: 4 },
  name: { color: "#101010", fontSize: 25, fontWeight: "700", lineHeight: 32 },
  specialty: { color: "#73798D", fontSize: 17, lineHeight: 25, marginTop: 6 },
  dateBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#EDF7FF", borderRadius: 13, minHeight: 58, paddingHorizontal: 16 },
  dateText: { flex: 1, color: "#1682E7", fontSize: 17, fontWeight: "700", marginLeft: 14 },
  slotsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  slotButton: { borderWidth: 2, borderColor: "#95CBF8", borderRadius: 11, paddingHorizontal: 16, paddingVertical: 11 },
  slotText: { color: "#1682E7", fontSize: 16, fontWeight: "700" },
  moreButton: { flexDirection: "row", alignItems: "center", borderWidth: 2, borderColor: "#95CBF8", borderRadius: 11, paddingHorizontal: 14, paddingVertical: 11, gap: 4 },
  moreText: { color: "#1682E7", fontSize: 16, fontWeight: "700" },
  noSlots: { color: "#73798D", fontSize: 15, marginTop: 4 },
});
