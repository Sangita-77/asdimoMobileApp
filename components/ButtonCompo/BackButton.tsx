import { router, Href } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet } from "react-native";
import * as ScreenOrientation from "expo-screen-orientation";

interface BackButtonProps {
  size?: number;
  top?: number;
  left?: number;
  icon?: any;
  route?: Href;
}

const DefaultBackIcon = require("@/assets/images/BackButton.png");

export default function BackButton({
  size = 76,
  top = 10,
  left = 20,
  icon = DefaultBackIcon,
  route = "/MainScreens/home",
}: BackButtonProps) {
  const onBackPress = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(route);
    }
  };

  return (
    <Pressable
      onPress={onBackPress}
      style={[
        styles.container,
        {
          top,
          left,
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