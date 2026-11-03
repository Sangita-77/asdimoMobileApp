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
const RabbitOne = require("@/assets/images/puzzleGameElements/rabbitOne.png");
const RabbitSlotOne = require("@/assets/images/puzzleGameElements/rabbitSlotOne.png");
const RabbitTwo = require("@/assets/images/puzzleGameElements/rabbitTwo.png");
const RabbitSlotTwo = require("@/assets/images/puzzleGameElements/rabbitSlotTwo.png");
const RabbitFull = require("@/assets/images/puzzleGameElements/rabbitfull.png");

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
      await Asset.loadAsync([RabbitOne, RabbitSlotOne, RabbitTwo, RabbitSlotTwo, RabbitFull,]);
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

  const level2Data = {
    slots: [
      // { id: 1, width: 121, height: 180, x: 141, y: 67, image: RabbitSlotOne, },
      // { id: 2, width: 148, height: 143, x: 135, y: 171, image: RabbitSlotTwo, },
      // { id: 1, width: vw(14.27), height: vw(19.64), x: vw(14.48), y: vw(6.87), image: RabbitSlotOne, },
      // { id: 2, width: vw(15.88), height: vw(15.34), x: vw(14.48), y: vw(18.35), image: RabbitSlotTwo, },
      { id: 1, width: s(121), height: s(180), x: s(126), y: s(52), image: RabbitSlotOne, },
      { id: 2, width: s(148), height: s(143), x: s(120), y: s(157), image: RabbitSlotTwo, },
    ],

    pieces: [
      // { id: 1, width: 122, height: 181, startX: 68, startY: 150, image: RabbitOne, },
      // { id: 2, width: 150, height: 143, startX: -20.984, startY: 4.2, image: RabbitTwo, },
      // { id: 1, width: vw(14.34), height: vw(19.72), startX: 68, startY: 130, image: RabbitOne, },
      // { id: 2, width: vw(15.88), height: vw(15.34), startX: -20.984, startY: 4.2, image: RabbitTwo, },
      { id: 1, width: s(121), height: s(180), startX: 68, startY: 130, image: RabbitOne, },
      { id: 2, width: s(148), height: s(143), startX: -20.984, startY: 4.2, image: RabbitTwo, },
    ],

    fullpieces: [
      // { id: 1, width: 65, height: 102, x: 74, y: 4, image: RabbitFull, },
      // { id: 1, width: vw(6.97), height: vw(10.94), x: vw(7.94), y: vw(0.43), image: RabbitFull, },
      { id: 1, width: s(65), height: s(91), x: s(68), y: s(4), image: RabbitFull, },
    ],
  };


  return (
    <View style={{ flex: 1 }}>
      <PuzzleGame
        game={level2Data}
        currentLevel={2}
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
            <Text style={styles.levelText}>LEVEL 2</Text>
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