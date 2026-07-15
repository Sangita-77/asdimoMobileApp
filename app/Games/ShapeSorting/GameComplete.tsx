import React, { useEffect } from "react";
import {
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Asset } from "expo-asset";

import BackButton from "@/components/ButtonCompo/BackButton";
import LandscapeLock from "@/components/ui/ScreenOrientation";

// BACKGROUND IMAGE
const GameCompleteBG = require("@/assets/images/LevelComplete.png");

export default function GameComplete() {

  // PRELOAD IMAGES
  useEffect(() => {
    async function preloadAssets() {
      await Asset.loadAsync([
        GameCompleteBG,
      ]);
    }

    preloadAssets();
  }, []);

  return (
    <ImageBackground
      source={GameCompleteBG}
      resizeMode="cover"
      style={styles.container}
    >
      <LandscapeLock />

      <BackButton />

      <View style={styles.overlay}>
        <Text style={styles.title}>
          GAME <br/>COMPLETED 
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    backgroundColor: "#2A0B44",
    paddingHorizontal: 70,
    paddingVertical: 20,
    borderRadius: 100,
  },

  title: {
    fontSize: 30,
    color: "#fff",
    fontFamily: "GroBold",
    letterSpacing: 3,
    textAlign: "center",
  },
});