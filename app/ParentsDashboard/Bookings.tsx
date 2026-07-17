import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { Appointment, getLoggedInUserId, getParentAppointments } from "@/services/authService";
import React, { useCallback, useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { styles as globalStyle } from "../../constants/globalStyle";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

function formatDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  if (!day || !month || !year) return date;
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Bookings() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const parentId = await getLoggedInUserId();
      if (!parentId) throw new Error("Please sign in again to view your bookings.");
      setAppointments(await getParentAppointments(parentId));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load bookings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  return (
    <>
      <OrientationLock variant="portrait" />
      <View style={globalStyle.container}>
      <Header title="Doctor List"/>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<Text style={styles.heading}>Bookings</Text>}
        ListEmptyComponent={
          <View style={styles.statusContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#2563EB" />
            ) : (
              <Text style={styles.emptyText}>{error || "No bookings found."}</Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const normalizedStatus = item.status.toLowerCase();
          const canJoin = normalizedStatus === "approved" && Boolean(item.zoomLink);
          return (
            <View style={styles.card}>
              <Text style={styles.sessionText}>
                Session with <Text style={styles.doctorName}>{item.teacherUser?.name || "Therapist"}</Text>
              </Text>
              <Text style={styles.dateTime}>{formatDate(item.date)} · {item.time}</Text>
              <View style={[styles.status, normalizedStatus === "completed" ? styles.completed : normalizedStatus === "cancelled" ? styles.cancelled : styles.pending]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
              {canJoin ? (
                <Pressable
                  style={styles.joinButton}
                  onPress={() => item.zoomLink && Linking.openURL(item.zoomLink)}
                >
                  <Text style={styles.joinButtonText}>Join Meeting</Text>
                </Pressable>
              ) : null}
            </View>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
      <Footer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  listContent: { flexGrow: 1, padding: 20 },
  heading: { color: "#111827", fontSize: 27, fontWeight: "700", marginBottom: 18 },
  card: { backgroundColor: "#FFF", borderRadius: 16, padding: 16, marginBottom: 14, elevation: 3, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  sessionText: { color: "#4B5563", fontSize: 16 },
  doctorName: { color: "#111827", fontWeight: "700" },
  dateTime: { color: "#6B7280", fontSize: 15, marginTop: 8 },
  status: { alignSelf: "flex-start", borderRadius: 16, marginTop: 12, paddingHorizontal: 12, paddingVertical: 5 },
  pending: { backgroundColor: "#DBEAFE" },
  completed: { backgroundColor: "#DCFCE7" },
  cancelled: { backgroundColor: "#FEE2E2" },
  statusText: { color: "#1F2937", fontSize: 13, fontWeight: "700", textTransform: "capitalize" },
  joinButton: { alignItems: "center", backgroundColor: "#16A34A", borderRadius: 9, marginTop: 14, paddingVertical: 11 },
  joinButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  statusContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 36 },
  emptyText: { color: "#6B7280", fontSize: 16, textAlign: "center" },
});
