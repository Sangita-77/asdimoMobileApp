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
      <OrientationLock variant="portrait-up" />
      <View style={doctorStyles.doctorWrap}>
        <Header title="Doctor Booking" />
        <DoctorListHeader />
        <View style={doctorStyles.cardCon}>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={therapists}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
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
              </View>
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
        </View>
        <Footer />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  doctorWrap: {
    flex: 1,
    width: "100%",
  },

  cardCon: {
    flex: 1,
    width: "100%",
    minHeight: 0,
  },
  titleWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  titleInfo: {
    color: "#212121",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 0,
    width: "100%",
  },
  cardWrapper: {
    width: "100%",
    alignSelf: "stretch",
    paddingHorizontal: 16,
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