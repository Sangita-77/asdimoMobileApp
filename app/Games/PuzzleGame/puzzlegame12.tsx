import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import PuzzleGame from "./puzzlegame";


// LOAD ONCE (outside component)
const Triangle = require("@/assets/images/GameElements/Triangle.png");
const TriangleSlot = require("@/assets/images/GameElements/TriangleSlot.png");
const Square = require("@/assets/images/GameElements/Square.png");
const SquareSlot = require("@/assets/images/GameElements/SquareSlot.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([ Triangle, TriangleSlot, Square, SquareSlot, ]);
      setReady(true);
    }

    preload();
  }, []);

  if (!ready) return null;

  const leve2Data = {
    slots: [
      { id: 1, x: width * 0.11, y: height * 0.3, size: width * 0.114, image: TriangleSlot },
      { id: 2, x: width * 0.26, y: height * 0.32, size: width * 0.102, image: SquareSlot },
    ],
    pieces: [
      { id: 1, size: width * 0.114, startX: width * 0.15, startY: height * 0.2, image: Triangle},
      { id: 2, size: width * 0.102, startX: width * 0.04, startY: height * 0.22, image: Square},
    ],
  };

  return (
    <PuzzleGame
      game={leve2Data}
      currentLevel={2}
    />
  );
}