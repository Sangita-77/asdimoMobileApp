import { router, Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import { ROUTES } from "@/constants/routes";

interface SettingsButtonProps {
  size?: number;
  bottom?: number;
  right?: number;
  icon?: any;
  route?: Href;
}

const settingsImg = require("@/assets/images/settingButton.png");

export default function SettingsButton({
  size = 76,
  bottom = 10,
  right = 10,
  icon = settingsImg,
  route = ROUTES.APP.SETTINGS,
}: SettingsButtonProps) {
  return (
    <Pressable
      onPress={() => router.push(route)}
      style={[
        styles.container,
        {
          bottom,
          right,
          width: size,
          height: size,
        },
      ]}
    >
      <Image
        source={icon}
        style={{
          width: size,
          height: size,
          resizeMode: "contain",
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
  },
});