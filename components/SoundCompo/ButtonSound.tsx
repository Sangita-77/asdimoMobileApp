import { createAudioPlayer, AudioPlayer } from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";

let clickSound: AudioPlayer | null = null;
let currentVolume = 1;

const STORAGE_KEY = "CLICK_VOLUME";

export const loadClickSound = async () => {
  if (!clickSound) {
    const savedVolume = await getSavedVolume();

    clickSound = createAudioPlayer(
      require("../../assets/musics/click.mp3")
    );

    clickSound.volume = savedVolume;
    currentVolume = savedVolume;
  }
};

export const playClickSound = async () => {
  if (!clickSound) {
    await loadClickSound();
  }

  if (clickSound) {
    clickSound.seekTo(0);
    clickSound.play();
  }
};

export const setClickVolume = async (volume: number) => {
  currentVolume = volume;

  if (clickSound) {
    clickSound.volume = volume;
  }

  await AsyncStorage.setItem(STORAGE_KEY, volume.toString());
};

export const getSavedVolume = async (): Promise<number> => {
  const value = await AsyncStorage.getItem(STORAGE_KEY);

  return value !== null ? parseFloat(value) : 1;
};

/**
 * Call this when the app/service is no longer needed.
 */
export const unloadClickSound = () => {
  if (clickSound) {
    clickSound.remove();
    clickSound = null;
  }
};