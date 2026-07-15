import React from "react";
import { Image, Pressable, StyleSheet, Text, View, } from "react-native";
interface DoctorListCardProps {
  image?: any;
  name: string;
  availableTime?: string;
  onBookNow: () => void;
}

export default function DoctorListCard({
  image,
  name,
  availableTime,
  onBookNow,
}: DoctorListCardProps) {
  return (
    <View style={styles.card}>
        {image ? (
        <Image source={image} style={styles.image} />
        ) : (
        <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarLetter}>
            {name.trim().charAt(0).toUpperCase()}
            </Text>
        </View>
        )}

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>

        {/* <Text style={styles.time}>
          Available: {availableTime}
        </Text> */}
      </View>

      <Pressable style={styles.button} onPress={onBookNow}>
        <Text style={styles.buttonText}>Book Now</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 14,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  info: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#222",
  },

  time: {
    marginTop: 6,
    fontSize: 14,
    color: "#666",
  },

  button: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 14,
  },
  avatarPlaceholder: {
  width: 70,
  height: 70,
  borderRadius: 35,
  backgroundColor: "#2563EB",
  justifyContent: "center",
  alignItems: "center",
},

avatarLetter: {
  color: "#FFF",
  fontSize: 28,
  fontWeight: "700",
},
});