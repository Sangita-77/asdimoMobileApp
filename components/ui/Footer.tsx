// import OrientationLock from "@/components/ui/ScreenOrientation";
// import React from "react";
// import { Text, StyleSheet, View} from "react-native";

// export default function footer() {
//   return (
//     <>
//     <OrientationLock variant="portrait" />
//     <View style={styles.HeaderContainerWrap}>
//        <Text style={styles.HeaderText}>Footer</Text>
//     </View>
//     </>
//   );
// }
// const styles = StyleSheet.create({
//   HeaderContainerWrap:{
//     backgroundColor: "#00A0ED",
//     width: "100%",
//     padding: 15,
//   },
//   HeaderText:{
//    color: "#fff",
//    fontSize: 20,
//    fontWeight: 500,
//   },
// });
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
    </>
  );
}

const styles = StyleSheet.create({
  // footerContainer: {
  //   width: "100%",
  //   height: 72,
  //   backgroundColor: "#00A0ED",
  //   borderTopLeftRadius: 30,
  //   borderTopRightRadius: 30,

  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-around",

  //   paddingHorizontal: 8,
  // },
  footerContainer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: 72,
  backgroundColor: "#00A0ED",
  borderTopLeftRadius: 30,
  borderTopRightRadius: 30,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-around",
  paddingHorizontal: 8,
  flex: 1,
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