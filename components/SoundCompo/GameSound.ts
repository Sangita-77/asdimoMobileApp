import { AudioPlayer, createAudioPlayer } from "expo-audio";

let sound: AudioPlayer | null = null;

/**
 * Load and start game background music.
 * If already loaded, it simply resumes playback.
 */
export const loadGameSound = async (): Promise<void> => {
  try {
    if (!sound) {
      sound = createAudioPlayer(
        require("../../assets/musics/music.mp3")
      );

      sound.loop = true;
      sound.volume = 1;
    }

    sound.play();
  } catch (error) {
    console.error("Failed to load game sound:", error);
  }
};

/**
 * Set game music volume.
 * Volume range: 0 - 1
 */
export const setGameVolume = (volume: number): void => {
  if (!sound) return;

  const safeVolume = Math.max(0, Math.min(1, volume));

  sound.volume = safeVolume;
};

/**
 * Pause game music.
 */
export const pauseGameSound = (): void => {
  sound?.pause();
};

/**
 * Resume game music.
 */
export const resumeGameSound = (): void => {
  sound?.play();
};

/**
 * Stop game music and reset position to the beginning.
 */
export const stopGameSound = (): void => {
  if (!sound) return;

  sound.pause();
  void sound.seekTo(0);
};

/**
 * Completely unload the audio player.
 */
export const unloadGameSound = (): void => {
  if (!sound) return;

  sound.remove();
  sound = null;
};

/**
 * Check whether the game sound has been initialized.
 */
export const isGameSoundLoaded = (): boolean => {
  return sound !== null;
};

