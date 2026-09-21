import DoctorListHeader, { TabType } from "@/components/ui/DoctorListHeader";
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
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
const stethoscopeIcon = require("../../assets/images/stethoscope-icon.png");

function parseSlotDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) return null;
  const [day, month, year] = parts;
  return new Date(year, month - 1, day);
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function matchesTabMedium(slot: AvailabilitySlot, tab: TabType): boolean {
  if (tab === "All") {
    return true;
  }
  const medium = (slot.medium || "").toLowerCase().trim();
  if (tab === "At Home") {
    return medium === "home";
  }
  if (tab === "Video Call") {
    return (
      medium === "online" ||
      medium === "room" ||
      (!medium && Boolean(slot.zoomLink))
    );
  }
  if (tab === "At Clinic") {
    return medium === "center" || medium === "clinic";
  }
  return false;
}

function matchesDateFilter(slotDateStr: string, selectedDateFilter: string): boolean {
  if (!selectedDateFilter || selectedDateFilter === "Any Date" || selectedDateFilter === "Date") {
    return true;
  }

  const slotDate = parseSlotDate(slotDateStr);
  if (!slotDate) return false;

  const today = new Date();

  if (selectedDateFilter === "Today") {
    return isSameDay(slotDate, today);
  }

  if (selectedDateFilter === "Tomorrow") {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return isSameDay(slotDate, tomorrow);
  }

  if (selectedDateFilter === "This Week") {
    const startOfWeek = new Date(today);
    startOfWeek.setHours(0, 0, 0, 0);
    const dayOfWeek = startOfWeek.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    startOfWeek.setDate(startOfWeek.getDate() - distanceToMonday);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return slotDate >= startOfWeek && slotDate <= endOfWeek;
  }

  return slotDateStr === selectedDateFilter;
}

function matchesCategoryFilter(therapistCategory: string | undefined, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === "All Categories" || selectedCategory === "Categories" || selectedCategory === "Category") {
    return true;
  }
  return (therapistCategory || "").trim().toLowerCase() === selectedCategory.trim().toLowerCase();
}

function matchesLanguageFilter(languages: string[] | undefined, selectedLanguage: string): boolean {
  if (!selectedLanguage || selectedLanguage === "All Languages" || selectedLanguage === "Languages" || selectedLanguage === "Language") {
    return true;
  }
  if (!Array.isArray(languages) || languages.length === 0) {
    return false;
  }
  return languages.some(
    (lang) => lang.trim().toLowerCase() === selectedLanguage.trim().toLowerCase()
  );
}

export default function Bookings() {
  const [therapists, setTherapists] = useState<
    (Therapist & { availability: AvailabilitySlot[] })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedDate, setSelectedDate] = useState<string>("Any Date");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All Languages");

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

  // Categories list extracted from therapist roleData
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => {
      const cat = t.roleData?.therapist_category;
      if (cat && cat.trim()) {
        set.add(cat.trim());
      }
    });
    return ["All Categories", ...Array.from(set)];
  }, [therapists]);

  // Unique dates list extracted from availability slots
  const datesList = useMemo(() => {
    const dateSet = new Set<string>();
    therapists.forEach((t) => {
      (t.availability || []).forEach((slot) => {
        if (slot.date) {
          dateSet.add(slot.date);
        }
      });
    });
    const sortedDates = Array.from(dateSet).sort((a, b) => {
      const d1 = parseSlotDate(a)?.getTime() || 0;
      const d2 = parseSlotDate(b)?.getTime() || 0;
      return d1 - d2;
    });
    return ["Any Date", "Today", "Tomorrow", "This Week", ...sortedDates];
  }, [therapists]);

  // Languages list extracted from therapist roleData
  const languagesList = useMemo(() => {
    const set = new Set<string>();
    therapists.forEach((t) => {
      const langs = t.roleData?.languages;
      if (Array.isArray(langs)) {
        langs.forEach((lang) => {
          if (lang && typeof lang === "string" && lang.trim()) {
            set.add(lang.trim());
          }
        });
      }
    });
    return ["All Languages", ...Array.from(set)];
  }, [therapists]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory("All Categories");
    setSelectedDate("Any Date");
    setSelectedLanguage("All Languages");
  }, []);

  // Filtered therapists based on active tab medium, category, date, and language
  const filteredTherapists = useMemo(() => {
    return therapists
      .map((therapist) => {
        const mediumSlots = (therapist.availability || []).filter((slot) =>
          matchesTabMedium(slot, activeTab)
        );

        const dateMatchedSlots = mediumSlots.filter((slot) =>
          matchesDateFilter(slot.date, selectedDate)
        );

        return {
          ...therapist,
          availability: dateMatchedSlots,
          totalMediumSlots: mediumSlots.length,
        };
      })
      .filter((therapist) => {
        const matchesCategory = matchesCategoryFilter(
          therapist.roleData?.therapist_category,
          selectedCategory
        );
        if (!matchesCategory) return false;

        const matchesLanguage = matchesLanguageFilter(
          therapist.roleData?.languages,
          selectedLanguage
        );
        if (!matchesLanguage) return false;

        if (activeTab === "All") {
          if (selectedDate && selectedDate !== "Any Date" && selectedDate !== "Date") {
            return therapist.availability.length > 0;
          }
          return true;
        }

        if (selectedDate && selectedDate !== "Any Date" && selectedDate !== "Date") {
          return therapist.availability.length > 0;
        }

        return therapist.totalMediumSlots > 0;
      });
  }, [therapists, activeTab, selectedCategory, selectedDate, selectedLanguage]);

  return (
    <>
      <OrientationLock variant="portrait" />
        <Header title="Doctor Booking" />
        <DoctorListHeader
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onClearFilters={handleClearFilters}
          categoriesList={categoriesList}
          datesList={datesList}
          languagesList={languagesList}
        />
        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredTherapists}
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
            category={item.roleData?.therapist_category || "Therapist"}
            experience={item.roleData?.yearsOfExperience ?? 0}
            languages={item.roleData?.languages}
            availability={item.availability}
            onBookNow={(slot) =>
              router.push({
                pathname: ROUTES.AUTH.BOOKDOCTOR,
                params: {
                  therapistId: String(item.userId),
                  therapistName: item.name,
                  profileImg: item.profileImg || "",
                  therapistCategory: item.roleData?.therapist_category || "Therapist",
                  yearsOfExperience: String(item.roleData?.yearsOfExperience ?? 0),
                  selectedDate: slot.date,
                  selectedTime: slot.time,
                  slotId: slot._id,
                  medium: slot.medium || (activeTab === "At Home" ? "home" : activeTab === "At Clinic" ? "center" : "online"),
                },
              })
            }
            appointmentBooking={() =>
              router.push({
                pathname: ROUTES.AUTH.BOOKDOCTOR,
                params: {
                  therapistId: String(item.userId),
                  therapistName: item.name,
                  profileImg: item.profileImg || "",
                  therapistCategory: item.roleData?.therapist_category || "Therapist",
                  yearsOfExperience: String(item.roleData?.yearsOfExperience ?? 0),
                  medium: activeTab === "At Home" ? "home" : activeTab === "At Clinic" ? "center" : "online",
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
                  {error || "No therapists are available for this filter."}
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
  listContent: { flexGrow: 1, padding: 10, backgroundColor: "#fff"},
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
