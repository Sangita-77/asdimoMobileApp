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
const AppleOne = require("@/assets/images/puzzleGameElements/appleOne.png");
const AppleSlotOne = require("@/assets/images/puzzleGameElements/appleSlotOne.png");
const AppleTwo = require("@/assets/images/puzzleGameElements/appleTwo.png");
const AppleSlotTwo = require("@/assets/images/puzzleGameElements/appleSlotTwo.png");
const AppleFull = require("@/assets/images/puzzleGameElements/applefull.png");

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
      await Asset.loadAsync([AppleOne, AppleSlotOne, AppleTwo, AppleSlotTwo, AppleFull]);
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

  const level4Data = {
    slots: [
      // { id: 1, width: 183, height: 125, x: 117, y: 174, image: AppleSlotOne, },
      // { id: 2, width: 193, height: 170, x: 107, y: 59, image: AppleSlotTwo, },
      // { id: 1, width: vw(19.64), height: vw(13.41), x: vw(12.55), y: vw(18.67), image: AppleSlotOne, },
      // { id: 2, width: vw(20.71), height: vw(18.24), x: vw(11.48), y: vw(6.33), image: AppleSlotTwo, },

      { id: 1, width: s(183), height: s(125), x: s(97), y: s(159), image: AppleSlotOne, },
      { id: 2, width: s(193), height: s(170), x: s(87), y: s(44), image: AppleSlotTwo, },
    ],

    pieces: [
      // { id: 1, width: vw(19.64), height: vw(13.41), startX: 2.98, startY: 0, image: AppleOne, },
      // { id: 2, width: vw(20.71), height: vw(18.24), startX: 23, startY: 129, image: AppleTwo, },
      { id: 1, width: s(183), height: s(125), startX: s(2.98), startY: s(-15), image: AppleOne, },
      { id: 2, width: s(193), height: s(170), startX: s(11), startY: s(119), image: AppleTwo, },
    ],

    fullpieces: [
      // { id: 1, width: 97, height: 108, x: 58, y: 3, image: AppleFull, },
      // { id: 1, width: vw(10.41), height: vw(11.59), x: vw(6.22), y: vw(0.32), image: AppleFull, },
      { id: 1, width: s(97), height: s(99), x: s(37), y: s(-3), image: AppleFull, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level4Data}
        currentLevel={4}
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
            <Text style={styles.levelText}>LEVEL 4</Text>
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