import OrientationLock from "@/components/ui/ScreenOrientation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import { H1, H3, Paragraph } from "@/components/ui/HeadingsParagraph";
import { styles as globalStyle } from "../../constants/globalStyle";

import React from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
} from "react-native";

const BOOKINGS = [
  {
    id: "1",
    doctor: "Dr. Sarah Johnson",
    date: "20 July 2026",
    time: "10:30 AM",
    status: "Upcoming",
    joinUrl: "https://meet.google.com/abc-defg-hij",
  },
  {
    id: "2",
    doctor: "Dr. Michael Lee",
    date: "18 July 2026",
    time: "02:00 PM",
    status: "Completed",
    joinUrl: "https://meet.google.com/abc-defg-hij",
  },
];

export default function Booking() {
  return (
    <>
      <OrientationLock variant="portrait" />
      <Header />

      <FlatList
        data={BOOKINGS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={globalStyle.listContent}
        ListHeaderComponent={<H1 style={styles.heading}>Bookings</H1>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.info}>
              <H3><span style={styles.sessionText}>Session with</span> {item.doctor}</H3>
              <Paragraph> {item.date} </Paragraph>
              <Paragraph> {item.time} </Paragraph>
                <View
                    style={[
                    styles.status,
                    item.status === "Upcoming"
                        ? styles.upcoming
                        : styles.completed,
                    ]}
                >
                
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
                {item.status === "Upcoming" && (
                    <Pressable
                        style={styles.joinButton}
                        onPress={() => Linking.openURL(item.joinUrl)}
                    >
                        <Text style={styles.joinButtonText}>Join Meeting</Text>
                    </Pressable>
                )}
              </View>

            {/* <Pressable style={styles.button}>
              <Text style={styles.buttonText}>View</Text>
            </Pressable> */}
          </View>
        )}
      />

      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
joinButton: {
  backgroundColor: "#16A34A",
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8,
  alignItems: "center",
  marginTop: 12,
},

joinButtonText: {
  color: "#FFF",
  fontSize: 15,
  fontWeight: "600",
},
  sessionText:{
    color: "#ee4747",
    fontSize: 15,
  },
  heading: {
    marginBottom: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  info: {
    flex: 1,
    marginLeft: 15,
  },

  status: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },

  upcoming: {
    backgroundColor: "#E6F7EE",
  },

  completed: {
    backgroundColor: "#ECECEC",
  },

  statusText: {
    fontWeight: "600",
    color: "#1E8E3E",
  },

  button: {
    backgroundColor: "#0A84FF",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});