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
      { id: 1, width: 158, height: 171, x: 56, y: 53, image: GiraffeSlotOne, },
      { id: 2, width: 101, height: 83, x: 180, y: 121, image: GiraffeSlotTwo, },
      { id: 3, width: 208, height: 139, x: 128, y: 179, image: GiraffeSlotThree, },
    ],
    
    pieces: [
      { id: 1, width: 160, height: 171, startX: 47, startY: 135, image: GiraffeOne, },
      { id: 2, width: 103, height: 85, startX: -4, startY: 178, image: GiraffeTwo, },
      { id: 3, width: 208, height: 139, startX: -14, startY: -12, image: GiraffeThree, },
    ],

    fullpieces: [
      { id: 1, width: 97, height: 108, x: 58, y: 3, image: GiraffeFull, },
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