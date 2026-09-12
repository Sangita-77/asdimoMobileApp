import { createAudioPlayer, AudioPlayer } from "expo-audio";

let sound: AudioPlayer | null = null;

export const loadGameSound = async () => {
  if (!sound) {
    sound = createAudioPlayer(
      require("../../assets/musics/music.mp3")
    );

    sound.loop = true;
    sound.volume = 1;
    sound.play();
  } else {
    // If already loaded but paused → resume
    sound.play();
  }
};

export const setGameVolume = (volume: number) => {
  if (sound) {
    sound.volume = volume;
  }
};

export const pauseGameSound = () => {
  if (sound) {
    sound.pause();
  }
};

export const resumeGameSound = () => {
  if (sound) {
    sound.play();
  }
};

export const stopGameSound = () => {
  if (sound) {
    sound.pause();
    sound.seekTo(0);
  }
};

export const unloadGameSound = () => {
  if (sound) {
    sound.remove();
    sound = null;
  }
};