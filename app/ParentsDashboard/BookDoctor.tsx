import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import OrientationLock from "@/components/ui/ScreenOrientation";
import Calender from "@/components/ui/Calender";
import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import React, {useState} from "react";
// import { styles as globalStyle } from "../../constants/globalStyle";
import Button from "@/components/ButtonCompo/Button";

const availableTimes = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
];

const doctorName = "Dr. Shreya Dutta";
const doctorImage = null; 


export default function DoctorList() {
  const [selectedTime, setSelectedTime] = useState("");
  return (
    <>
    <OrientationLock variant="portrait" />
    <Header/>
      <View style={styles.BookContainer}>
        <View style={styles.profileContainer}>
          {doctorImage ? (
            <Image
              source={doctorImage}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                {doctorName.replace(/^Dr\.?\s*/i, "").charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text>{doctorName}</Text>
        </View>
        <View>
          <Text style={styles.TextHaeding}>Select Date</Text>
          <Calender/>
        </View>
        <View>
          <Text style={styles.TextHaeding}>Select Time</Text>
          <View style={styles.timeContainer}>
              {availableTimes.map((time) => (
                <Pressable
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.selectedTime,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === time && styles.selectedTimeText,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
          </View>
          <Button text="Book Appointment" textSize="lg"/>
        </View>
      </View>
    <Footer/>
    </>
  );
}

const styles = StyleSheet.create({
    timeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 20,
    paddingBottom: 20,
  },

  timeButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#FFF",
  },

  selectedTime: {
    backgroundColor: "#4F46E5",
    borderColor: "#4F46E5",
  },

  timeText: {
    color: "#374151",
    fontWeight: "600",
  },

  selectedTimeText: {
    color: "#FFF",
  },
  TextHaeding:{
    fontSize: 18,
    paddingBottom: 10,
  },
  BookContainer:{
  padding: 20,
  },
  profileContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
});