import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CustomCalendar from "./Calender";

type ActionType = "reschedule" | "cancel";

type AppointmentAction = {
  date: string;
  time: string;
};

interface AppointmentActionModalProps {
  visible: boolean;
  type: ActionType;
  onClose: () => void;
  onConfirm: (data?: AppointmentAction) => void;
  initialDate?: string;
  initialTime?: string;
}

export default function AppointmentActionModal({
  visible,
  type,
  onClose,
  onConfirm,
  initialDate,
  initialTime,
}: AppointmentActionModalProps) {
  const isCancel = type === "cancel";

  const [selectedDate, setSelectedDate] = useState(
    initialDate || ""
  );

  const [selectedTime, setSelectedTime] = useState(
    initialTime || "10:00"
  );

  useEffect(() => {
    if (visible && type === "reschedule") {
      setSelectedDate(initialDate || "");
      setSelectedTime(initialTime || "10:00");
    }
  }, [visible, type, initialDate, initialTime]);

  const handleConfirm = () => {
    if (isCancel) {
      onConfirm();
      return;
    }

    onConfirm({
      date: selectedDate,
      time: selectedTime,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* Close */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              isCancel
                ? styles.cancelIcon
                : styles.rescheduleIcon,
            ]}
          >
            <Text
              style={[
                styles.iconText,
                isCancel
                  ? styles.cancelIconText
                  : styles.rescheduleIconText,
              ]}
            >
              {isCancel ? "!" : "↻"}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>
            {isCancel
              ? "Cancel Appointment?"
              : "Reschedule Appointment?"}
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            {isCancel
              ? "Are you sure you want to cancel this appointment?"
              : "Select a new date and time for your appointment."}
          </Text>

          {/* RESCHEDULE FIELDS */}
          {!isCancel && (
            <View style={styles.rescheduleContainer}>

              {/* Calendar */}
              <Text style={styles.fieldLabel}>
                Select Date
              </Text>

              <CustomCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />

              {/* Time */}
              <Text style={styles.fieldLabel}>
                Select Time
              </Text>

              <View style={styles.timeInput}>
                <Text style={styles.timeIcon}>🕐</Text>

                <TextInput
                  value={selectedTime}
                  onChangeText={setSelectedTime}
                  placeholder="HH:mm"
                  placeholderTextColor="#999"
                  keyboardType="numbers-and-punctuation"
                  style={styles.timeText}
                  maxLength={5}
                />
              </View>

            </View>
          )}

          {/* Buttons */}
          <View style={styles.buttons}>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryText}>
                {isCancel ? "Keep Appointment" : "Not Now"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                isCancel
                  ? styles.cancelButton
                  : styles.rescheduleButton,
              ]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryText}>
                {isCancel ? "Yes, Cancel" : "Reschedule"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
  },

  closeButton: {
    position: "absolute",
    right: 15,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  closeText: {
    fontSize: 28,
    color: "#555",
    lineHeight: 28,
  },

  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 12,
  },

  cancelIcon: {
    backgroundColor: "#FEE2E2",
  },

  rescheduleIcon: {
    backgroundColor: "#EAF6FF",
  },

  iconText: {
    fontSize: 28,
    fontWeight: "700",
  },

  cancelIconText: {
    color: "#EF4444",
  },

  rescheduleIconText: {
    color: "#1386E7",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#222",
    textAlign: "center",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 15,
    lineHeight: 20,
  },

  rescheduleContainer: {
    marginTop: 5,
  },

  fieldLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },

  timeInput: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E1E1E1",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 15,
  },

  timeIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  timeText: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },

  buttons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },

  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },

  secondaryText: {
    color: "#555",
    fontSize: 14,
    fontWeight: "600",
  },

  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#EF4444",
  },

  rescheduleButton: {
    backgroundColor: "#1386E7",
  },

  primaryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
});