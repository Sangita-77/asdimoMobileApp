import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export default function LandscapeLock() {
  useFocusEffect(
    useCallback(() => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.LANDSCAPE
      );

      return () => {
        // Optional: unlock when leaving this screen
        // ScreenOrientation.unlockAsync();
      };
    }, [])
  );

  return null;
}