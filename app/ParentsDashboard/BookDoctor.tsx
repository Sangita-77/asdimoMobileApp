import Button from "@/components/ButtonCompo/Button";
import Calender from "@/components/ui/Calender";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";

import {
  AvailabilitySlot,
  getTherapistAvailability,
  getUserById,
  Therapist,
} from "@/services/authService";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
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

function normalizeMedium(medium?: string) {
  const value = (medium || "online").toLowerCase().trim();
  if (value === "clinic" || value === "centre" || value === "center") {
    return "center";
  }
  if (value === "room") return "online";
  return value || "online";
}

function formatMediumLabel(medium?: string) {
  switch (normalizeMedium(medium)) {
    case "home":
      return "Home";
    case "center":
      return "Center";
    case "online":
      return "Online";
    default:
      return "Medium";
  }
}

function formatPreviewDate(date: string) {
  if (!date) return "";
  return date.trim().replace(/-/g, ".");
}

function formatPreviewTime(time: string) {
  if (!time) return "";
  const trimmed = time.trim();
  if (/[ap]m$/i.test(trimmed)) {
    return trimmed.toLowerCase().replace(/\s+/g, "");
  }
  const parts = trimmed.split(":").map(Number);
  if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    const hours24 = parts[0];
    const minutes = String(parts[1]).padStart(2, "0");
    const period = hours24 >= 12 ? "pm" : "am";
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes}${period}`;
  }
  return trimmed;
}

function formatListValue(value: unknown, fallback: string): string {
  if (Array.isArray(value)) {
    const cleaned = value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
    if (cleaned.length > 0) return cleaned.join(", ");
  }
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
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
  const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlot[]>([]);
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
  const groupedSlotsByMedium = useMemo(() => {
    const mediumOrder = ["home", "center", "online"] as const;
    const grouped = new Map<string, AvailabilitySlot[]>();

    slotsForSelectedDate.forEach((slot) => {
      const medium = normalizeMedium(slot.medium);
      const existingSlots = grouped.get(medium) || [];
      grouped.set(medium, [...existingSlots, slot]);
    });

    return mediumOrder
      .map((medium) => ({
        medium,
        slots: (grouped.get(medium) || []).sort(
          (a, b) => a.time.localeCompare(b.time),
        ),
      }))
      .filter((group) => group.slots.length > 0);
  }, [slotsForSelectedDate]);

  const toggleSlotSelection = (slot: AvailabilitySlot) => {
    if (bookingMessage) {
      setBookingMessage("");
      setIsBookingError(false);
    }
    setSelectedSlots((current) => {
      const exists = current.some((item) => item._id === slot._id);
      if (exists) {
        return current.filter((item) => item._id !== slot._id);
      }
      return [...current, slot];
    });
  };

  const removeSelectedSlot = (slotId: string) => {
    setSelectedSlots((current) =>
      current.filter((item) => item._id !== slotId),
    );
  };

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
    (therapist as any)?.teacherData?.therapist_category ||
    therapistCategory ||
    "Disorders & Autism Specialist";

  const expYears =
    therapist?.roleData?.yearsOfExperience ??
    (therapist as any)?.teacherData?.yearsOfExperience ??
    (yearsOfExperience ? Number(yearsOfExperience) : null);

  const rawFee =
    (therapist as any)?.teacherData?.fees ??
    therapist?.roleData?.fees ??
    (therapist as any)?.fees ??
    therapist?.relatedData?.teacher?.fees ??
    therapist?.roleData?.amount ??
    (therapist as any)?.amount;
  const parsedFee = Number(rawFee);
  const displayFee =
    Number.isFinite(parsedFee) && parsedFee > 0 ? String(parsedFee) : "1500";

  const qualificationsText = formatListValue(
    therapist?.roleData?.qualifications ??
      (therapist as any)?.teacherData?.qualifications,
    "No Qualification",
  );

  const specializationText = formatListValue(
    therapist?.roleData?.specialization ??
      (therapist as any)?.teacherData?.specialization,
    category,
  );

  const languagesText = formatListValue(
    therapist?.roleData?.languages ??
      (therapist as any)?.teacherData?.languages,
    "English",
  );

  const clinicName =
    therapist?.roleData?.cliniqueName?.trim() ||
    (therapist as any)?.teacherData?.cliniqueName?.trim() ||
    "City Care";

  const rawAttachedWith =
    therapist?.roleData?.attachedWith ??
    therapist?.roleData?.organization ??
    therapist?.roleData?.organizationName ??
    therapist?.relatedData?.organization?.organizationName ??
    therapist?.relatedData?.organization?.name ??
    therapist?.relatedData?.organizationAdmin?.organizationName ??
    therapist?.relatedData?.organizationAdmin?.name ??
    (therapist as any)?.organizationName;

  const attachedWithText = formatListValue(
    rawAttachedWith,
    clinicName || "Child Care Center",
  );

  const localityText = [therapist?.city, therapist?.state]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(", ");

  const clinicWithLocalityText = localityText
    ? `${clinicName}, ${localityText}`
    : clinicName;

  const clinicAddressParts = [
    therapist?.address,
    therapist?.city,
    therapist?.state,
    therapist?.pincode,
  ].filter((part): part is string =>
    Boolean(part && typeof part === "string" && part.trim()),
  );

  const clinicAddressText =
    clinicAddressParts.length > 0
      ? clinicAddressParts.join(", ")
      : clinicName || "Address not available";

  const handleBookAppointment = () => {
    if (selectedSlots.length === 0) {
      setIsBookingError(true);
      setBookingMessage("Please choose at least one available time slot.");
      return;
    }

    setIsBookingError(false);
    setBookingMessage("");

    router.push({
      pathname: ROUTES.AUTH.REVIEWAPPOINTMENTS,
      params: {
        therapistId: String(therapistId),
        therapistName: name,
        therapistFee:
          Number.isFinite(parsedFee) && parsedFee > 0 ? String(parsedFee) : "",
        slots: JSON.stringify(selectedSlots),
      },
    });
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
              {/* Top Profile Header */}
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

                <View style={styles.profileDetails}>
                  <Text style={styles.headerDoctorName}>{name}</Text>
                  <Text style={styles.headerCategory}>{category}</Text>

                  <View style={styles.feesRow}>
                    <Text style={styles.feesLabel}>Fees- </Text>
                    <Text style={styles.feesAmount}>{displayFee}</Text>
                    <Text style={styles.feesSuffix}> /sessions</Text>
                  </View>

                  <View style={styles.specialitiesRow}>
                    <View style={styles.specialityItem}>
                      <Ionicons name="school" size={26} color="#007CDD" />
                      <Text style={styles.specialityTitle} numberOfLines={1}>
                        {qualificationsText}
                      </Text>
                      <Text style={styles.specialitySubtext} numberOfLines={1}>
                        {specializationText}
                      </Text>
                    </View>

                    <View style={styles.specialityItem}>
                      <MaterialCommunityIcons
                        name="hospital-building"
                        size={26}
                        color="#007CDD"
                      />
                      <Text style={styles.specialityTitle} numberOfLines={1}>
                        {clinicName}
                      </Text>
                      <Text style={styles.specialitySubtext} numberOfLines={1}>
                        Child Clinic
                      </Text>
                    </View>

                    <View style={styles.specialityItem}>
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={26}
                        color="#007CDD"
                      />
                      <Text style={styles.specialityTitle} numberOfLines={1}>
                        Languages
                      </Text>
                      <Text style={styles.specialitySubtext} numberOfLines={1}>
                        {languagesText}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* About Section */}
              <Text style={styles.sectionTitle}>About {name}</Text>
              <Text style={styles.aboutBioText}>
                {therapist?.roleData?.bio ||
                  therapist?.roleData?.about ||
                  `${name} is a dedicated specialist in ${category.toLowerCase()}${
                    expYears !== null && expYears !== undefined && expYears > 0
                      ? ` with over ${expYears} years of experience.`
                      : " with extensive experience."
                  } She focuses on early diagnosis, behavioral therapy, and family support to help children achieve their full potential.`}
              </Text>

              <View style={styles.aboutHighlightsList}>
                <View style={styles.aboutHighlightRow}>
                  <MaterialCommunityIcons
                    name="stethoscope"
                    size={18}
                    color="#6B7280"
                  />
                  <Text style={styles.aboutHighlightText}>
                    {category}
                    {expYears !== null && expYears !== undefined
                      ? `, ${expYears} Yrs Exp`
                      : ""}
                  </Text>
                </View>

                <View style={styles.aboutHighlightRow}>
                  <MaterialCommunityIcons
                    name="medical-bag"
                    size={18}
                    color="#6B7280"
                  />
                  <Text style={styles.aboutHighlightText}>
                    Attached with – {attachedWithText}
                  </Text>
                </View>

                <View style={styles.aboutHighlightRow}>
                  <MaterialCommunityIcons
                    name="office-building-outline"
                    size={18}
                    color="#6B7280"
                  />
                  <Text style={styles.aboutHighlightText}>
                    {clinicWithLocalityText}
                  </Text>
                </View>
              </View>

              {/* Clinic Address Card */}
              <View style={styles.clinicAddressCard}>
                <Ionicons
                  name="location-outline"
                  size={22}
                  color="#007CDD"
                  style={styles.clinicAddressIcon}
                />
                <View style={styles.clinicAddressContent}>
                  <Text style={styles.clinicAddressTitle}>Clinic Address</Text>
                  <Text style={styles.clinicAddressText}>
                    {clinicAddressText}
                  </Text>
                </View>
              </View>

              <Text style={styles.doctorName}>Select Date</Text>
              <View style={styles.selectDateWrap}>
                <Calender
                  selectedDate={selectedDate}
                  availableDates={dates}
                  onDateChange={(date) => {
                    setSelectedDate(date);
                  }}
                />
              </View>

              <View style={styles.selectTimeWrap}>
                <Text style={styles.doctorName}>Select Time</Text>
                {groupedSlotsByMedium.length ? (
                  groupedSlotsByMedium.map((group) => (
                    <View key={group.medium} style={styles.mediumGroup}>
                      <Text style={styles.mediumTitle}>
                        {formatMediumLabel(group.medium)}
                      </Text>
                      <View style={styles.timeContainer}>
                        {group.slots.map((slot) => {
                          const disabled = isPastTime(slot);
                          const isSelected = selectedSlots.some(
                            (item) => item._id === slot._id,
                          );
                          return (
                            <Pressable
                              key={slot._id}
                              disabled={disabled}
                              onPress={() => toggleSlotSelection(slot)}
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
                  ))
                ) : null}
              </View>
              {!slotsForSelectedDate.length ? (
                <Text style={styles.noSlots}>
                  No available time slots for this date.
                </Text>
              ) : null}

              {selectedSlots.length > 0 ? (
                <View style={styles.previewCard}>
                  <Text style={styles.previewTitle}>Booking preview</Text>
                  <View style={styles.previewList}>
                    {selectedSlots.map((slot) => {
                      const normalizedMedium = normalizeMedium(slot.medium);
                      const isOnline = normalizedMedium === "online";

                      return (
                        <View key={slot._id} style={styles.previewRow}>
                          <Ionicons
                            name="checkmark-circle-outline"
                            size={22}
                            color="#007CDD"
                          />
                          <Text style={styles.previewDateText}>
                            {formatPreviewDate(slot.date)}
                          </Text>
                          <View style={styles.previewMediumBadge}>
                            {isOnline ? (
                              <Ionicons
                                name="videocam"
                                size={15}
                                color="#007CDD"
                              />
                            ) : (
                              <MaterialCommunityIcons
                                name="home-plus"
                                size={16}
                                color="#007CDD"
                              />
                            )}
                          </View>
                          <Text style={styles.previewTimeText}>
                            {formatPreviewTime(slot.time)}
                          </Text>
                          <Text
                            style={styles.previewStatusText}
                            numberOfLines={1}
                          >
                            Appointment Booked
                          </Text>
                          <Pressable
                            onPress={() => removeSelectedSlot(slot._id)}
                            hitSlop={8}
                            style={styles.previewRemoveBtn}
                          >
                            <Feather name="x" size={18} color="#4B5563" />
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                </View>
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
                icon={<AntDesign name="calendar" size={24} color="white" />}
                variant="blue"
                disabled={selectedSlots.length === 0 || isBooking}
                onPress={handleBookAppointment}
              />
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
  profileContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 14,
    marginBottom: 8,
  },
  profileDetails: { flex: 1 },
  headerDoctorName: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "700",
  },
  headerCategory: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 2,
  },
  feesRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
    marginBottom: 10,
  },
  feesLabel: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },
  feesAmount: {
    color: "#007CDD",
    fontSize: 18,
    fontWeight: "700",
  },
  feesSuffix: {
    color: "#1F2937",
    fontSize: 11,
    fontWeight: "500",
  },
  specialitiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 4,
  },
  specialityItem: {
    flex: 1,
    alignItems: "flex-start",
  },
  specialityTitle: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
  },
  specialitySubtext: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "400",
    marginTop: 2,
  },
  avatar: {
    width: 125,
    height: 155,
    borderRadius: 18,
    backgroundColor: "#EBF5FF",
  },
  placeholder: {
    width: 125,
    height: 155,
    borderRadius: 18,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: { color: "#FFF", fontSize: 34, fontWeight: "700" },
  sectionTitle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 14,
    marginBottom: 6,
  },
  aboutBioText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "400",
  },
  aboutHighlightsList: {
    marginTop: 10,
    gap: 8,
  },
  aboutHighlightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aboutHighlightText: {
    flex: 1,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "400",
  },
  clinicAddressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginTop: 16,
    marginBottom: 8,
    gap: 10,
  },
  clinicAddressIcon: {
    marginTop: 1,
  },
  clinicAddressContent: {
    flex: 1,
  },
  clinicAddressTitle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
  },
  clinicAddressText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 4,
    lineHeight: 19,
  },
  doctorName: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 8,
  },
  mediumGroup: { marginTop: 12 },
  mediumTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#009BE9",
    backgroundColor: "#FFF",
  },
  selectedTime: { backgroundColor: "#007CDD", borderColor: "#009BE9" },
  disabledTime: { backgroundColor: "#d8d5d5", borderColor: "#E5E7EB" },
  timeText: { color: "#007CDD", fontSize: 12, fontWeight: "600" },
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

  selectDateWrap: {
    backgroundColor: "#fff",
    padding: 17,
    borderRadius: 10,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
  },
  selectTimeWrap: {
    marginTop: 27,
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 17,
    borderRadius: 10,
    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 24,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.06)",
    elevation: 2,
  },
  previewTitle: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  previewList: {
    gap: 10,
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  previewDateText: {
    color: "#3F3F46",
    fontSize: 14,
    fontWeight: "700",
  },
  previewMediumBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DCEEFF",
    alignItems: "center",
    justifyContent: "center",
  },
  previewTimeText: {
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "500",
  },
  previewStatusText: {
    flex: 1,
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
  },
  previewRemoveBtn: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
