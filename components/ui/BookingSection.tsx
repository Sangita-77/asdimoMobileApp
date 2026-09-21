import {
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
};

export default function BookingSection({
  title,
  icon,
  doctors,
  buttonText,
  buttonVar = "blue",
  onButtonPress,
  onDoctorPress,
}: Props) {
  return (
    <>
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

      <FlatList
        data={doctors}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <DoctorBookingCard
            doctor={item}
            onPress={() => onDoctorPress?.(item)}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
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
});