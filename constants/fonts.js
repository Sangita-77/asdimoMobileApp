// constants/fonts.ts
import { useFonts } from "expo-font";

export const ThemeFonts = {
  GroBold: "GROBOLD",
};

export const useAppFonts = () => {
  const [loaded] = useFonts({
    // GROBOLD: require("../assets/fonts/GROBOLD.ttf"),
    GROBOLD: require("../assets/fonts/GROBOLD.ttf"),
  });

  return loaded;
};