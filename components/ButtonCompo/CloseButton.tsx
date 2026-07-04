import React from "react";
import {
  Alert,
  BackHandler,
  Image,
  Platform,
  Pressable,
  StyleSheet
} from "react-native";

interface QuitButtonProps {
  icon: any;
  size?: number;
  top?: number;
  right?: number;
}

export default function QuitButton({
  icon,
  size = 76,
  top = 10,
  right = 20,
}: QuitButtonProps) {

  const handleQuit = () => {
    Alert.alert(
      "Exit App",
      "Are you sure you want to quit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Exit",
          onPress: () => {
            if (Platform.OS === "android") {
              BackHandler.exitApp();
            }
          },
        },
      ]
    );
  };

  return (
    <Pressable
      style={[styles.container, { top, right, width: size, height: size }]}
      onPress={handleQuit}
    >
      <Image
        source={icon}
        style={{ width: size, height: size, resizeMode: "contain" }}
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