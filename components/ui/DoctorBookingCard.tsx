import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  image?: any;
  date?: string;
  time?: string;
  status?: string;
  teacherId?: number;
  rawAppointment?: any;
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
        <Image
          source={doctor.image}
          style={styles.DBavatar}
          resizeMode="cover"
        />
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

      {doctor.date ? (
        <View style={styles.dateBadge}>
          <Text style={styles.dateText} numberOfLines={1}>
            {doctor.date} {doctor.time ? `· ${doctor.time}` : ""}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  DBcard: {
    width: 145,
    minHeight: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 12,
    paddingHorizontal: 8,
    marginRight: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  DBavatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },

  DBavatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  DBavatarLetter: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1386E7",
  },

  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#202020",
    maxWidth: 130,
    textAlign: "center",
  },

  specialty: {
    fontSize: 10,
    color: "#8E8E98",
    marginTop: 3,
    maxWidth: 130,
    textAlign: "center",
  },

  dateBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    maxWidth: 130,
  },

  dateText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#1386E7",
    textAlign: "center",
  },
});
