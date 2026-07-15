import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

type OrientationVariant =
  | "portrait"
  | "portrait-up"
  | "portrait-down"
  | "landscape"
  | "landscape-left"
  | "landscape-right";

interface OrientationLockProps {
  variant?: OrientationVariant;
}

export default function OrientationLock({
  variant = "landscape",
}: OrientationLockProps) {
  useFocusEffect(
    useCallback(() => {
      const orientationMap = {
        portrait: ScreenOrientation.OrientationLock.PORTRAIT,
        "portrait-up": ScreenOrientation.OrientationLock.PORTRAIT_UP,
        "portrait-down": ScreenOrientation.OrientationLock.PORTRAIT_DOWN,
        landscape: ScreenOrientation.OrientationLock.LANDSCAPE,
        "landscape-left": ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
        "landscape-right": ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
      };

      ScreenOrientation.lockAsync(orientationMap[variant]);

      return () => {
        // Optional
        // ScreenOrientation.unlockAsync();
      };
    }, [variant])
  );

  return null;
}