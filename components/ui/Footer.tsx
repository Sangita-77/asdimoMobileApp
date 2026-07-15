import OrientationLock from "@/components/ui/ScreenOrientation";
import React from "react";
import { Text } from "react-native";

export default function Footer() {
  return (
    <>
    <OrientationLock variant="portrait" />
    <Text>Footer</Text>
    </>
  );
}