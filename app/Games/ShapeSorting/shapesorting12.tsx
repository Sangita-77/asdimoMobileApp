import { Asset } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import ShapeSorting from "./shapesorting";

// LOAD ONCE (outside component)
const Triangle = require("@/assets/images/GameElements/Triangle.png");
const TriangleSlot = require("@/assets/images/GameElements/TriangleSlot.png");
const Square = require("@/assets/images/GameElements/Square.png");
const SquareSlot = require("@/assets/images/GameElements/SquareSlot.png");
const Hexagon = require("@/assets/images/GameElements/Hexagon.png");
const HexagonSlot = require("@/assets/images/GameElements/HexagonSlot.png");
const Round = require("@/assets/images/GameElements/Round.png");
const RoundSlot = require("@/assets/images/GameElements/RoundSlot.png");



export default function ShapeSorting1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);

  const { width, height } = useWindowDimensions();

  // ANIMATION VALUES
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([ Triangle, TriangleSlot, Square, SquareSlot, Hexagon, HexagonSlot, Round, RoundSlot ]);
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

  const leve2Data = {
    slots: [
      { id: 1, x: width * 0.26, y: height * 0.48, size: width * 0.114, image: TriangleSlot, },
      { id: 2, x: width * 0.10, y: height * 0.50, size: width * 0.102, image: SquareSlot, },
      { id: 3, x: width * 0.26, y: height * 0.15, size: width * 0.114, image: HexagonSlot, },
      { id: 4, x: width * 0.10, y: height * 0.15, size: width * 0.114, image: RoundSlot, },
    ],

    pieces: [
      { id: 1, size: width * 0.114, startX: width * 0.02, startY: height * 0.03, image: Triangle, },
      { id: 2, size: width * 0.102, startX: width * 0.16, startY: height * 0.05, image: Square, },
      { id: 3, size: width * 0.114, startX: width * 0.02, startY: height * 0.33, image: Hexagon, },
      { id: 4, size: width * 0.114, startX: width * 0.16, startY: height * 0.33, image: Round, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <ShapeSorting
        game={leve2Data}
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