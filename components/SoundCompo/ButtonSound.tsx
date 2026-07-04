import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

let clickSound: Audio.Sound | null = null;
let currentVolume = 1;

const STORAGE_KEY = "CLICK_VOLUME";

export const loadClickSound = async () => {
  if (!clickSound) {
    const savedVolume = await getSavedVolume();

    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/musics/click.mp3"),
      {
        shouldPlay: false,
        volume: savedVolume,
      }
    );

    clickSound = sound;
    currentVolume = savedVolume;
  }
};

export const playClickSound = async () => {
  if (!clickSound) {
    await loadClickSound();
  }

  if (clickSound) {
    await clickSound.setPositionAsync(0);
    await clickSound.playAsync();
  }
};

export const setClickVolume = async (volume: number) => {
  currentVolume = volume;

  if (clickSound) {
    await clickSound.setVolumeAsync(volume);
  }

  // 💾 Save volume
  await AsyncStorage.setItem(STORAGE_KEY, volume.toString());
};

export const getSavedVolume = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(STORAGE_KEY);
  return value !== null ? parseFloat(value) : 1; // default = 1
};