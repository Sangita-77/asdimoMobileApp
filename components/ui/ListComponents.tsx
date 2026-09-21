import { AvailabilitySlot } from "@/services/authService";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
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
  category?: string;
  experience?: number | string;
  languages?: string[];
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
  category = "Therapist",
  experience,
  languages,
  availability,
  onBookNow,
  appointmentBooking,
}: DoctorListCardProps) {
  const availableSlots = useMemo(
    () => availability.filter((slot) => !slot.isBooked),
    [availability],
  );
  const dates = useMemo(
    () =>
      [...new Set(availableSlots.map((slot) => slot.date))].sort(
        (a, b) => dateValue(a) - dateValue(b),
      ),
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
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const selectPreviousDate = () => {
    if (selectedDateIndex > 0) {
      const newIndex = selectedDateIndex - 1;
      setSelectedDateIndex(newIndex);
      setSelectedDate(dates[newIndex]);
    }
  };

  const selectNextDate = () => {
    if (selectedDateIndex < dates.length - 1) {
      const newIndex = selectedDateIndex + 1;
      setSelectedDateIndex(newIndex);
      setSelectedDate(dates[newIndex]);
    }
  };

  const isAvailable = availableSlots.length > 0;

  const experienceText =
    experience !== undefined && experience !== null && experience !== ""
      ? `${experience}+ Years`
      : "0+ Years";

  const languagesText =
    Array.isArray(languages) && languages.length > 0
      ? languages.join(", ")
      : "";

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
            <View
              style={[
                styles.statusDot,
                !isAvailable && styles.unavailableDot,
              ]}
            />
            <Text
              style={[
                styles.statusText,
                !isAvailable && styles.unavailableText,
              ]}
            >
              {isAvailable ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.experience}>
            <Text style={styles.experienceSpan}>{experienceText}</Text> Experience
          </Text>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>{category || "Therapist"}</Text>
          {Boolean(languagesText) && (
            <Text style={styles.languagesText} numberOfLines={1}>
              Languages: <Text style={styles.languagesSpan}>{languagesText}</Text>
            </Text>
          )}

          {dates.length ? (
        <>
        <View style={styles.dateBar}>
          {/* Previous Date */}
          <Pressable
            style={styles.arrowButton}
            onPress={selectPreviousDate}
            disabled={selectedDateIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={16}
              color={selectedDateIndex === 0 ? "#B8B8B8" : "#1386E7"}
            />
          </Pressable>

          <Pressable style={styles.dateContent}>
            <Ionicons name="calendar-outline" size={15} color="#1386E7" />
            <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          </Pressable>

          <Pressable
            style={styles.arrowButton}
            onPress={selectNextDate}
            disabled={selectedDateIndex === dates.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={16}
              color={
                selectedDateIndex === dates.length - 1 ? "#B8B8B8" : "#1386E7"
              }
            />
          </Pressable>
        </View>

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
                <Text style={styles.moreText}>
                  {showAllSlots ? "Less" : "More"}
                </Text>
                <Ionicons
                  name={showAllSlots ? "chevron-up" : "chevron-down"}
                  size={12}
                  color="#1386E7"
                />
              </Pressable>
            ) : null}
            <View>
              <Pressable style={styles.button} onPress={appointmentBooking}>
                <Text style={styles.buttonText}>Book Now</Text>
              </Pressable>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.noSlots}>No available slots at the moment.</Text>
      )}
        </View>

      </View>

      
    </View>
  );
}

const styles = StyleSheet.create({
  arrowButton: { width: 30, height: 30, alignItems: "center", justifyContent: "center", },
  dateContent: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, },
  experienceSpan:{fontSize: 15, fontWeight: "600"},
  experience:{backgroundColor: "#abd8ff", width: 140, borderRadius: 4, color: "#054375", fontSize: 10, textAlign: "center", position: "absolute", right: 0, top: -23, padding: 2,},
  button: { backgroundColor: "#1386E7", paddingHorizontal: 8, paddingVertical: 8, borderRadius: 4, }, 
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 14, lineHeight: 14,},
  card: { backgroundColor: "#FFF", borderRadius: 15, borderWidth: 0, borderColor: "#e7e6e6", padding: 12, marginVertical: 15, elevation: 4, boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.44)", minHeight: 160,},
  topSection: { flexDirection: "row", },
  image: { width: 70, height: 70, borderRadius: 10 },
  avatarPlaceholder: { width: 95, height: 95, borderRadius: 10, backgroundColor: "#1682E7", justifyContent: "center", alignItems: "center", },
  avatarLetter: { color: "#FFF", fontSize: 40, fontWeight: "700" },
  availabilityStatus: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 7, },
  statusDot: { width: 4, height: 4, borderRadius: 6, backgroundColor: "#49AD3D", marginRight: 4, },
  statusText: { color: "#49AD3D", fontSize: 11, fontWeight: "400" },
  unavailableDot: { backgroundColor: "#E53935", },
  unavailableText: { color: "#E53935", },
  details: { flex: 1, paddingLeft: 11, paddingTop: 4 },
  name: { color: "#000000", fontSize: 18, fontWeight: "600", lineHeight: 20, marginTop: -5, },
  specialty: { color: "#74798B", fontSize: 12, lineHeight: 18 },

  languagesText: { color: "#74798B", fontSize: 10, lineHeight: 14, marginTop: 2, },
  languagesSpan: { color: "#1682E7", fontWeight: "500", },
  dateBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#EFF7FE", borderRadius: 4, minHeight: 20, paddingHorizontal: 6, paddingVertical: 2, marginTop: 8, },
  dateText: { flex: 1, color: "#1682E7", fontSize: 11, fontWeight: "600", marginLeft: 6, },

  slotsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  slotButton: { borderWidth: 2, borderColor: "#95CBF8", borderRadius: 4, paddingHorizontal: 9, paddingVertical: 3, minWidth: 55,},
  slotText: { color: "#1682E7", fontSize: 14,  lineHeight: 20, fontWeight: "600",  textAlign: "center",},
  moreButton: { flexDirection: "row", alignItems: "center", borderWidth: 2, borderColor: "#95CBF8", borderRadius: 4, paddingLeft: 9, paddingRight: 6, paddingVertical: 3, gap: 4, },
  moreText: { color: "#1682E7", fontSize: 11, fontWeight: "600" },
  noSlots: { color: "#73798D", fontSize: 11, marginTop: 4 },
});
