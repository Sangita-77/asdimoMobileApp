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
const GiraffeOne = require("@/assets/images/puzzleGameElements/giraffeOne.png");
const GiraffeSlotOne = require("@/assets/images/puzzleGameElements/giraffeSlotOne.png");
const GiraffeTwo = require("@/assets/images/puzzleGameElements/giraffeTwo.png");
const GiraffeSlotTwo = require("@/assets/images/puzzleGameElements/giraffeSlotTwo.png");
const GiraffeThree = require("@/assets/images/puzzleGameElements/giraffeThree.png");
const GiraffeSlotThree = require("@/assets/images/puzzleGameElements/giraffeSlotThree.png");
const GiraffeFull = require("@/assets/images/puzzleGameElements/giraffefull.png");

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
      await Asset.loadAsync([GiraffeOne, GiraffeSlotOne, GiraffeTwo, GiraffeSlotTwo, GiraffeThree, GiraffeSlotThree, GiraffeFull]);
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

  const level6Data = {
    slots: [
      // { id: 1, width: 158, height: 171, x: 56, y: 53, image: GiraffeSlotOne, },
      // { id: 2, width: 101, height: 83, x: 180, y: 121, image: GiraffeSlotTwo, },
      // { id: 3, width: 208, height: 139, x: 128, y: 179, image: GiraffeSlotThree, },
      { id: 1, width: s(148), height: s(161), x: s(56), y: s(53), image: GiraffeSlotOne, },
      { id: 2, width: s(92.3), height: s(76.3), x: s(173.3), y: s(118.3), image: GiraffeSlotTwo, },
      { id: 3, width: s(197), height: s(127), x: s(121), y: s(173), image: GiraffeSlotThree, },
    ],
    
    pieces: [
      { id: 1, width: s(148), height: s(161), startX: 47, startY: 135, image: GiraffeOne, },
      { id: 2, width: s(92.3), height: s(77.3), startX: -4, startY: 178, image: GiraffeTwo, },
      { id: 3, width: s(197), height: s(127), startX: -14, startY: -12, image: GiraffeThree, },
    ],

    fullpieces: [
      { id: 1, width: s(90), height: s(85), x: s(54), y: s(5), image: GiraffeFull, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level6Data}
        currentLevel={6}
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
            <Text style={styles.levelText}>LEVEL 6</Text>
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