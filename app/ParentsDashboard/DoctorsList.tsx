import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import DoctorListCard from "@/components/ui/ListComponents";
import OrientationLock from "@/components/ui/ScreenOrientation";
import {
  AvailabilitySlot,
  getTherapistAvailability,
  getTherapists,
  Therapist,
} from "@/services/authService";
import { API_BASE_URL } from "@/constants/config";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable
} from "react-native";

export default function DoctorList() {
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
      <Header />
      <FlatList
        contentContainerStyle={styles.listContent}
        data={therapists}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <DoctorListCard
            image={
              item.profileImg
                ? { uri: `${API_BASE_URL.replace(/\/api$/, "")}${item.profileImg}` }
                : undefined
            }
            name={item.name}
            availability={item.availability}
            onBookNow={(slot) =>
              console.log(`Book ${item.name} on ${slot.date} at ${slot.time}`)
            }
            appointmentBooking={() => console.log(`Book ${item.name}`) }
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
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  statusContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  statusText: {
    color: "#4B5563",
    fontSize: 16,
    textAlign: "center",
  },
});
