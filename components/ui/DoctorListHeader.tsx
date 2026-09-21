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

export type TabType = "All" | "At Home" | "Video Appointment" | "At Clinic";

export const DOCTOR_TABS: TabType[] = [
    "All",
    "At Home",
    "Video Appointment",
    "At Clinic",
];

interface DoctorListHeaderProps {
    activeTab?: TabType;
    onTabChange?: (tab: TabType) => void;
    selectedCategory?: string;
    onCategoryChange?: (category: string) => void;
    selectedDate?: string;
    onDateChange?: (date: string) => void;
    categoriesList?: string[];
    datesList?: string[];
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
    categoriesList = defaultCategories,
    datesList = defaultDates,
}: DoctorListHeaderProps) => {
    const [distance, setDistance] = useState("Distance");
    const [dropdown, setDropdown] = useState<
        "category" | "date" | "distance" | null
    >(null);

    const getOptions = () => {
        if (dropdown === "category") return categoriesList;
        if (dropdown === "date") return datesList;
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
        if (dropdown === "distance") {
            setDistance(value === "Any Distance" ? "Distance" : value);
        }
        setDropdown(null);
    };

    const displayCategory =
        selectedCategory === "All Categories" ? "Category" : selectedCategory;
    const displayDate =
        selectedDate === "Any Date" ? "Date" : selectedDate;

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
            <View style={styles.filtersContainer}>

                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdown("category")}
                    activeOpacity={0.8}
                >
                    <Text
                        style={styles.dropdownText}
                        numberOfLines={1}
                    >
                        {displayCategory}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={10}
                        color="#000000"
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setDropdown("date")}
                    activeOpacity={0.8}
                >
                    <Text style={styles.dropdownText} numberOfLines={1}>
                        {displayDate}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={10}
                        color="#000000"
                    />
                </TouchableOpacity>

                {activeTab !== "Video Appointment" && (
                    <TouchableOpacity
                        style={styles.dropdownButton}
                        onPress={() => setDropdown("distance")}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.dropdownText}>
                            {distance}
                        </Text>

                        <Ionicons
                            name="chevron-down"
                            size={10}
                            color="#000000"
                        />
                    </TouchableOpacity>
                )}

            </View>

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
    tab: { flex: 1, height: 35, borderWidth: 1, borderColor: "#CCCCCC", borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", paddingHorizontal: 2, boxShadow: "0px 1.28px 2.56px rgba(0, 0, 0, 0.1)" },
    activeTab: { backgroundColor: "#00A0ED", borderColor: "#00A0ED", },
    tabText: { fontSize: 9.5, color: "#4D4D4D", textAlign: "center", },
    activeTabText: { color: "#fff", fontWeight: "500", },
    filtersContainer: { flexDirection: "row", alignItems: "center", },
    dropdownButton: { height: 30, borderWidth: 1, borderColor: "#CCCCCC", borderRadius: 8, paddingLeft: 10, paddingRight: 5, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginRight: 8, minWidth: 68, },
    dropdownText: { fontSize: 10, color: "#4D4D4D", marginRight: 8, },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.15)", justifyContent: "center", alignItems: "center", },
    menuContainer: { width: 220, backgroundColor: "#fff", borderRadius: 10, paddingVertical: 6, elevation: 5, shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3, },
                    shadowOpacity: 0.2, shadowRadius: 6, },
    menuItem: { paddingVertical: 12, paddingHorizontal: 16, },
    menuText: { fontSize: 13, color: "#333", },
});