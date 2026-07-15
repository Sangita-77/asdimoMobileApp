import OrientationLock from "@/components/ui/ScreenOrientation";
import React from "react";
import { Text } from "react-native";

export default function Header() {
  return (
    <>
    <OrientationLock variant="portrait" />
    <Text>Haeder</Text>
    </>
  );
}