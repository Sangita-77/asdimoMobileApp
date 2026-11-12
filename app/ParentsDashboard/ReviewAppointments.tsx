
import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
} from "react-native";

import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import OrientationLock from "@/components/ui/ScreenOrientation";
import { doctorStyles, globalStyle } from "../../constants/globalStyle";

const appointments = [
  { id: "1", date: "Oct 10, 2026", time: "10:00 AM", therapist: "Sarah T." },
  { id: "2", date: "Oct 12, 2026", time: "11:00 AM", therapist: "Sarah T." },
  { id: "3", date: "Oct 15, 2026", time: "2:00 PM", therapist: "Sarah T." },
  { id: "4", date: "Oct 17, 2026", time: "9:00 AM", therapist: "Sarah T." },
];

const APPOINTMENT_PRICE = 120;

export default function Bookings() {
  const [selected, setSelected] = useState(["1", "3"]);

  const toggleSelection = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const proceedToPayment = () => {
    console.log("Selected appointments:", selected);
    console.log("Total amount:", selected.length * APPOINTMENT_PRICE);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <OrientationLock variant="portrait" />

      <Header title="Review Appointments" />

      <View style={styles.container}>
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <Text style={doctorStyles.heading}>Review Appointments</Text>
             <View style={styles.tableHeader}>
              <Text style={[styles.headerText, styles.slCol]}>Sl</Text>
              <Text style={[styles.headerText, styles.dateCol]}>Date</Text>
               <Text style={[styles.headerText, styles.timeCol]}>Time</Text>
              <Text style={[styles.headerText, styles.therapistCol]}>
                Therapist
              </Text>
               <Text style={[styles.headerText, styles.payCol]}>
                 Pay Now
               </Text>
             </View>
          </>
        }
          renderItem={({ item }) => {
            const isSelected = selected.includes(item.id);

            return (
              <View style={styles.tableRow}>
                <Text style={[styles.cellText, styles.slCol]}>
                  {item.id}
                </Text>

                <Text style={[styles.cellText, styles.dateCol]}>
                  {item.date}
                </Text>

                <Text style={[styles.cellText, styles.timeCol]}>
                  {item.time}
                </Text>

                <Text
                  style={[styles.cellText, styles.therapistCol]}
                  numberOfLines={1}
                >
                  {item.therapist}
                </Text>

                <View style={styles.payCol}>
                  <Pressable
                    onPress={() => toggleSelection(item.id)}
                    style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected,
                    ]}
                  >
                    {isSelected && (
                      <Text style={styles.checkMark}>✓</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            <View style={styles.summaryCard}>
              <View style={styles.summaryTitle}>
                <Text style={styles.infoIcon}>i</Text>
                <Text style={styles.summaryHeading}>
                  Payment Summary
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Total Appointments
                </Text>
                <Text style={styles.summaryValue}>
                  {appointments.length}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  Selected for Payment
                </Text>
                <Text style={styles.summaryValue}>
                  {selected.length}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>
                  ${(selected.length * APPOINTMENT_PRICE).toFixed(2)}
                </Text>
              </View>
            </View>
          }
        />

        <View style={styles.bottomButtons}>
          <Pressable
            style={styles.backButton}
            onPress={() => console.log("Go Back")}
          >
            <Text style={styles.buttonText}> Back</Text>
          </Pressable>

          <Pressable
            style={styles.paymentButton}
            onPress={proceedToPayment}
            disabled={selected.length === 0}
          >
            <Text style={styles.buttonText}>
              Proceed to Payment
            </Text>
          </Pressable>
        </View>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F8FA",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  listContent: {
    paddingBottom: 15,
  },

  tableHeader: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 13,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },

  headerText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#252525",
    textAlign: "center",
  },

  cellText: {
    fontSize: 12,
    color: "#7B8296",
    textAlign: "center",
  },

  slCol: {
    flex: 0.5,
  },

  dateCol: {
    flex: 1.5,
  },

  timeCol: {
    flex: 1.1,
  },

  therapistCol: {
    flex: 1.2,
  },

  payCol: {
    flex: 0.7,
    alignItems: "center",
    justifyContent: "center",
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 51,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9E9E9",
    elevation: 1,
  },

  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#BFC4CC",
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelected: {
    backgroundColor: "#1688E8",
    borderColor: "#1688E8",
  },

  checkMark: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "bold",
    lineHeight: 16,
  },

  summaryCard: {
    backgroundColor: "#F0F4FA",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginTop: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  summaryTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },

  infoIcon: {
    width: 17,
    height: 17,
    borderRadius: 10,
    backgroundColor: "#1688E8",
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },

  summaryHeading: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1688E8",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 20,
  },

  summaryLabel: {
    fontSize: 13,
    color: "#7B8296",
    fontWeight: "600",
  },

  summaryValue: {
    fontSize: 13,
    color: "#7B8296",
    fontWeight: "600",
  },

  totalLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },

  totalValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
  },

  bottomButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },

  backButton: {
    flex: 1,
    backgroundColor: "#31BDCA",
    borderRadius: 30,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },

  paymentButton: {
    flex: 1.25,
    backgroundColor: "#FFBF00",
    borderRadius: 30,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#000000",
    fontSize: 12,
    fontWeight: "600",
  },
});
