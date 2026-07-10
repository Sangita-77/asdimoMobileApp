import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import PuzzleGame from "./puzzlegame";


// LOAD ONCE (outside component)
const BrinjalOne = require("@/assets/images/GameElements/brinjalOne.png");
const BrinjalSlotOne = require("@/assets/images/GameElements/brinjalSlotOne.png");
const BrinjalTwo = require("@/assets/images/GameElements/brinjalTwo.png");
const BrinjalSlotTwo = require("@/assets/images/GameElements/brinjalSlotTwo.png");
const BrinjalFull = require("@/assets/images/GameElements/brinjalfull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([ BrinjalOne, BrinjalSlotOne, BrinjalTwo, BrinjalSlotTwo, BrinjalFull, ]);
      setReady(true);
    }

    preload();
  }, []);

  if (!ready) return null;

const level1Data = {
  slots: [
    { id: 1, width: 121, height: 180,  x: 0, y: 120, image: BrinjalSlotOne, },
    { id: 2, width: 103, height: 200,  x: 135, y: 55, image: BrinjalSlotTwo, },
  ],

  pieces: [
    { id: 1, width: 122, height: 181, startX: 68, startY: 150, image: BrinjalOne, },
    { id: 2, width: 150, height: 143, startX: -20.984, startY: 4.2, image: BrinjalTwo, },
  ],

  fullpieces: [
    { id: 1, width: 65, height: 102,  x: 74, y: 4, image: BrinjalFull, },
  ],
};


  return (
    <PuzzleGame
      game={level1Data}
      currentLevel={1}
    />
  );
}