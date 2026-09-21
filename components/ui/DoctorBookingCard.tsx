import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image?: any;
};

type Props = {
  doctor: Doctor;
  onPress?: () => void;
};

export default function DoctorBookingCard({
  doctor,
  onPress,
}: Props) {
  const firstLetter = doctor.name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.DBcard}
      onPress={onPress}
    >
      {doctor.image ? (
        <Image source={doctor.image} style={styles.DBavatar} />
      ) : (
        <View style={styles.DBavatarFallback}>
          <Text style={styles.DBavatarLetter}>{firstLetter}</Text>
        </View>
      )}

      <Text style={styles.name} numberOfLines={1}>
        {doctor.name}
      </Text>

      <Text style={styles.specialty} numberOfLines={1}>
        {doctor.specialty}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  DBcard: {
    width: 140,
    height: 155,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    paddingTop: 12,
    marginRight: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 10,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  DBavatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },

  DBavatarFallback: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E8F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  DBavatarLetter: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1386E7",
  },

  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#202020",
    maxWidth: 120,
    textAlign: "center",
  },

  specialty: {
    fontSize: 9,
    color: "#8E8E98",
    marginTop: 4,
    maxWidth: 120,
    textAlign: "center",
  },
});