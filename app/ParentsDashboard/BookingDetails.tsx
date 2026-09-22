import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import AppointmentActionModal from "@/components/ui/ActionModal";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import { doctorStyles, globalStyle } from "../../constants/globalStyle";
import { router } from "expo-router";
import {useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable
} from "react-native";
import Button from "@/components/ButtonCompo/Button";
import MyList, { ListItem } from "@/components/ui/IconTitleText";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useLocalSearchParams } from "expo-router";


export default function BookingDetails() {
  const [actionModal, setActionModal] = useState< "reschedule" | "cancel" | null >(null);
  const transition = useTransition();
   const {
    therapistId,
    therapistName,
    profileImg,
    therapistCategory,
    yearsOfExperience,
    medium,
    appointmentDate,
    appointmentTime,
  } = useLocalSearchParams<{
    therapistId: string;
    therapistName: string;
    profileImg: string;
    therapistCategory: string;
    yearsOfExperience: string;
    medium: string;
    appointmentDate: string;
    appointmentTime: string;
  }>();
  const imageUri = profileImg
    ? profileImg.startsWith("http")
      ? profileImg
      : `${API_BASE_URL.replace(/\/api$/, "")}${profileImg}`
    : "";

const appointmentItems: ListItem[] = [
  {
    icon: "calendar-outline",
    title: "Date",
    text: appointmentDate || "Not available",
  },
  {
    icon: "time-outline",
    title: "Time",
    text: appointmentTime || "Not available",
  },
];

if (medium?.toLowerCase() === "clinic") {
  appointmentItems.push({
    icon: "location-outline",
    title: "Location",
    text: "123 Park street, Kolkata- 700016",
  });
}


const Bio: ListItem[] = [
  {
    icon: "school",
    title: "Experience ",
    text: yearsOfExperience ? `${yearsOfExperience} years` : "Not available",
  },
];

  return (
    <>
      <OrientationLock variant="portrait" />
        <Header title="Upcoming Appointment" />
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.ProfileDetails}>
            <Text style={doctorStyles.heading}>Your Next Appointment</Text>
            <Text style={globalStyle.smallText2}>Here are the details of your upcoming Appointment.</Text>
            <View style={styles.profileWrap}>
                <View style={styles.profileContainer}>
                    {imageUri ? (
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.avatar}
                    />
                    ) : (
                    <View style={styles.placeholder}>
                        <Text style={styles.placeholderText}>
                        {therapistName?.charAt(0)?.toUpperCase() || "D"}
                        </Text>
                    </View>
                    )}
                <View>
                    <Text style={styles.doctorName}>{therapistName}</Text>
                    <Text style={globalStyle.smallText2}>{therapistCategory}</Text>
                    <MyList items={Bio} variant="horizontal"/>

                </View>
                <Button text="Confirmed" style={styles.Status} variant="Neon" textSize="xs"/>
                </View>
                <MyList items={appointmentItems} variant="horizontal"/>
                <View style={styles.InfoWrap}>
                   <Text style={styles.InfoWrapTitle}>Please arrive 15 minutes early</Text>
                   <Text style={globalStyle.smallText2}>Bring any previous reports or documents related to the consultation.</Text>
                </View>
                <View style={styles.profileContainer}>
                <Button
                    text="Reschedule"
                    variant="Sky"
                    style={styles.AppointStatus}
                    width="half"
                    icon=""
                    textSize="md"
                    onPress={() => setActionModal("reschedule")}
                />

                <Button
                    text="Cancel"
                    variant="Red"
                    style={styles.AppointStatus}
                    width="half"
                    textSize="md"
                    onPress={() => setActionModal("cancel")}
                />
                </View>
            </View>
            <Pressable
            style={[styles.profileWrap, styles.BookingList]}
            onPress={() => {
                transition.current?.cover(() => {
                  router.push(ROUTES.AUTH.DOCTORSLIST);
               });
            }}
            >
            <FontAwesome5 name="calendar-plus" size={54} color="#1386E7" />
            <View style={{ flex: 1 }}>
                <Text style={doctorStyles.heading}> Need to see another doctor? </Text>
                <Text style={globalStyle.smallText2}> Disorders & Autism Specialist </Text>
            </View>
            <FontAwesome5 name="angle-right" size={20} color="black" />
            </Pressable>
            </ScrollView>
        </View>
            <AppointmentActionModal
            visible={actionModal !== null}
            type={actionModal || "cancel"}
            onClose={() => setActionModal(null)}
            onConfirm={() => {
                if (actionModal === "reschedule") {
                console.log("Reschedule appointment");

                // router.push({
                //   pathname: ROUTES.AUTH.BOOKDOCTOR,
                //   params: {
                //     therapistId: String(therapistId),
                //     therapistName: therapistName || "",
                //     profileImg: profileImg || "",
                //   },
                // });
                }

                if (actionModal === "cancel") {
                console.log("Cancel appointment");

                // Cancel API here
                }

                setActionModal(null);
            }}
            />
        <Footer />
    </>
  );
}

const styles = StyleSheet.create({
avatar: { width: 125, height: 140, borderRadius: 20 },
BookingList:{flexDirection:"row", gap: 20, justifyContent: "center", alignItems:"center"},
profileWrap:{padding: 20,  borderRadius: 10, boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.17)", marginVertical: 10,},    
AppointStatus:{paddingVertical: 13,},
InfoWrap:{backgroundColor: "#EAF6FF", borderRadius: 12, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, marginVertical: 20,}, 
InfoWrapTitle:{color: "#1386E7", fontSize: 16, fontWeight: "700",},   
container:{padding: 10, backgroundColor : "#fff",},
Status: {position: "absolute", right: 0, top: 0,},
ProfileDetails: { flex: 1, padding: 10, },
doctorName: { color: "#000000", fontSize: 16, fontWeight: "600", marginTop: 10 },
placeholderText: { color: "#FFF", fontSize: 34, fontWeight: "700" },
profileContainer: { alignItems: "center", flexDirection: "row", gap: 15,},
  placeholder: {
    width: 125,
    height: 140,
    borderRadius: 44,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },
});
