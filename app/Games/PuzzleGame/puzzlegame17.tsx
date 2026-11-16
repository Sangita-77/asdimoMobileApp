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
const lionOne = require("@/assets/images/puzzleGameElements/lionOne.png");
const lionSlotOne = require("@/assets/images/puzzleGameElements/lionSlotOne.png");
const lionTwo = require("@/assets/images/puzzleGameElements/lionTwo.png");
const lionSlotTwo = require("@/assets/images/puzzleGameElements/lionSlotTwo.png");
const lionThree = require("@/assets/images/puzzleGameElements/lionThree.png");
const lionSlotThree = require("@/assets/images/puzzleGameElements/lionSlotThree.png");
const lionFull = require("@/assets/images/puzzleGameElements/lionfull.png");

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
      await Asset.loadAsync([lionOne, lionSlotOne, lionTwo, lionSlotTwo, lionThree, lionSlotThree, lionFull]);
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

  const level7Data = {
    slots: [
      { id: 1, width: s(167), height: s(163), x: s(76), y: s(44), image: lionSlotOne, },
      { id: 2, width: s(120), height: s(124.9), x: s(107), y: s(163), image: lionSlotTwo, },
      { id: 3, width: s(183.7), height: s(158), x: s(137), y: s(122), image: lionSlotThree, },
    ],
    
    pieces: [
      { id: 1, width: s(167), height: s(165), startX: s(47), startY: s(126), image: lionOne, },
      { id: 2, width: s(120), height: s(124.9), startX: s(79), startY: s(-4), image: lionTwo, },
      { id: 3, width: s(183.7), height: s(158), startX: s(-60), startY: s(1), image: lionThree, },
    ],

    fullpieces: [
      { id: 1, width: s(94), height: s(93), x: s(39), y: s(-1), image: lionFull, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level7Data}
        currentLevel={7}
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
            <Text style={styles.levelText}>LEVEL 7</Text>
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