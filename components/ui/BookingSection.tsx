import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DoctorBookingCard, {
  Doctor,
} from "./DoctorBookingCard";

import Button, {
  ButtonVariant,
} from "../ButtonCompo/Button";

type Props = {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  doctors: Doctor[];
  buttonText?: string;
  buttonVar?: ButtonVariant;
  onButtonPress?: () => void;
  onDoctorPress?: (doctor: Doctor) => void;
  emptyMessage?: string;
  isLoading?: boolean;
};

export default function BookingSection({
  title,
  icon,
  doctors,
  buttonText,
  buttonVar = "blue",
  onButtonPress,
  onDoctorPress,
  emptyMessage = "No bookings found",
  isLoading = false,
}: Props) {
  return (
    <View style={styles.sectionContainer}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color="#252525"
            />
          )}

          <Text style={styles.title}>
            {title}
          </Text>
        </View>

        {buttonText && (
          <Button
            text={buttonText}
            textSize="sm"
            variant={buttonVar}
            onPress={onButtonPress}
          />
        )}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#1386E7" />
        </View>
      ) : (
        <FlatList
          data={doctors}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={24} color="#A0AEC0" />
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <DoctorBookingCard
              doctor={item}
              onPress={() => onDoctorPress?.(item)}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 18,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#252525",
  },

  list: {
    paddingLeft: 20,
    paddingRight: 20,
  },

  loaderContainer: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyCard: {
    height: 120,
    width: 260,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 6,
  },

  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
  },
});