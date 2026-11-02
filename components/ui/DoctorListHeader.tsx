import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const stethoscopeIcon = require("../../assets/images/stethoscope-icon.png");

export type TabType = "All" | "At Home" | "Video Call" | "At Clinic";

export const DOCTOR_TABS: TabType[] = [
    "All",
    "At Home",
    "Video Call",
    "At Clinic",
];

interface DoctorListHeaderProps {
    activeTab?: TabType;
    onTabChange?: (tab: TabType) => void;
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
    selectedDate?: string;
    onDateChange?: (date: string) => void;
    selectedLanguage?: string;
    onLanguageChange?: (language: string) => void;
    selectedDistance?: string;
    onDistanceChange?: (distance: string) => void;
    onClearFilters?: () => void;
    categoriesList?: string[];
    datesList?: string[];
    languagesList?: string[];
}

const defaultCategories = [
    "All Categories",
    "Psychologist",
    "Physiotherapy",
    "Disorders & Autism Specialist",
    "Therapist",
];

const defaultDates = [
    "Any Date",
    "Today",
    "Tomorrow",
    "This Week",
];

const defaultLanguages = [
    "All Languages",
    "English",
    "Hindi",
    "Marathi",
    "Bengali",
];

const distances = [
    "Any Distance",
    "Within 5 km",
    "Within 10 km",
    "Within 25 km",
];

const DoctorListHeader = ({
    activeTab = "All",
    onTabChange,
    selectedCategory = "All Categories",
    onCategoryChange,
    selectedDate = "Any Date",
    onDateChange,
    selectedLanguage = "All Languages",
    onLanguageChange,
    selectedDistance = "Distance",
    onDistanceChange,
    onClearFilters,
    categoriesList = defaultCategories,
    datesList = defaultDates,
    languagesList = defaultLanguages,
}: DoctorListHeaderProps) => {
    const [distance, setDistance] = useState(selectedDistance);
    const [dropdown, setDropdown] = useState<
        "category" | "date" | "language" | "distance" | null
    >(null);

    const getOptions = () => {
        if (dropdown === "category") return categoriesList;
        if (dropdown === "date") return datesList;
        if (dropdown === "language") return languagesList;
        if (dropdown === "distance") return distances;

        return [];
    };

    const selectOption = (value: string) => {
        if (dropdown === "category") {
            onCategoryChange?.(value);
        }
        if (dropdown === "date") {
            onDateChange?.(value);
        }
        if (dropdown === "language") {
            onLanguageChange?.(value);
        }
        if (dropdown === "distance") {
            const nextDistance = value === "Any Distance" ? "Distance" : value;
            setDistance(nextDistance);
            onDistanceChange?.(nextDistance);
        }
        setDropdown(null);
    };

    const handleClearAll = () => {
        setDistance("Distance");
        setDropdown(null);
        onCategoryChange?.("All Categories");
        onDateChange?.("Any Date");
        onLanguageChange?.("All Languages");
        onDistanceChange?.("Distance");
        onClearFilters?.();
    };

    const hasActiveFilters =
        (selectedCategory && selectedCategory !== "All Categories" && selectedCategory !== "Category") ||
        (selectedDate && selectedDate !== "Any Date" && selectedDate !== "Date") ||
        (selectedLanguage && selectedLanguage !== "All Languages" && selectedLanguage !== "Language") ||
        (distance !== "Distance" && distance !== "Any Distance");

    const displayCategory =
        selectedCategory === "All Categories" ? "Category" : selectedCategory;
    const displayDate =
        selectedDate === "Any Date" ? "Date" : selectedDate;
    const displayLanguage =
        !selectedLanguage || selectedLanguage === "All Languages"
            ? "Language"
            : selectedLanguage;

    return (
        <View style={styles.container}>

            {/* ----- Doctor List Title */}
            <View style={styles.titleWrap}>
                <Image
                    source={stethoscopeIcon}
                    style={{ width: 17, height: 17 }}
                    resizeMode="contain"
                />
                <Text style={styles.titleInfo}>Doctor List</Text>
            </View>

            {/* -------- Appointment Tabs */}
            <View style={styles.tabsContainer}>
                {DOCTOR_TABS.map((tab) => {
                    const isActive = activeTab === tab;

                    return (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.8}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab,
                            ]}
                            onPress={() => onTabChange?.(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    isActive && styles.activeTabText,
                                ]}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* -------- Dropdowns */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
            >
                {/* Category Filter */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton,
                        selectedCategory !== "All Categories" && styles.activeDropdownButton,
                    ]}
                    onPress={() => setDropdown("category")}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.dropdownText,
                            selectedCategory !== "All Categories" && styles.activeDropdownText,
                        ]}
                        numberOfLines={1}
                    >
                        {displayCategory}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={10}
                        color={selectedCategory !== "All Categories" ? "#00A0ED" : "#000000"}
                    />
                </TouchableOpacity>

                {/* Date Filter */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton,
                        selectedDate !== "Any Date" && styles.activeDropdownButton,
                    ]}
                    onPress={() => setDropdown("date")}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.dropdownText,
                            selectedDate !== "Any Date" && styles.activeDropdownText,
                        ]}
                        numberOfLines={1}
                    >
                        {displayDate}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={10}
                        color={selectedDate !== "Any Date" ? "#00A0ED" : "#000000"}
                    />
                </TouchableOpacity>

                {/* Language Filter */}
                <TouchableOpacity
                    style={[
                        styles.dropdownButton,
                        selectedLanguage !== "All Languages" && styles.activeDropdownButton,
                    ]}
                    onPress={() => setDropdown("language")}
                    activeOpacity={0.8}
                >
                    <Text
                        style={[
                            styles.dropdownText,
                            selectedLanguage !== "All Languages" && styles.activeDropdownText,
                        ]}
                        numberOfLines={1}
                    >
                        {displayLanguage}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={10}
                        color={selectedLanguage !== "All Languages" ? "#00A0ED" : "#000000"}
                    />
                </TouchableOpacity>

                {/* Distance Filter */}
                {activeTab !== "Video Call" && (
                    <TouchableOpacity
                        style={[
                            styles.dropdownButton,
                            distance !== "Distance" && distance !== "Any Distance" && styles.activeDropdownButton,
                        ]}
                        onPress={() => setDropdown("distance")}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[
                                styles.dropdownText,
                                distance !== "Distance" && distance !== "Any Distance" && styles.activeDropdownText,
                            ]}
                            numberOfLines={1}
                        >
                            {distance}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={10}
                            color={distance !== "Distance" && distance !== "Any Distance" ? "#00A0ED" : "#000000"}
                        />
                    </TouchableOpacity>
                )}

                {/* Clear All Filters Button */}
                <TouchableOpacity
                    style={[
                        styles.clearFilterButton,
                        !hasActiveFilters && styles.clearFilterButtonDisabled,
                    ]}
                    onPress={handleClearAll}
                    activeOpacity={0.8}
                    disabled={!hasActiveFilters}
                >
                    <Ionicons
                        name="refresh-outline"
                        size={12}
                        color={hasActiveFilters ? "#E53935" : "#9E9E9E"}
                    />
                    <Text
                        style={[
                            styles.clearFilterText,
                            !hasActiveFilters && styles.clearFilterTextDisabled,
                        ]}
                    >
                        Clear All
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            {/* ------- Dropdown Modal */}
            <Modal
                visible={dropdown !== null}
                transparent
                animationType="fade"
                onRequestClose={() => setDropdown(null)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setDropdown(null)}
                >
                    <View style={styles.menuContainer}>
                        <ScrollView style={{ maxHeight: 260 }} showsVerticalScrollIndicator={false}>
                            {getOptions().map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    style={styles.menuItem}
                                    onPress={() => selectOption(option)}
                                >
                                    <Text style={styles.menuText}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>

        </View>
    );
};

export default DoctorListHeader;

const styles = StyleSheet.create({
    container: { width: "100%", paddingHorizontal: 16, paddingTop: 28, paddingBottom: 10, backgroundColor: "#fff", gap: 16, },
    titleWrap: { flexDirection: "row", alignItems: "center", gap: 8, width: "100%", },
    titleInfo: { color: "#212121", fontSize: 16, fontWeight: "600", },
    tabsContainer: { flexDirection: "row", justifyContent: "space-between", columnGap: 6, },
    tab: { flex: 1, height: 40, borderWidth: 1, borderColor: "#CCCCCC", borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingHorizontal: 2, boxShadow: "0px 1.28px 2.56px rgba(0, 0, 0, 0.1)" },
    activeTab: { backgroundColor: "#00A0ED", borderColor: "#00A0ED", },
    tabText: { fontSize: 13, color: "#4D4D4D", textAlign: "center", },
    activeTabText: { color: "#fff", fontWeight: "500", },
    filtersContainer: { flexDirection: "row", alignItems: "center", paddingVertical: 2, },
    dropdownButton: { height: 35, borderWidth: 1, borderColor: "#CCCCCC", borderRadius: 8, paddingLeft: 10, paddingRight: 6, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 8, minWidth: 68, backgroundColor: "#fff",},
    activeDropdownButton: { borderColor: "#00A0ED", backgroundColor: "#F0F9FF", },
    dropdownText: { fontSize: 13, color: "#4D4D4D", marginRight: 6},
    activeDropdownText: { color: "#00A0ED", fontWeight: "600", },
    clearFilterButton: { height: 35, borderWidth: 1, borderColor: "#FFCDD2", backgroundColor: "#FFEBEE", borderRadius: 8, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 4, marginRight: 8,},
    clearFilterButtonDisabled: { borderColor: "#E0E0E0", backgroundColor: "#F5F5F5", },
    clearFilterText: { fontSize: 13, color: "#E53935", fontWeight: "600", },
    clearFilterTextDisabled: { color: "#9E9E9E", fontWeight: "400", },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "center", alignItems: "center", },
    menuContainer: { width: 220, backgroundColor: "#fff", borderRadius: 10, paddingVertical: 6, elevation: 5, shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3, },
                    shadowOpacity: 0.2, shadowRadius: 6, },
    menuItem: { paddingVertical: 12, paddingHorizontal: 16, },
    menuText: { fontSize: 13, color: "#333", },
});