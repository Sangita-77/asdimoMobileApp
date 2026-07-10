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
const BananaOne = require("@/assets/images/puzzleGameElements/BananaOne.png");
const BananaSlotOne = require("@/assets/images/puzzleGameElements/BananaSlotOne.png");
const BananaTwo = require("@/assets/images/puzzleGameElements/BananaTwo.png");
const BananaSlotTwo = require("@/assets/images/puzzleGameElements/BananaSlotTwo.png");
const BananaFull = require("@/assets/images/puzzleGameElements/bananafull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);
  const { width, height } = useWindowDimensions();

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
      { id: 1, width: 149, height: 106, x: 81, y: 185, image: BananaSlotOne, },
      { id: 2, width: 111, height: 226, x: 209, y: 73.24, image: BananaSlotTwo, },
    ],

    pieces: [
      { id: 1, width: 148, height: 108, startX: 42, startY: 194, image: BananaOne, },
      { id: 2, width: 112, height: 225, startX: 2.016, startY: 0.2, image: BananaTwo, },
    ],

    fullpieces: [
      { id: 1, width: 107, height: 87, x: 49, y: 13, image: BananaFull, },
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