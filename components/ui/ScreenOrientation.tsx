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

const orientationMap = {
  portrait: ScreenOrientation.OrientationLock.PORTRAIT,
  "portrait-up": ScreenOrientation.OrientationLock.PORTRAIT_UP,
  "portrait-down": ScreenOrientation.OrientationLock.PORTRAIT_DOWN,
  landscape: ScreenOrientation.OrientationLock.LANDSCAPE,
  "landscape-left": ScreenOrientation.OrientationLock.LANDSCAPE_LEFT,
  "landscape-right": ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT,
} as const;

export default function OrientationLock({
  variant = "landscape",
}: OrientationLockProps) {
  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      const lockOrientation = async () => {
        try {
          if (!isMounted) return;

          await ScreenOrientation.lockAsync(
            orientationMap[variant]
          );
        } catch (error) {
          console.warn(
            `Failed to lock orientation to "${variant}":`,
            error
          );
        }
      };

      lockOrientation();

      return () => {
        isMounted = false;

        // ScreenOrientation.unlockAsync().catch((error) => {
        //   console.warn("Failed to unlock orientation:", error);
        // });
      };
    }, [variant])
  );

  return null;
}