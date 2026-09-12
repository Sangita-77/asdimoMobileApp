import CompoLoginBack from "@/components/ui/CompoLoginBack";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { styles as globalStyle } from "@/constants/globalStyle";

const plans = [
  { id: "1", title: "Attention & Memory" },
  { id: "2", title: "Problem Solving" },
  { id: "3", title: "Reading Skills" },
  { id: "4", title: "Listening Skills" },
  { id: "5", title: "Math Skills" },
  { id: "6", title: "Language Skills" },
];

export default function PersonalizeLearningPlan() {
  return (
      <CompoLoginBack>
        <View style={globalStyle.container2}>
          <Text style={globalStyle.signinText}>
            Let's create your personalized learning plan
          </Text>

          <View style={styles.grid}>
            {plans.map((item, index) => (
              <View key={item.id} style={styles.PlanWrap}>
                <View style={styles.PlanWrapflex}>
                  <Text style={styles.number}>{index + 1}</Text>
                  <Text style={styles.title}>{item.title}</Text>
                </View>

                <View style={styles.optionRow}>
                  <Pressable style={styles.optionBtn}>
                    <Text>Option 1</Text>
                  </Pressable>

                  <Pressable style={styles.optionBtn}>
                    <Text>Option 2</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>
      </CompoLoginBack>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  PlanWrap: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  PlanWrapflex: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  number: {
    fontWeight: "bold",
    fontSize: 18,
  },

  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },

  optionRow: {
    flexDirection: "row",
    gap: 10,
  },

  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
});