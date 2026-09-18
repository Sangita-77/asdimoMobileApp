import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
const stethoscopeIcon = require("../../assets/images/stethoscope-icon.png");

type TabType = "At Home" | "Video Appointment" | "At Clinic";

const tabs: TabType[] = [
    "At Home",
    "Video Appointment",
    "At Clinic",
];
const categories = [
    "All Categories",
    "Physiotherapy",
    "Disorders & Autism Specialist",
    "Therapist",
];
const dates = [
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

const DoctorListHeader = () => {
    const [activeTab, setActiveTab] = useState<TabType>("At Home");

    const [category, setCategory] = useState("Categories");
    const [date, setDate] = useState("Date");
    const [distance, setDistance] = useState("Distance");

    const [dropdown, setDropdown] = useState<
        "category" | "date" | "distance" | null
    >(null);

    const getOptions = () => {
        if (dropdown === "category") return categories;
        if (dropdown === "date") return dates;
        if (dropdown === "distance") return distances;

        return [];
    };

    const selectOption = (value: string) => {
        if (dropdown === "category") {
            setCategory(value === "All Categories" ? "Categories" : value);
        }
        if (dropdown === "date") {
            setDate(value === "Any Date" ? "Date" : value);
        }
        if (dropdown === "distance") {
            setDistance(value === "Any Distance" ? "Distance" : value);
        }
        setDropdown(null);
    };

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
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;

                    return (
                        <TouchableOpacity
                            key={tab}
                            activeOpacity={0.8}
                            style={[
                                styles.tab,
                                isActive && styles.activeTab,
                            ]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    isActive && styles.activeTabText,
                                ]}
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
                        {category}
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
                    <Text style={styles.dropdownText}>
                        {date}
                    </Text>

                    <Ionicons
                        name="chevron-down"
                        size={10}
                        color="#000000"
                    />
                </TouchableOpacity>

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
    titleInfo: { color: "#212121", fontSize: 16, fontWeight: 600, },
    tabsContainer: { flexDirection: "row", justifyContent: "space-between", columnGap: 10, },
    tab: { flex: 1, height: 35, borderWidth: 1, borderColor: "#CCCCCC", borderRadius: 4, alignItems: "center", justifyContent: "center", backgroundColor: "#fff", boxShadow: "0px 1.28px 2.56px rgba(0, 0, 0, 0.1)" },
    activeTab: { backgroundColor: "#00A0ED", borderColor: "#00A0ED", },
    tabText: { fontSize: 10, color: "#4D4D4D", },
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