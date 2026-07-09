import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import PuzzleGame from "./puzzlegame";


// LOAD ONCE (outside component)
const BananaOne = require("@/assets/images/GameElements/BananaOne.png");
const BananaSlotOne = require("@/assets/images/GameElements/BananaSlotOne.png");
const BananaTwo = require("@/assets/images/GameElements/BananaTwo.png");
const BananaSlotTwo = require("@/assets/images/GameElements/BananaSlotTwo.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([ BananaOne, BananaSlotOne, BananaTwo, BananaSlotTwo, ]);
      setReady(true);
    }

    preload();
  }, []);

  if (!ready) return null;

const level2Data = {
  slots: [
    { id: 1, width: width * 0.2502, height: (width * 0.25) / 1.980,  x: width * 0.100, y: width * 0.190, image: BananaSlotOne, },
    { id: 2, width: width * 0.127, height: (width * 0.25) / 1.460,  x: width * 0.225, y: width * 0.094, image: BananaSlotTwo, },
  ],

  pieces: [
    { id: 1, width: width * 0.2502, height: (width * 0.25) / 1.980, startX: width * 0.008, startY: height * 0.01, image: BananaOne, },
    { id: 2, width: width * 0.127, height: (width * 0.25) / 1.460, startX: width * 0.088, startY: height * 0.34, image: BananaTwo, },
  ],
};


  return (
    <PuzzleGame
      game={level2Data}
      currentLevel={2}
    />
  );
}