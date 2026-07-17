import OrientationLock from "@/components/ui/ScreenOrientation";
import React from "react";
import { Text, StyleSheet, View} from "react-native";

export default function footer() {
  return (
    <>
    <OrientationLock variant="portrait" />
    <View style={styles.HeaderContainerWrap}>
       <Text style={styles.HeaderText}>Footer</Text>
    </View>
    </>
  );
}
const styles = StyleSheet.create({
  HeaderContainerWrap:{
    backgroundColor: "#00A0ED",
    width: "100%",
    padding: 15,
  },
  HeaderText:{
   color: "#fff",
   fontSize: 20,
   fontWeight: 500,
  },
});