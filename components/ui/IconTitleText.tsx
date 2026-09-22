import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ListItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  text: string;
}

interface MyListProps {
  items: ListItem[];
  variant?: "default" | "horizontal";
}

export default function MyList({
  items,
  variant = "default",
}: MyListProps) {
  return (
    <>
      {items.map((item, index) => (
        <View
          style={[
            styles.Listitem,
            variant === "horizontal" && styles.horizontalItem,
          ]}
          key={index}
        >
          <Ionicons
            name={item.icon}
            size={30}
            color="#1386E7"
            style={variant === "horizontal" && styles.horizontalIcon}
          />

          <View
            style={[
              variant === "horizontal"
                ? styles.horizontalContent
                : styles.defaultContent,
            ]}
          >
            <Text
              style={[
                styles.Listtitle,
                variant === "horizontal" && styles.horizontalTitle,
              ]}
            >
              {item.title}
            </Text>

            <Text
              style={[
                styles.Listtext,
                variant === "horizontal" && styles.horizontalText,
              ]}
            >
              {item.text}
            </Text>
          </View>
        </View>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  // Default: icon top, title + text below
  Listitem: {
    alignItems: "center",
    paddingVertical: 11,
  },

  defaultContent: {
    alignItems: "center",
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

  // Horizontal: icon left, title + text right
  horizontalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 11,
  },

  horizontalIcon: {
    marginRight: 12,
  },

  horizontalContent: {
    flex: 1,
    alignItems: "flex-start",
  },

  horizontalTitle: {
    textAlign: "left",
  },

  horizontalText: {
    textAlign: "left",
  },
});

