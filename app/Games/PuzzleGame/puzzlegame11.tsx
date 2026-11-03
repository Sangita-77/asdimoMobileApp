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
import { commonStyles } from "../../../constants/globalStyle";

// LOAD ONCE (outside component)
const BrinjalOne = require("@/assets/images/puzzleGameElements/brinjalOne.png");
const BrinjalSlotOne = require("@/assets/images/puzzleGameElements/brinjalSlotOne.png");
const BrinjalTwo = require("@/assets/images/puzzleGameElements/brinjalTwo.png");
const BrinjalSlotTwo = require("@/assets/images/puzzleGameElements/brinjalSlotTwo.png");
const BrinjalFull = require("@/assets/images/puzzleGameElements/brinjalfull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);
  const { width, height } = useWindowDimensions();

  // Reference design size
  const BASE_WIDTH = 844;
  const BASE_HEIGHT = 390;

  // Uniform scaling for the puzzle layout
  const scale = Math.min(
  width / BASE_WIDTH,
  height / BASE_HEIGHT
);

  const s = (value: number) => value * scale;

  const overlaySize = Math.min(s(220), width * 0.65);
  const overlayFontSize = Math.min(s(42), overlaySize * 0.19);

  // ANIMATION VALUES
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([BrinjalOne, BrinjalSlotOne, BrinjalTwo, BrinjalSlotTwo, BrinjalFull,]);
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

  const level1Data = {
    slots: [
      // { id: 1, width: 102, height: 147, x: 130, y: 166, image: BrinjalSlotOne, },
      // { id: 2, width: 84, height: 194, x: 177, y: 55, image: BrinjalSlotTwo, },
      { id: 1, width: s(102), height: s(142), x: s(129), y: s(153), image: BrinjalSlotOne,},
      { id: 2, width: s(84), height: s(189), x: s(176), y: s(44), image: BrinjalSlotTwo,},
    ],

    pieces: [
      // { id: 1, width: 105, height: 145, startX: 30, startY: 10, image: BrinjalOne, },
      // { id: 2, width: 87, height: 194, startX: 100, startY: 115, image: BrinjalTwo, },
      { id: 1, width: s(102), height: s(142), startX: 30, startY: 10, image: BrinjalOne, },
      { id: 2, width: s(84), height: s(189), startX: 100, startY: 115, image: BrinjalTwo, },
    ],

    fullpieces: [
      // { id: 1, width: 65, height: 109, x: 72, y: 3, image: BrinjalFull, },
      { id: 1, width: s(65), height: s(102), x: s(69), y: s(0), image: BrinjalFull, },
    ],
  };


  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level1Data}
        currentLevel={1}
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
            <Text style={styles.levelText}>LEVEL 1</Text>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...commonStyles.absoluteFill,
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