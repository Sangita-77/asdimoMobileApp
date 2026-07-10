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
const AppleOne = require("@/assets/images/puzzleGameElements/appleOne.png");
const AppleSlotOne = require("@/assets/images/puzzleGameElements/appleSlotOne.png");
const AppleTwo = require("@/assets/images/puzzleGameElements/appleTwo.png");
const AppleSlotTwo = require("@/assets/images/puzzleGameElements/appleSlotTwo.png");
const AppleFull = require("@/assets/images/puzzleGameElements/applefull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);
  const { width, height } = useWindowDimensions();

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
      { id: 1, width: 183, height: 125, x: 117, y: 174, image: AppleSlotOne, },
      { id: 2, width: 193, height: 170, x: 107, y: 59, image: AppleSlotTwo, },
    ],

    pieces: [
      { id: 1, width: 183, height: 125, startX: 2.98, startY: 0, image: AppleOne, },
      { id: 2, width: 193, height: 171, startX: 23, startY: 129, image: AppleTwo, },
    ],

    fullpieces: [
      { id: 1, width: 97, height: 108, x: 58, y: 3, image: AppleFull, },
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