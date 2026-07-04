import { useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";

export default function LandscapeLock() {
  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  }, []);

  return null;
}