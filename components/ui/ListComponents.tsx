import { AvailabilitySlot } from "@/services/authService";
import { Ionicons, Fontisto, SimpleLineIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Button, { ButtonVariant } from "../ButtonCompo/Button";

type SlotVariant = "default" | "compact";

interface DoctorListCardProps {
  
  image?: ImageSourcePropType;
  name?: string;
  category?: string;
  experience?: number | string;
  languages?: string[];
  availability?: AvailabilitySlot[];
  isAvailable?: boolean;
  onBookNow?: (slot: AvailabilitySlot) => void;
  appointmentBooking?: () => void;
  slotVariant?: SlotVariant;
  AppointDate?: string;
  AppointStatus?: string;
  Zoomlink?: () => void;
  ViewDetails?: () => void;
  AppoinStatusVar?: ButtonVariant;
  actionButtonText?: string;
  actionButtonVariant?: ButtonVariant;
  onActionButtonPress?: () => void;
  showViewDetails?: boolean;
  onViewDetails?: () => void;
  noticeText?: string;
}

const parseDate = (date: string) => {
  const [day, month, year] = date.split("-").map(Number);
  return day && month && year ? new Date(year, month - 1, day) : null;
};

const formatDate = (date: string) =>
  parseDate(date)?.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }) ?? date;

const isFutureSlot = (slot: AvailabilitySlot) => {
  const date = slot?.date && parseDate(slot.date);
  if (!date) return false;

  const [hours = 0, minutes = 0] = (slot.time || "00:00").split(":").map(Number);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime() > Date.now();
};

export default function DoctorListCard({
  image,
  name = "Doctor",
  category = "Therapist",
  experience,
  languages = [],
  availability = [],
  isAvailable: propIsAvailable,
  onBookNow = () => {},
  appointmentBooking = () => {},
  slotVariant = "default",
  AppointDate,
  AppointStatus,
  Zoomlink,
  ViewDetails,
  AppoinStatusVar = "Red",
  actionButtonText,
  actionButtonVariant = "green",
  onActionButtonPress,
  showViewDetails = true,
  onViewDetails,
  noticeText,
}: DoctorListCardProps) {
  


  const availableSlots = useMemo(
    () => availability.filter((slot) => !slot.isBooked && isFutureSlot(slot)),
    [availability]
  );

  const dates = useMemo(
    () =>
      [...new Set(availableSlots.map((slot) => slot.date))].sort(
        (a, b) => parseDate(a)!.getTime() - parseDate(b)!.getTime()
      ),
    [availableSlots]
  );

  const [selectedDate, setSelectedDate] = useState(dates[0] || "");
  const [showAllSlots, setShowAllSlots] = useState(false);
  const selectedDateIndex = Math.max(0, dates.indexOf(selectedDate));

  useEffect(() => {
    setSelectedDate(dates[0] || "");
    setShowAllSlots(false);
  }, [dates]);

  const slotsForDate = availableSlots.filter((slot) => slot.date === selectedDate);
  const displayedSlots = showAllSlots ? slotsForDate : slotsForDate.slice(0, 3);
  const hasMoreSlots = slotsForDate.length > 3;
  const isAvailable = propIsAvailable ?? availableSlots.length > 0;
  const { width } = useWindowDimensions();

  const changeDate = (direction: -1 | 1) => {
    const nextIndex = selectedDateIndex + direction;
    if (nextIndex < 0 || nextIndex >= dates.length) return;
    setSelectedDate(dates[nextIndex]);
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
              <Text style={styles.avatarLetter}>{name.trim().charAt(0).toUpperCase()}</Text>
            </View>
          )}

          <View style={styles.availabilityStatus}>
            <View style={[styles.statusDot, !isAvailable && styles.unavailableDot]} />
            <Text style={[styles.statusText, !isAvailable && styles.unavailableText]}>
              {isAvailable ? "Available" : "Unavailable"}
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.experience}>
            <Text style={styles.experienceSpan}>
              {experience !== undefined && experience !== null && experience !== ""
                ? `${experience}+ Years`
                : "0+ Years"}
            </Text>{" "}
            Experience
          </Text>

          <Text style={styles.name}>{name}</Text>
          <Text style={styles.specialty}>
            <Fontisto name="stethoscope" color="#74798B" /> {category || "Therapist"}
          </Text>
          <Text style={styles.specialty}>
            <SimpleLineIcons name="organization" color="#74798B" /> {category || "Therapist"}
          </Text>

          {slotVariant === "default" ? (
            <>
              {!!languages.length && (
                <Text style={styles.languagesText} numberOfLines={1}>
                  Languages: <Text style={styles.languagesSpan}>{languages.join(", ")}</Text>
                </Text>
              )}

              {dates.length ? (
                <>
                  <View style={styles.dateBar}>
                    <Pressable
                      style={styles.arrowButton}
                      onPress={() => changeDate(-1)}
                      disabled={selectedDateIndex === 0}
                    >
                      <Ionicons
                        name="chevron-back"
                        size={16}
                        color={selectedDateIndex === 0 ? "#B8B8B8" : "#1386E7"}
                      />
                    </Pressable>

                    <View style={styles.dateContent}>
                      <Ionicons name="calendar-outline" size={15} color="#1386E7" />
                      <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
                    </View>

                    <Pressable
                      style={styles.arrowButton}
                      onPress={() => changeDate(1)}
                      disabled={selectedDateIndex === dates.length - 1}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={selectedDateIndex === dates.length - 1 ? "#B8B8B8" : "#1386E7"}
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

                    {hasMoreSlots && (
                      <Pressable
                        style={styles.moreButton}
                        onPress={() => setShowAllSlots((current) => !current)}
                      >
                        <Text style={styles.moreText}>{showAllSlots ? "Less" : "More"}</Text>
                        <Ionicons
                          name={showAllSlots ? "chevron-up" : "chevron-down"}
                          size={12}
                          color="#1386E7"
                        />
                      </Pressable>
                    )}

                    <Pressable style={styles.button} onPress={appointmentBooking}>
                      <Text style={styles.buttonText}>Book Now</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={styles.specialty}>No available slots at the moment.</Text>
              )}
            </>
          ) : (
            <>
              <View style={styles.compactSlotsRow}>
                <View style={styles.appointDateBar}>
                  <Ionicons name="calendar-outline" size={15} color="#1386E7" />
                  <Text style={styles.dateText}>{AppointDate}</Text>
                </View>
                <View style={styles.statusButton}>
                  <Button
                    style={{ width: width * 0.3, height: width * 0.09 }}
                    text={AppointStatus ?? "Pending"}
                    variant={AppoinStatusVar}
                    textSize="xs"
                  />
                </View>
              </View>

              {!!noticeText && (
                <View style={styles.noticeRow}>
                  <Ionicons name="alert-circle-outline" size={13} color="#DC2626" />
                  <Text style={styles.noticeText}>{noticeText}</Text>
                </View>
              )}

              <View style={styles.compactSlotsRow}>
                {actionButtonText && onActionButtonPress ? (
                  <Button
                    text={actionButtonText}
                    variant={actionButtonVariant}
                    onPress={onActionButtonPress}
                  />
                ) : Zoomlink ? (
                  <Button text="Join Meeting" variant="green" onPress={Zoomlink} />
                ) : null}

                {showViewDetails && (onViewDetails || ViewDetails) && (
                  <Button
                    text="View Details"
                    variant="transparent"
                    onPress={onViewDetails || ViewDetails}
                  />
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    borderWidth: 0,
    borderColor: "#e7e6e6",
    padding: 12,
    marginVertical: 15,
    elevation: 4,
    boxShadow: "0px 0px 14px rgb(0 0 0 / 35%)",
    minHeight: 160,
  },
  topSection: { flexDirection: "row" },
  image: { width: 70, height: 70, borderRadius: 10 },
  avatarPlaceholder: {
    width: 95,
    height: 95,
    borderRadius: 10,
    backgroundColor: "#1682E7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLetter: { color: "#FFF", fontSize: 40, fontWeight: "700" },
  availabilityStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 6,
    backgroundColor: "#49AD3D",
    marginRight: 4,
  },
  statusText: { color: "#49AD3D", fontSize: 11, fontWeight: "400" },
  unavailableDot: { backgroundColor: "#E53935" },
  unavailableText: { color: "#E53935" },
  details: { flex: 1, paddingLeft: 11, paddingTop: 4 },
  experience: {
    backgroundColor: "#abd8ff",
    width: 140,
    borderRadius: 4,
    color: "#054375",
    fontSize: 10,
    textAlign: "center",
    position: "absolute",
    right: 0,
    top: -23,
    padding: 2,
  },
  experienceSpan: { fontSize: 15, fontWeight: "600" },
  name: { color: "#000", fontSize: 18, fontWeight: "600", lineHeight: 20, marginTop: -5 },
  specialty: { color: "#74798B", fontSize: 12, lineHeight: 17 },
  languagesText: { color: "#74798B", fontSize: 10, lineHeight: 14, marginTop: 2 },
  languagesSpan: { color: "#1682E7", fontWeight: "500" },
  dateBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF7FE",
    borderRadius: 4,
    minHeight: 20,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 8,
  },
  appointDateBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF7FE",
    borderRadius: 4,
    minHeight: 20,
    paddingHorizontal: 3,
    paddingVertical: 2,
    width: "100%",
  },
  dateContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  dateText: {
    flex: 1,
    color: "#1682E7",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
    paddingVertical: 10,
    paddingRight: 10,
  },
  arrowButton: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  slotsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  slotButton: {
    borderWidth: 2,
    borderColor: "#95CBF8",
    borderRadius: 4,
    paddingHorizontal: 9,
    paddingVertical: 3,
    minWidth: 55,
  },
  slotText: { color: "#1682E7", fontSize: 14, lineHeight: 20, fontWeight: "600", textAlign: "center" },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#95CBF8",
    borderRadius: 4,
    paddingLeft: 9,
    paddingRight: 6,
    paddingVertical: 3,
    gap: 4,
  },
  moreText: { color: "#1682E7", fontSize: 11, fontWeight: "600" },
  button: { backgroundColor: "#1386E7", paddingHorizontal: 8, paddingVertical: 8, borderRadius: 4 },
  buttonText: { color: "#FFF", fontWeight: "600", fontSize: 14, lineHeight: 14 },
  statusButton: { flexDirection: "row", justifyContent: "flex-end" },
  compactSlotsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8, alignItems: "center" },
  noticeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  noticeText: { color: "#DC2626", fontSize: 9, fontWeight: "600", flex: 1 },
});
