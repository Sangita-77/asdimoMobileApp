import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ListItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}

interface MyListProps {
  items: ListItem[];
}

export default function MyList({ items }: MyListProps) {
  return (
    <>
      {items.map((item, index) => (
        <View style={styles.Listitem} key={index}>
            <Ionicons name={item.icon} size={30} color="#1386E7" />
            <Text style={styles.Listtitle}>{item.title}</Text>
            <Text style={styles.Listtext}>{item.text}</Text>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  Listitem: {
    alignItems: "center",
    paddingVertical: 11,
  },
  Listtitle: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
  },

  Listtext: {
    textAlign: "center",
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },
});