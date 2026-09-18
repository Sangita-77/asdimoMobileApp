import DoctorListHeader from "@/components/ui/DoctorListHeader";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import DoctorListCard from "@/components/ui/ListComponents";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { API_BASE_URL } from "@/constants/config";
import { ROUTES } from "@/constants/routes";
import {
  AvailabilitySlot,
  getTherapistAvailability,
  getTherapists,
  Therapist,
} from "@/services/authService";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { doctorStyles } from "../../constants/globalStyle";
const stethoscopeIcon = require("../../assets/images/stethoscope-icon.png");

export default function Bookings() {
  const [therapists, setTherapists] = useState<
    (Therapist & { availability: AvailabilitySlot[] })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTherapists = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const therapistList = await getTherapists();
      const therapistsWithAvailability = await Promise.all(
        therapistList.map(async (therapist) => ({
          ...therapist,
          availability: await getTherapistAvailability(therapist.userId),
        })),
      );
      setTherapists(therapistsWithAvailability);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load therapists. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadTherapists();
  }, [loadTherapists]);

  return (
    <>
      <OrientationLock variant="portrait" />
        <Header title="Doctor Booking" />
        <DoctorListHeader />
        <FlatList
          contentContainerStyle={styles.listContent}
          data={therapists}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
              <DoctorListCard
                image={
                  item.profileImg
                    ? {
                      uri: `${API_BASE_URL.replace(/\/api$/, "")}${item.profileImg}`,
                    }
                    : undefined
                }
                name={item.name}
                availability={item.availability}
                onBookNow={(slot) =>
                  console.log(`Book ${item.name} on ${slot.date} at ${slot.time}`)
                }
                appointmentBooking={() =>
                  router.push({
                    pathname: ROUTES.AUTH.BOOKDOCTOR,
                    params: {
                      therapistId: String(item.userId),
                      therapistName: item.name,
                      profileImg: item.profileImg || "",
                    },
                  })
                }
              />
          )}
          ListEmptyComponent={
            <View style={styles.statusContainer}>
              {isLoading ? (
                <ActivityIndicator size="large" color="#2563EB" />
              ) : (
                <Text style={styles.statusText}>
                  {error || "No therapists are available right now."}
                </Text>
              )}
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
        <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  listContent: { flexGrow: 1, padding: 20 },
  heading: {
    color: "#111827",
    fontSize: 27,
    fontWeight: "700",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.08)",
  },
  sessionText: { color: "#4B5563", fontSize: 16 },
  doctorName: { color: "#111827", fontWeight: "700" },
  dateTime: { color: "#6B7280", fontSize: 15, marginTop: 8 },
  status: {
    alignSelf: "flex-start",
    borderRadius: 16,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  pending: { backgroundColor: "#DBEAFE" },
  completed: { backgroundColor: "#DCFCE7" },
  cancelled: { backgroundColor: "#FEE2E2" },
  statusText: {
    color: "#1F2937",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  joinButton: {
    alignItems: "center",
    backgroundColor: "#16A34A",
    borderRadius: 9,
    marginTop: 14,
    paddingVertical: 11,
  },
  joinButtonText: { color: "#FFF", fontSize: 15, fontWeight: "700" },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 36,
  },
  emptyText: { color: "#6B7280", fontSize: 16, textAlign: "center" },
});
