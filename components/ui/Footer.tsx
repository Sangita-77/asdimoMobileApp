import OrientationLock from "@/components/ui/ScreenOrientation";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Footer() {
  const menuItems = [
    {
      label: "Home",
      icon: "home",
      active: true,
    },
    {
      label: "Child",
      icon: "happy-outline",
    },
    {
      label: "Progress",
      icon: "trending-up-outline",
    },
    {
      label: "Control",
      icon: "information-circle-outline",
    },
    {
      label: "Settings",
      icon: "settings-outline",
    },
  ];

  return (
    <>
      <OrientationLock variant="portrait" />
     <View style={styles.Footer}>
        <View style={styles.footerContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.iconContainer,
                  item.active && styles.activeIconContainer,
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={item.active ? 24 : 23}
                  color={item.active ? "#00A0ED" : "#FFFFFF"}
                />
              </View>

              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  Footer:{ backgroundColor: "#fff", },
  footerContainer: {
    height: 72,
    width: "100%",
    backgroundColor: "#00A0ED",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },

  menuItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },

  activeIconContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
  },

  menuText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 16,
  },
});