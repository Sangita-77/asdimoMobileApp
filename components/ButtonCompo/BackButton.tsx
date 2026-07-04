import { router, Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, } from "react-native"; 
interface BackButtonProps {
  size?: number;
  top?: number;
  left?: number;
  icon?: any;
  route?: Href;
}

// DEFAULT BACK ICON
const DefaultBackIcon = require("@/assets/images/BackButton.png");

export default function BackButton({
  size = 76,
  top = 10,
  left = 20,
  icon = DefaultBackIcon, 
  route = "/MainScreens/home",
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
      style={[ styles.container, { top, left, width: size, height: size, }, ]} >
      <Image source={icon} style={{ width: size, height: size, resizeMode: "contain", }} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { position: "absolute", zIndex: 100, },
});