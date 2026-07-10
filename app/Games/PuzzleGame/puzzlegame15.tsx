import { Asset } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import PuzzleGame from "./puzzlegame";


// LOAD ONCE (outside component)
const CarrotOne = require("@/assets/images/puzzleGameElements/carrotOne.png");
const CarrotSlotOne = require("@/assets/images/puzzleGameElements/carrotSlotOne.png");
const CarrotTwo = require("@/assets/images/puzzleGameElements/carrotTwo.png");
const CarrotSlotTwo = require("@/assets/images/puzzleGameElements/carrotSlotTwo.png");
const CarrotFull = require("@/assets/images/puzzleGameElements/carrotfull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);
  const { width, height } = useWindowDimensions();

  // ANIMATION VALUES
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([CarrotOne, CarrotSlotOne, CarrotTwo, CarrotSlotTwo, CarrotFull]);
      setReady(true);
    }

    preload();
  }, []);

  // OVERLAY ANIMATION
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),

      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      setShowLevelOverlay(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (!ready) return null;

  const level5Data = {
    slots: [
      { id: 1, width: 55, height: 195, x: 165, y: 116, image: CarrotSlotOne, },
      { id: 2, width: 65, height: 184, x: 180, y: 56, image: CarrotSlotTwo, },
    ],
    
    pieces: [
      { id: 1, width: 60, height: 196, startX: 105.98, startY: 0, image: CarrotOne, },
      { id: 2, width: 68, height: 185, startX: 45, startY: 112, image: CarrotTwo, },
    ],

    fullpieces: [
      { id: 1, width: 97, height: 108, x: 58, y: 3, image: CarrotFull, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level5Data}
        currentLevel={5}
      />
      {showLevelOverlay && (
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.levelCircle,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <Text style={styles.levelText}>LEVEL 5</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.87)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  levelCircle: {
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#ffffff22",
    borderWidth: 4,
    borderColor: "#95F21F",
    justifyContent: "center",
    alignItems: "center",
  },

  levelText: {
    fontSize: 42,
    color: "#fff",
    fontFamily: "GroBold",
    letterSpacing: 3,
  },
});