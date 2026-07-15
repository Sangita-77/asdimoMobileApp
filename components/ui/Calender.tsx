import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CustomCalendar() {
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const calendar = useMemo(() => {
    const arr = [];

    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let i = 1; i <= totalDays; i++) arr.push(i);

    return arr;
  }, [month, year]);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            style={styles.arrowButton}
            onPress={() => setCurrentDate(new Date(year, month - 1, 1))}
          >
            <Text style={styles.arrow}>‹</Text>
          </Pressable>

          <Text style={styles.month}>
            {MONTHS[month]} {year}
          </Text>

          <Pressable
            style={styles.arrowButton}
            onPress={() => setCurrentDate(new Date(year, month + 1, 1))}
          >
            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>

        {/* Week Names */}
        <View style={styles.weekRow}>
          {DAYS.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        {/* Dates */}
        <View style={styles.grid}>
          {calendar.map((day, index) => {
            if (!day) {
              return <View key={index} style={styles.emptyCell} />;
            }

            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const isSelected = day === selectedDate;

            return (
              <Pressable
                key={index}
                style={[
                  styles.day,
                  isToday && styles.today,
                  isSelected && styles.selected,
                ]}
                onPress={() => setSelectedDate(day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    isToday && styles.todayText,
                    isSelected && styles.selectedText,
                  ]}
                >
                  {day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={styles.result}>
        Selected:
        {" "}
        {selectedDate
          ? `${selectedDate} ${MONTHS[month]} ${year}`
          : "None"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  month: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },

  arrowButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  arrow: {
    fontSize: 24,
    color: "#4F46E5",
    fontWeight: "700",
  },

  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  weekDay: {
    width: 42,
    textAlign: "center",
    color: "#9CA3AF",
    fontWeight: "600",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  emptyCell: {
    width: 42,
    height: 42,
    marginBottom: 10,
  },

  day: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  today: {
    borderWidth: 1.5,
    borderColor: "#4F46E5",
  },

  selected: {
    backgroundColor: "#4F46E5",
  },

  dayText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "600",
  },

  todayText: {
    color: "#4F46E5",
    fontWeight: "700",
  },

  selectedText: {
    color: "#FFF",
  },

  result: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
});