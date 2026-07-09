import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import PuzzleGame from "./puzzlegame";


// LOAD ONCE (outside component)
const RabbitOne = require("@/assets/images/GameElements/rabbitOne.png");
const RabbitSlotOne = require("@/assets/images/GameElements/rabbitSlotOne.png");
const RabbitTwo = require("@/assets/images/GameElements/rabbitTwo.png");
const RabbitSlotTwo = require("@/assets/images/GameElements/rabbitSlotTwo.png");
const RabbitFull = require("@/assets/images/GameElements/rabbitfull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([ RabbitOne, RabbitSlotOne, RabbitTwo, RabbitSlotTwo, RabbitFull, ]);
      setReady(true);
    }

    preload();
  }, []);

  if (!ready) return null;

const level2Data = {
  slots: [
    { id: 1, width: 121, height: 180,  x: 141, y: 67, image: RabbitSlotOne, },
    { id: 2, width: 148, height: 143,  x: 135, y: 171, image: RabbitSlotTwo, },
  ],

  pieces: [
    { id: 1, width: 122, height: 181, startX: 68, startY: 150, image: RabbitOne, },
    { id: 2, width: 150, height: 143, startX: -20.984, startY: 4.2, image: RabbitTwo, },
  ],

  fullpieces: [
    { id: 1, width: 65, height: 102,  x: 74, y: 4, image: RabbitFull, },
  ],
};


  return (
    <PuzzleGame
      game={level2Data}
      currentLevel={2}
    />
  );
}