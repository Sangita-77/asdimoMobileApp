import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import { ScrollView, StyleSheet, View, } from "react-native";

import Button from "@/components/ButtonCompo/Button";
import BookingSection from "@/components/ui/BookingSection";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { ROUTES } from "@/constants/routes";
import { router } from "expo-router";

const doctors = [
  {
    id: "1",
    name: "Dr. Shreya Dutta",
    specialty: "Child psychologist",
    image: require("@/assets/images/ShapeMatchingIcon.png"),
  },
  {
    id: "2",
    name: "Dr. Manish Tiwari",
    specialty: "Autism Specialist",
  },
  {
    id: "3",
    name: "Dr. Shivani Sharma",
    specialty: "Child psychologist",
    image: require("@/assets/images/ShapeMatchingIcon.png"),
  },
  {
    id: "4",
    name: "Dr. Rahul Kumar",
    specialty: "Behavior Therapist",
    image: require("@/assets/images/ShapeMatchingIcon.png"),
  },
];

export default function BookingsScreen() {

//   const handleDoctorPress = (doctor: any) => {
//     console.log("Doctor:", doctor);
//   };

  return (
    <>
      <OrientationLock variant="portrait" />
      <Header title="Doctor Booking" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Past Booking */}
        <BookingSection
        title="Available Doctors"
        icon="reload-outline"
        doctors={doctors}
        buttonVar="solid"
        buttonText="Book Again"
        onButtonPress={() => {
            // router.push(ROUTES.AUTH.DOCTORSLIST);
        }}
        />

        {/* Upcoming Booking */}
        <BookingSection
        title="Upcoming Bookings"
        icon="calendar"
        doctors={doctors}
        buttonVar="transparent"
        buttonText="View All"
        onButtonPress={() => {
            // router.push(ROUTES.AUTH.BOOKINGHISTORY);
        }}
        />
      </ScrollView>
       <View style={styles.buttonContainer}>
        <Button text="New Appointment" width="half" textSize="md"
        onPress={() => { router.push(ROUTES.AUTH.DOCTORSLIST); }} 
        />
        <Button text="Booking History" width="half" textSize="md" variant="green"
        onPress={() => { router.push(ROUTES.AUTH.BOOKINGHISTORY); }} 
        />
      </View>
      <Footer />
    </>
  );
}
 
const styles = StyleSheet.create({
  buttonContainer:{flexDirection: "row", paddingBottom: 30, padding: 10, gap: 10, backgroundColor: "#fff",},
  content: {
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
});