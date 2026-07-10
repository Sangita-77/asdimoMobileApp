import { router, Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, } from "react-native"; 

interface BackButtonProps {
  size?: number;
  bottom?: number;
  right?: number;
  icon?: any;
  route?: Href;
}

// DEFAULT BACK ICON
const settingsImg = require("@/assets/images/settingButton.png");

export default function SettingsButton({
  size = 76,
  bottom = 10,
  right = 10,
  icon = settingsImg, 
  route = "/MainScreens/settings",
}: BackButtonProps) {
  return (
    <Pressable
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(route);
        }
      }}
      style={[ styles.container, { bottom, right, width: size, height: size, }, ]} >
      <Image source={icon} style={{ width: size, height: size, resizeMode: "contain", }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", zIndex: 100, },
});