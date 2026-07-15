import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type CalendarProps = {
  selectedDate?: string;
  availableDates?: string[];
  onDateChange?: (date: string) => void;
};

function toDateKey(date: Date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function fromDateKey(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export default function CustomCalendar({
  selectedDate,
  availableDates,
  onDateChange,
}: CalendarProps) {
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);
  const [currentDate, setCurrentDate] = useState(
    selectedDate ? fromDateKey(selectedDate) : today,
  );

  useEffect(() => {
    if (selectedDate) setCurrentDate(fromDateKey(selectedDate));
  }, [selectedDate]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const availableDateSet = useMemo(
    () => new Set(availableDates || []),
    [availableDates],
  );
  const calendar = useMemo(() => {
    const days: (number | null)[] = Array.from({ length: firstDay }, () => null);
    for (let day = 1; day <= totalDays; day += 1) days.push(day);
    return days;
  }, [firstDay, totalDays]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Pressable
          style={styles.arrowButton}
          onPress={() => setCurrentDate(new Date(year, month - 1, 1))}
        >
          <Text style={styles.arrow}>‹</Text>
        </Pressable>
        <Text style={styles.month}>{MONTHS[month]} {year}</Text>
        <Pressable
          style={styles.arrowButton}
          onPress={() => setCurrentDate(new Date(year, month + 1, 1))}
        >
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.weekRow}>
        {DAYS.map((day) => <Text key={day} style={styles.weekDay}>{day}</Text>)}
      </View>

      <View style={styles.grid}>
        {calendar.map((day, index) => {
          if (!day) return <View key={`empty-${index}`} style={styles.emptyCell} />;

          const date = new Date(year, month, day);
          const dateKey = toDateKey(date);
          const isSelected = dateKey === selectedDate;
          const disabled = date < today || (availableDates !== undefined && !availableDateSet.has(dateKey));

          return (
            <Pressable
              key={dateKey}
              disabled={disabled}
              onPress={() => onDateChange?.(dateKey)}
              style={[styles.day, isSelected && styles.selected, disabled && styles.disabledDay]}
            >
              <Text style={[styles.dayText, isSelected && styles.selectedText, disabled && styles.disabledText]}>
                {day}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#FFF", borderRadius: 20, padding: 18, elevation: 4, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  month: { fontSize: 20, fontWeight: "700", color: "#1F2937" },
  arrowButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: "#EFF6FF", justifyContent: "center", alignItems: "center" },
  arrow: { fontSize: 28, lineHeight: 30, color: "#2563EB", fontWeight: "700" },
  weekRow: { flexDirection: "row", marginBottom: 10 },
  weekDay: { width: "14.2857%", textAlign: "center", color: "#9CA3AF", fontWeight: "600" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  emptyCell: { width: "14.2857%", aspectRatio: 1, padding: 3 },
  day: { width: "14.2857%", aspectRatio: 1, borderRadius: 22, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: "transparent" },
  selected: { backgroundColor: "#2563EB" },
  disabledDay: { opacity: 0.42 },
  dayText: { fontSize: 15, color: "#1F2937", fontWeight: "600" },
  selectedText: { color: "#FFF" },
  disabledText: { color: "#9CA3AF" },
});
