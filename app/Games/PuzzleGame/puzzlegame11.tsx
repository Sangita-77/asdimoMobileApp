import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import PuzzleGame from "./puzzlegame";


// LOAD ONCE (outside component)
const BananaOne = require("@/assets/images/GameElements/BananaOne.png");
const BananaSlotOne = require("@/assets/images/GameElements/BananaSlotOne.png");
const BananaTwo = require("@/assets/images/GameElements/BananaTwo.png");
const BananaSlotTwo = require("@/assets/images/GameElements/BananaSlotTwo.png");
const BananaFull = require("@/assets/images/bananafull.png");

export default function PuzzleGame1() {
  const [ready, setReady] = useState(false);
  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function preload() {
      await Asset.loadAsync([ BananaOne, BananaSlotOne, BananaTwo, BananaSlotTwo, BananaFull ]);
      setReady(true);
    }

    preload();
  }, []);

  if (!ready) return null;

const level1Data = {

  // Old --------
//   slots: [
//     { id: 1, width: width * 0.2502, height: (width * 0.25) / 1.980,  x: width * 0.100, y: width * 0.190, image: BananaSlotOne, },
//     { id: 2, width: width * 0.127, height: (width * 0.25) / 1.460,  x: width * 0.225, y: width * 0.094, image: BananaSlotTwo, },
//   ],

//   pieces: [
//     { id: 1, width: width * 0.2502, height: (width * 0.25) / 1.980, startX: width * 0.008, startY: height * 0.01, image: BananaOne, },
//     { id: 2, width: width * 0.127, height: (width * 0.25) / 1.460, startX: width * 0.088, startY: height * 0.34, image: BananaTwo, },
//   ],
// };

  slots: [
    { id: 1, width: 149, height: 106,  x: 81, y: 185, image: BananaSlotOne, },
    { id: 2, width: 111, height: 226,  x: 209, y: 73.24, image: BananaSlotTwo, },
  ],

  pieces: [
    { id: 1, width: 148, height: 108, startX: 42, startY: 194, image: BananaOne, },
    { id: 2, width: 112, height: 225, startX: 2.016, startY: 0.2, image: BananaTwo, },
  ],

  fullpieces: [
    { id: 1, width: 107, height: 87,  x: 49, y: 13, image: BananaFull, },
  ],
};


//   slots: [
//     { id: 1, width: 246, height: 122,  x: width * 0.09, y: height * 0.450, image: BananaSlotOne, },
//     { id: 2, width: 121, height: 168,  x: width * 0.225, y: height * 0.225, image: BananaSlotTwo, },
//   ],

//   pieces: [
//     { id: 1, width: 246, height: 122, startX: width * 0.08, startY: height * 0.01, image: BananaOne, },
//     { id: 2, width: 121, height: 168, startX: width * 0.088, startY: height * 0.34, image: BananaTwo, },
//   ],
// };


  return (
    <PuzzleGame
      game={level1Data}
      currentLevel={1}
    />
  );
}