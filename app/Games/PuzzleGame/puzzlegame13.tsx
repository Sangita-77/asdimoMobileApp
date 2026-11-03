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
const BananaOne = require("@/assets/images/puzzleGameElements/BananaOne.png");
const BananaSlotOne = require("@/assets/images/puzzleGameElements/BananaSlotOne.png");
const BananaTwo = require("@/assets/images/puzzleGameElements/BananaTwo.png");
const BananaSlotTwo = require("@/assets/images/puzzleGameElements/BananaSlotTwo.png");
const BananaFull = require("@/assets/images/puzzleGameElements/bananafull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);
  const { width, height } = useWindowDimensions();

  // const vw = (value: number) => (width * value) / 100;
  // const vh = (value: number) => (height * value) / 100;

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
      await Asset.loadAsync([BananaOne, BananaSlotOne, BananaTwo, BananaSlotTwo, BananaFull]);
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

  const level3Data = {
    slots: [
      // { id: 1, width: 149, height: 106, x: 81, y: 185, image: BananaSlotOne, },
      // { id: 2, width: 111, height: 226, x: 209, y: 73.24, image: BananaSlotTwo, },
      // { id: 1, width: vw(15.99), height: vw(11.37), x: vw(8.60), y: vw(19.85), image: BananaSlotOne, },
      // { id: 2, width: vw(11.91), height: vw(24.25), x: vw(22.42), y: vw(7.86), image: BananaSlotTwo, },
      { id: 1, width: s(149), height: s(106), x: s(63), y: s(170), image: BananaSlotOne, },
      { id: 2, width: s(111), height: s(226), x: s(192), y: s(59), image: BananaSlotTwo, },
    ],

    pieces: [
      // { id: 1, width: 148, height: 108, startX: 42, startY: 194, image: BananaOne, },
      // { id: 2, width: 112, height: 225, startX: 2.016, startY: 0.2, image: BananaTwo, },
      // { id: 1, width: vw(15.88), height: vw(11.59), startX: 42, startY: 194, image: BananaOne, },
      // { id: 2, width: vw(12.02), height: vw(24.14), startX: 2.016, startY: 0.2, image: BananaTwo, },
      { id: 1, width: s(149), height: s(106), startX: s(42), startY: s(194), image: BananaOne, },
      { id: 2, width: s(111), height: s(226), startX: s(2.016), startY: s(0.2), image: BananaTwo, },
    ],

    fullpieces: [
      // { id: 1, width: 107, height: 87, x: 49, y: 13, image: BananaFull, },
      // { id: 1, width: vw(11.48), height: vw(9.33), x: vw(5.26), y: vw(1.39), image: BananaFull, },
      { id: 1, width: s(93), height: s(81), x: s(50), y: s(12), image: BananaFull, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level3Data}
        currentLevel={3}
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
            <Text style={styles.levelText}>LEVEL 3</Text>
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