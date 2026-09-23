import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  AvailabilitySlot,
  cancelAppointment,
  getTeacherAvailableSlots,
  rescheduleAppointment,
} from "@/services/authService";

type ActionType = "reschedule" | "cancel";

export interface AppointmentActionSuccessData {
  type: ActionType;
  status: string;
  date?: string;
  time?: string;
  reason?: string;
}

interface AppointmentActionModalProps {
  visible: boolean;
  type: ActionType;
  appointmentId?: string;
  teacherUserId?: number | string;
  doctorName?: string;
  currentDate?: string;
  currentTime?: string;
  onClose: () => void;
  onSuccess?: (data: AppointmentActionSuccessData) => void;
}

const CANCEL_REASONS = [
  "Schedule conflict",
  "Doctor unreachable",
  "Personal emergency",
  "Booked by mistake",
  "Feeling better",
  "Other reason",
];

const RESCHEDULE_REASONS = [
  "Need a different time",
  "Doctor requested reschedule",
  "Emergency conflict",
  "Work commitment",
  "Other reason",
];

function formatDatePill(dateStr: string) {
  if (!dateStr) return { dayName: "", dayNum: "", monthName: "" };
  const parts = dateStr.trim().split("-").map(Number);
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const [day, month, year] = parts;
    const d = new Date(year, month - 1, day);
    const dayName = d.toLocaleDateString("en-IN", { weekday: "short" });
    const monthName = d.toLocaleDateString("en-IN", { month: "short" });
    return { dayName, dayNum: String(day), monthName };
  }
  return { dayName: "", dayNum: dateStr, monthName: "" };
}

function parseDateValue(dateStr: string) {
  const parts = dateStr.trim().split("-").map(Number);
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(year, month - 1, day).getTime();
  }
  return 0;
}

export default function AppointmentActionModal({
  visible,
  type,
  appointmentId,
  teacherUserId,
  doctorName,
  currentDate,
  currentTime,
  onClose,
  onSuccess,
}: AppointmentActionModalProps) {
  const isCancel = type === "cancel";

  // Form states
  const [selectedDate, setSelectedDate] = useState(currentDate || "");
  const [selectedTime, setSelectedTime] = useState(currentTime || "");
  const [reason, setReason] = useState("");

  // Slots loading states
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  // Submission states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch slots on open when rescheduling
  useEffect(() => {
    if (visible) {
      setReason("");
      setActionError(null);
      setSelectedDate(currentDate || "");
      setSelectedTime(currentTime || "");

      if (type === "reschedule" && teacherUserId) {
        let isMounted = true;
        setSlotsLoading(true);

        getTeacherAvailableSlots(teacherUserId)
          .then((slots) => {
            if (!isMounted) return;
            const today = new Date();
            const todayValue = new Date(
              today.getFullYear(),
              today.getMonth(),
              today.getDate()
            ).getTime();

            const validSlots = (slots || []).filter((slot) => {
              return !slot.isBooked && parseDateValue(slot.date) >= todayValue;
            });

            setAvailableSlots(validSlots);

            // If current date not in list, auto-select first available date
            const dates = Array.from(new Set(validSlots.map((s) => s.date)));
            if (dates.length > 0) {
              const initialD = dates.includes(currentDate || "")
                ? currentDate || dates[0]
                : dates[0];
              setSelectedDate(initialD);

              const times = validSlots
                .filter((s) => s.date === initialD)
                .map((s) => s.time);
              if (times.length > 0) {
                setSelectedTime(times[0]);
              }
            }
          })
          .catch((err) => {
            if (isMounted) {
              console.warn("Could not load available slots:", err);
            }
          })
          .finally(() => {
            if (isMounted) setSlotsLoading(false);
          });

        return () => {
          isMounted = false;
        };
      }
    }
  }, [visible, type, teacherUserId, currentDate, currentTime]);

  // Derived available dates & times
  const availableDates = useMemo(() => {
    return Array.from(new Set(availableSlots.map((s) => s.date)));
  }, [availableSlots]);

  const availableTimes = useMemo(() => {
    return availableSlots
      .filter((s) => s.date === selectedDate)
      .map((s) => s.time);
  }, [availableSlots, selectedDate]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    const times = availableSlots
      .filter((s) => s.date === date)
      .map((s) => s.time);
    if (times.length > 0) {
      setSelectedTime(times[0]);
    } else {
      setSelectedTime("");
    }
  };

  const handleCancelSubmit = async () => {
    if (!reason.trim()) {
      setActionError("Please provide a reason for cancellation.");
      return;
    }
    if (!appointmentId) {
      setActionError("Appointment ID is missing.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      const res = await cancelAppointment(appointmentId, reason.trim());
      const updatedStatus = res?.data?.status || "cancelled";

      onSuccess?.({
        type: "cancel",
        status: updatedStatus,
        reason: reason.trim(),
      });
      onClose();
    } catch (err: any) {
      console.error("Cancel appointment error:", err);
      setActionError(
        err?.message || "Failed to cancel appointment. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setActionError("Please select both a date and time slot.");
      return;
    }
    if (!reason.trim()) {
      setActionError("Please provide a reason for rescheduling.");
      return;
    }
    if (!appointmentId) {
      setActionError("Appointment ID is missing.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);
      const res = await rescheduleAppointment(appointmentId, {
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim(),
      });

      const updatedStatus = res?.data?.status || "approved";
      const updatedDate = res?.data?.date || selectedDate;
      const updatedTime = res?.data?.time || selectedTime;

      onSuccess?.({
        type: "reschedule",
        status: updatedStatus,
        date: updatedDate,
        time: updatedTime,
        reason: reason.trim(),
      });
      onClose();
    } catch (err: any) {
      console.error("Reschedule appointment error:", err);
      setActionError(
        err?.message || "Failed to reschedule appointment. Please try again."
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (!actionLoading) onClose();
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.backdrop}
      >
        <Pressable
          style={styles.dismissOverlay}
          onPress={() => {
            if (!actionLoading) onClose();
          }}
        />

        <View style={styles.sheetContainer}>
          {/* Top handle pill for native app look */}
          <View style={styles.dragHandle} />

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            disabled={actionLoading}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={22} color="#64748B" />
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header Icon + Title */}
            <View style={styles.headerArea}>
              <View
                style={[
                  styles.iconCircle,
                  isCancel ? styles.cancelIconBg : styles.rescheduleIconBg,
                ]}
              >
                <Ionicons
                  name={isCancel ? "alert-circle" : "calendar"}
                  size={30}
                  color={isCancel ? "#EF4444" : "#1386E7"}
                />
              </View>

              <Text style={styles.sheetTitle}>
                {isCancel ? "Cancel Appointment" : "Reschedule Appointment"}
              </Text>
              <Text style={styles.sheetSubtitle}>
                {isCancel
                  ? "Are you sure you want to cancel? Please tell us why."
                  : "Choose a new available slot and give a reason for change."}
              </Text>
            </View>

            {/* Appointment mini summary */}
            {(doctorName || currentDate) && (
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Ionicons name="person-circle-outline" size={18} color="#1386E7" />
                  <Text style={styles.summaryDoctor} numberOfLines={1}>
                    {doctorName || "Therapist"}
                  </Text>
                </View>
                {currentDate ? (
                  <View style={styles.summaryRow}>
                    <Ionicons name="time-outline" size={16} color="#64748B" />
                    <Text style={styles.summaryTime}>
                      {currentDate} {currentTime ? `· ${currentTime}` : ""}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}

            {/* Error Message Banner */}
            {actionError ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
                <Text style={styles.errorBannerText}>{actionError}</Text>
              </View>
            ) : null}

            {/* RESCHEDULE BODY */}
            {!isCancel && (
              <View style={styles.sectionBody}>
                {/* Date Selection */}
                <Text style={styles.sectionLabel}>Select New Date</Text>
                {slotsLoading ? (
                  <View style={styles.inlineLoader}>
                    <ActivityIndicator size="small" color="#1386E7" />
                    <Text style={styles.inlineLoaderText}>
                      Checking available dates...
                    </Text>
                  </View>
                ) : availableDates.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.datePillsScroll}
                  >
                    {availableDates.map((dateKey) => {
                      const { dayName, dayNum, monthName } =
                        formatDatePill(dateKey);
                      const isSelected = selectedDate === dateKey;
                      return (
                        <TouchableOpacity
                          key={dateKey}
                          style={[
                            styles.datePill,
                            isSelected && styles.datePillActive,
                          ]}
                          onPress={() => handleDateSelect(dateKey)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.datePillMonth,
                              isSelected && styles.datePillTextActive,
                            ]}
                          >
                            {monthName}
                          </Text>
                          <Text
                            style={[
                              styles.datePillDayNum,
                              isSelected && styles.datePillTextActive,
                            ]}
                          >
                            {dayNum}
                          </Text>
                          <Text
                            style={[
                              styles.datePillDayName,
                              isSelected && styles.datePillTextActive,
                            ]}
                          >
                            {dayName}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                ) : (
                  <View style={styles.fallbackInputBox}>
                    <Ionicons name="calendar-outline" size={18} color="#1386E7" />
                    <TextInput
                      style={styles.fallbackInput}
                      value={selectedDate}
                      onChangeText={setSelectedDate}
                      placeholder="DD-MM-YYYY"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                )}

                {/* Time Selection */}
                <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
                  Select Time Slot
                </Text>
                {availableTimes.length > 0 ? (
                  <View style={styles.timeChipsGrid}>
                    {availableTimes.map((timeKey) => {
                      const isSelected = selectedTime === timeKey;
                      return (
                        <TouchableOpacity
                          key={timeKey}
                          style={[
                            styles.timeChip,
                            isSelected && styles.timeChipActive,
                          ]}
                          onPress={() => setSelectedTime(timeKey)}
                          activeOpacity={0.8}
                        >
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={isSelected ? "#FFF" : "#1386E7"}
                          />
                          <Text
                            style={[
                              styles.timeChipText,
                              isSelected && styles.timeChipTextActive,
                            ]}
                          >
                            {timeKey}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.fallbackInputBox}>
                    <Ionicons name="time-outline" size={18} color="#1386E7" />
                    <TextInput
                      style={styles.fallbackInput}
                      value={selectedTime}
                      onChangeText={setSelectedTime}
                      placeholder="HH:mm (e.g. 11:00)"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                )}

                {/* Quick Presets for Reschedule Reason */}
                <Text style={[styles.sectionLabel, { marginTop: 18 }]}>
                  Reason for Rescheduling
                </Text>
                <View style={styles.presetChipsWrap}>
                  {RESCHEDULE_REASONS.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        styles.presetChip,
                        reason === preset && styles.presetChipSelected,
                      ]}
                      onPress={() => setReason(preset)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          reason === preset && styles.presetChipTextSelected,
                        ]}
                      >
                        {preset}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Multiline Reason Input */}
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Type specific reason or details here..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {/* CANCEL BODY */}
            {isCancel && (
              <View style={styles.sectionBody}>
                {/* Quick Presets for Cancellation Reason */}
                <Text style={styles.sectionLabel}>Reason for Cancellation</Text>
                <View style={styles.presetChipsWrap}>
                  {CANCEL_REASONS.map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[
                        styles.presetChip,
                        styles.presetChipCancel,
                        reason === preset && styles.presetChipCancelSelected,
                      ]}
                      onPress={() => setReason(preset)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          reason === preset && styles.presetChipTextSelected,
                        ]}
                      >
                        {preset}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Multiline Reason Input */}
                <TextInput
                  style={styles.reasonInput}
                  value={reason}
                  onChangeText={setReason}
                  placeholder="Explain why you are cancelling this appointment..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={onClose}
                disabled={actionLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.secondaryBtnText}>
                  {isCancel ? "Keep Booking" : "Dismiss"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  isCancel ? styles.cancelPrimaryBtn : styles.reschedulePrimaryBtn,
                  actionLoading && styles.btnDisabled,
                ]}
                onPress={isCancel ? handleCancelSubmit : handleRescheduleSubmit}
                disabled={actionLoading}
                activeOpacity={0.85}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <>
                    <Ionicons
                      name={isCancel ? "trash-outline" : "calendar-outline"}
                      size={18}
                      color="#FFF"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.primaryBtnText}>
                      {isCancel ? "Cancel Booking" : "Confirm Reschedule"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  dismissOverlay: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 34 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 8,
  },
  closeBtn: {
    position: "absolute",
    right: 18,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerArea: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cancelIconBg: {
    backgroundColor: "#FEE2E2",
  },
  rescheduleIconBg: {
    backgroundColor: "#EAF6FF",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
    gap: 4,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  summaryDoctor: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  summaryTime: {
    fontSize: 13,
    color: "#64748B",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    color: "#DC2626",
    fontSize: 13,
    fontWeight: "500",
  },
  sectionBody: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  inlineLoader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  inlineLoaderText: {
    fontSize: 13,
    color: "#64748B",
  },
  datePillsScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  datePill: {
    width: 68,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  datePillActive: {
    backgroundColor: "#1386E7",
    borderColor: "#1386E7",
    shadowColor: "#1386E7",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  datePillMonth: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
  },
  datePillDayNum: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginVertical: 2,
  },
  datePillDayName: {
    fontSize: 11,
    fontWeight: "500",
    color: "#94A3B8",
  },
  datePillTextActive: {
    color: "#FFFFFF",
  },
  timeChipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  timeChipActive: {
    backgroundColor: "#1386E7",
    borderColor: "#1386E7",
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
  },
  timeChipTextActive: {
    color: "#FFFFFF",
  },
  fallbackInputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  fallbackInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  presetChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  presetChip: {
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  presetChipSelected: {
    backgroundColor: "#1386E7",
    borderColor: "#1386E7",
  },
  presetChipCancel: {
    backgroundColor: "#F8FAFC",
  },
  presetChipCancelSelected: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#475569",
  },
  presetChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  reasonInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    padding: 12,
    fontSize: 14,
    color: "#0F172A",
    textAlignVertical: "top",
    minHeight: 80,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  secondaryBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  primaryBtn: {
    flex: 1.5,
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  cancelPrimaryBtn: {
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
  },
  reschedulePrimaryBtn: {
    backgroundColor: "#1386E7",
    shadowColor: "#1386E7",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});