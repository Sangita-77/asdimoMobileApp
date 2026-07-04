import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type TabItem = {
  id: string;
  label: string;
};

type Props = {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
};

export default function Tab({ tabs, activeTab, onChange }: Props) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, active && styles.activeTab]}
            activeOpacity={0.8}
            onPress={() => onChange(tab.id)}
          >
            <Text style={[ styles.tabText, ]} > {tab.label} </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", backgroundColor: "#E8F8FF", borderRadius: 30, padding: 6, alignSelf: "center", },
  tab: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, }, 
  activeTab: { backgroundColor: "#B2D237", },
  tabText: { fontSize: 16, fontWeight: "600", color: "#555", },
});