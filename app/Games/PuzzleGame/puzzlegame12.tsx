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
      { id: 1, width: 121, height: 180, x: 141, y: 67, image: RabbitSlotOne, },
      { id: 2, width: 148, height: 143, x: 135, y: 171, image: RabbitSlotTwo, },
    ],

    pieces: [
      { id: 1, width: 122, height: 181, startX: 68, startY: 150, image: RabbitOne, },
      { id: 2, width: 150, height: 143, startX: -20.984, startY: 4.2, image: RabbitTwo, },
    ],

    fullpieces: [
      { id: 1, width: 65, height: 102, x: 74, y: 4, image: RabbitFull, },
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