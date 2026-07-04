import { Audio } from "expo-av";

let sound: Audio.Sound | null = null;

export const loadGameSound = async () => {
  if (!sound) {
    const { sound: newSound } = await Audio.Sound.createAsync(
      require("../../assets/musics/music.mp3"),
      {
        shouldPlay: true,
        isLooping: true,
        volume: 1,
      }
    );
    sound = newSound;
  } else {
    // if already loaded but paused → resume
    await sound.playAsync();
  }
};

export const setGameVolume = async (volume: number) => {
  if (sound) {
    await sound.setVolumeAsync(volume);
  }
};

export const pauseGameSound = async () => {
  if (sound) {
    await sound.pauseAsync();
  }
};

export const resumeGameSound = async () => {
  if (sound) {
    await sound.playAsync();
  }
};

export const stopGameSound = async () => {
  if (sound) {
    await sound.stopAsync(); 
  }
};