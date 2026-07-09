import { Asset } from "expo-asset";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from "react-native";

import ShapeSorting from "./shapesorting";

// LOAD ONCE (outside component)
const Star = require("@/assets/images/GameElements/Star.png");
const StarSlot = require("@/assets/images/GameElements/StarSlot.png");
const Tiles = require("@/assets/images/GameElements/Tiles.png");
const TilesSlot = require("@/assets/images/GameElements/TilesSlot.png");

export default function ShapeSorting1() {
  const [ready, setReady] = useState(false);
  const [showLevelOverlay, setShowLevelOverlay] = useState(true);

  const { width, height } = useWindowDimensions();

  // ANIMATION VALUES
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([
        Star,
        StarSlot,
        Tiles,
        TilesSlot,
      ]);

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

  const level1Data = {
    slots: [
      { id: 1, x: width * 0.09, y: height * 0.3, size: width * 0.14, image: StarSlot, },
      { id: 2, x: width * 0.25, y: height * 0.3, size: width * 0.158, image: TilesSlot, },
    ],

    pieces: [
      { id: 1, size: width * 0.14, startX: width * 0.08, startY: height * 0.01, image: Star, },
      { id: 2, size: width * 0.158, startX: width * 0.068, startY: height * 0.3, image: Tiles, },
    ],
  };

  return (
    <View style={{ flex: 1 }}>
      <ShapeSorting
        game={level1Data}
        currentLevel={1}
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
            <Text style={styles.levelText}>LEVEL 1</Text>
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