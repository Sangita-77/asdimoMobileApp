import { playClickSound, setClickVolume, getSavedVolume} from "@/components/SoundCompo/ButtonSound";
import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import { Asset } from "expo-asset";

const PlusBtn = require("@/assets/images/plusImage.png");
const MinusBtn = require("@/assets/images/minusImage.png");

const levels = [0, 0.25, 0.5, 0.75, 1];

export default function ButtonSoundController() {

 useEffect(() => {
    Asset.loadAsync([PlusBtn, MinusBtn]);
  }, []);

  const [levelIndex, setLevelIndex] = useState(4);
  useEffect(() => {
    const init = async () => {
      const saved = await getSavedVolume();

      const index = levels.findIndex((v) => v === saved);
      if (index !== -1) {
        setLevelIndex(index);
      }
    };

    init();
  }, []);

  const updateVolume = (index: number) => {
    const newIndex = Math.max(0, Math.min(index, levels.length - 1));

    setLevelIndex(newIndex);
    setClickVolume(levels[newIndex]);

    // 🔊 play click sound
    playClickSound();
  };

  return (
    <View style={styles.container}>
      
      {/* Minus Button */}
      <Pressable
        style={[
          levelIndex === 0 && styles.disabledButton,
        ]}
        disabled={levelIndex === 0}
        onPress={() => updateVolume(levelIndex - 1)}
      >
        <Image source={MinusBtn}  resizeMode="cover" style={{ width: 45, height: 47 }}/>
      </Pressable>

      {/* Volume Indicator */}
      <View style={styles.center}>
        
        <View style={styles.levelContainer}>
          {levels.map((_, i) => (
            <View
              key={i}
              style={[
                styles.levelBar,
                i <= levelIndex && styles.activeBar,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Plus Button */}
      <Pressable
        style={[
          levelIndex === levels.length - 1 && styles.disabledButton,
        ]}
        disabled={levelIndex === levels.length - 1}
        onPress={() => updateVolume(levelIndex + 1)}
      >
        <Image source={PlusBtn}  resizeMode="cover" style={{ width: 45, height: 47 }}/>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  disabledButton: {
    opacity: 0.3,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  center: {
    alignItems: "center",
  },
  levelContainer: {
    flexDirection: "row",
    gap: 3,
  },
  levelBar: {
    width: 15,
    height: 37,
    backgroundColor: "#542514",
    borderRadius: 20,
  },
  activeBar: {
    backgroundColor: "#00D1E3",
    borderColor:"#542514",
    borderWidth: 2,
  },
});