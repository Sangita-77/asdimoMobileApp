import BackButton from "@/components/ButtonCompo/BackButton";
import SettingsButton from "@/components/ButtonCompo/SettingsButton";
import LandscapeLock from "@/components/ui/LandscapeLock";
import { Asset } from "expo-asset";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import ChalkCircle from "../../../components/AnimationCompo/Hinthand";
import { Theme } from "../../../constants/theme";
import DraggablePiece from "./DraggablePiece";

// PRELOAD IMAGES
const bgImg = require("@/assets/images/GameElements/ShapeGameBG.png");
const SlotBG = require("@/assets/images/SlotBG.png");
const TitleBoard = require("@/assets/images/TitleBoard.png");
const settingsImg = require("@/assets/images/settingButton.png");
const BackButtonIcon = require("@/assets/images/BackButton.png");
const OverlayImage = require("@/assets/images/OverlayGame.png");


const SIZE = 100;
//TYPES
export type Slot = { id: number; x: number; y: number; size: number; image: any; };
export type Piece = { id: number; size: number; image: any; startX: number; startY: number; };
export type GameData = { slots: Slot[]; pieces: Piece[]; };


// Game Logic
export default function ShapeSorting({ game, currentLevel, }: { game: GameData; currentLevel: number; }) {
  const { width, height } = useWindowDimensions();
  const router = useRouter(); 
  const { slots, pieces: piecesData } = game;
  const [hintPath, setHintPath] = useState<{ fromX: number; fromY: number; toX: number; toY: number; } | null>(null);
  const [showHint, setShowHint] = useState<number | null>(null);
  const [slotBoxLayout, setSlotBoxLayout] = useState({ x: 0, y: 0, width: 0,height: 0,});
  const [pieceBoxLayout, setPieceBoxLayout] = useState({ x: 0, y: 0, width: 0, height: 0, });
  const [placed, setPlaced] = useState<number[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Sounds
  const correctSoundRef = useRef<Audio.Sound | null>(null);
  const wrongSoundRef = useRef<Audio.Sound | null>(null);
  const winSoundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {

  Asset.loadAsync([bgImg, TitleBoard, SlotBG, settingsImg, BackButtonIcon]);

  const loadSounds = async () => {
    const { sound: correct } = await Audio.Sound.createAsync(
      require("../../../assets/musics/Correct.mp3")
    );
    const { sound: wrong } = await Audio.Sound.createAsync(
      require("../../../assets/musics/Wrong.mp3")
    );
    const { sound: win } = await Audio.Sound.createAsync(
      require("../../../assets/musics/Win.mp3")
    );

    correctSoundRef.current = correct;
    wrongSoundRef.current = wrong;
    winSoundRef.current = win;
  };

  loadSounds();

  return () => {
    correctSoundRef.current?.unloadAsync();
    wrongSoundRef.current?.unloadAsync();
    winSoundRef.current?.unloadAsync();
  };
}, []);


const playCorrect = async () => {
  await correctSoundRef.current?.replayAsync();
};

const playWrong = async () => {
  await wrongSoundRef.current?.replayAsync();
};

  const playWin = async () => {
    await winSoundRef.current?.replayAsync();
  };

  
const routes = [
  "/Games/ShapeSorting/shapesorting11",
  "/Games/ShapeSorting/shapesorting12",
] as const;

useEffect(() => {
  if (placed.length === game.pieces.length) {
    playWin();

    setShowCelebration(true); //START CONFETTI

    setTimeout(() => {
      setShowCelebration(false); // stop it

      if (currentLevel >= routes.length) {
        router.replace("/Games/ShapeSorting/GameComplete");
      } else {
        router.replace(routes[currentLevel]);
      }
    }, 5000); // give time for animation
  }
}, [placed]);


return (
  <>
  <LandscapeLock />
  
  <SafeAreaView style={styles.safeArea} edges={["left", "right"]}> 
  <BackButton icon={BackButtonIcon} />
  <ImageBackground
       source={bgImg}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        
      >
  <GestureHandlerRootView style={{ flex: 1 }}>

  <View style={styles.container}>
    <Text
        style={styles.hintButton}
        onPress={() => {
          const remaining = piecesData.find(p => !placed.includes(p.id));
          if (!remaining) return;

          setShowHint(remaining.id);

          const target = slots.find(s => s.id === remaining.id);
          if (!target) return;

          // calculate global positions
          const fromX = pieceBoxLayout.x + remaining.startX;
          const fromY = pieceBoxLayout.y + remaining.startY;

          const toX = slotBoxLayout.x + target.x;
          const toY = slotBoxLayout.y + target.y;

          setHintPath({ fromX, fromY, toX, toY });

          setTimeout(() => {
            setShowHint(null);
            setHintPath(null);
          }, 4000);
        }}
      >
        💡 Hint
      </Text>
    
    {/* LEFT: PIECE BOX */}
    <View
      style={[
            styles.pieceBox,
            { width: width * 0.30, height: height * 0.64,},
      ]}
      onLayout={(e) => {
        setPieceBoxLayout(e.nativeEvent.layout);
      }}
    >
      {piecesData.map((piece) => (
        <DraggablePiece
          key={piece.id}
          piece={piece}
          placed={placed}
          setPlaced={setPlaced}
          slots={slots}
          slotBoxLayout={slotBoxLayout}
          pieceBoxLayout={pieceBoxLayout}
          showHint={showHint}
          playCorrect={playCorrect}
          playWrong={playWrong}
        />
      ))}
    </View>

    {/* RIGHT: SLOT BOX */}
    <View
    // source={SlotBG}
      style={styles.slotBox}
    // resizeMode="cover"
      onLayout={(e) => {
        setSlotBoxLayout(e.nativeEvent.layout);
      }}
    >
      <ImageBackground 
        resizeMode="contain"
        source={TitleBoard} 
        style={styles.TextBoard}
      >
         <Text style={[styles.GameText, { color: Theme.color.GameText, fontFamily: Theme.fonts.GroBold }]}>
            Shape Sorting
         </Text>
      </ImageBackground>

        <ImageBackground 
          style={[
            styles.SlotBG,
            { width: width * 0.48, height: height * 0.88,},
          ]}
           source={SlotBG} 
           resizeMode="contain">

              {slots.map((slot) => {
                const isHint = showHint === slot.id;

                return (
                  <View
                    key={slot.id}
                    style={[
                      styles.slot,
                      {
                        left: slot.x,
                        top: slot.y,
                        width: slot.size,
                        height: slot.size,
                      },
                    ]}
                  >
                    <Image
                      source={slot.image}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="contain"
                    />

                    {/* Chalk Animation */}
                    {isHint && <ChalkCircle width={slot.size} height={slot.size} />}
                  </View>
                );
              })}

          </ImageBackground>
    </View>

    {placed.length === piecesData.length && (
      <Text style={styles.winText}></Text>
    )}
    {showCelebration && (
    <ConfettiCannon
      count={150}
      origin={{ x: width / 2, y: 0 }} // center top
      // fadeOut
    />
  )}
    {hintPath && <HintHand path={hintPath} />}
  </View>
    <Image
      source={OverlayImage}
        style={styles.Overlayer}
      resizeMode="contain"
    />
    <SettingsButton icon={settingsImg}/>
    </GestureHandlerRootView>
  </ImageBackground>
  </SafeAreaView>
  </>
);
}


// HintHand

function HintHand({
  path,
}: {
  path: { fromX: number; fromY: number; toX: number; toY: number };
}) {
  const translateX = useSharedValue(path.fromX);
  const translateY = useSharedValue(path.fromY);

 // Move from piece → slot
useEffect(() => {
  const loop = () => {
    // move to slot
    translateX.value = withSpring(path.toX);
    translateY.value = withSpring(path.toY);

    // then go back to piece
    setTimeout(() => {
      translateX.value = withSpring(path.fromX);
      translateY.value = withSpring(path.fromY);

      // repeat again
      setTimeout(loop, 1000);
    }, 1500);
  };

  // start from piece
  translateX.value = path.fromX;
  translateY.value = path.fromY;

  loop();

  return () => {
    // cleanup: stop animation when unmount
    translateX.value = path.fromX;
    translateY.value = path.fromY;
  };
}, [path]);


  const style = useAnimatedStyle(() => ({
    top: 0,       
    left: 0,
    position: "absolute",
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.Text style={[style,     {
      fontSize: 40,
      zIndex: 999, 
      elevation: 999,
    },]}>
      👆
    </Animated.Text>
  );
}

// STYLES
const styles = StyleSheet.create({
safeArea: { flex: 1, },
slotText: { color: "white", fontSize: 12, textAlign: "center", },
container: {position: "relative", flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center",  marginTop: 20, marginRight: 170, marginLeft: 10,},
slotBox: {borderWidth: 2, borderColor: "#00000000", position: "relative", zIndex: 0,},
SlotBG:{width: "100%", height: "100%",},
GameText:{position: "absolute", width: "auto", height: 45, left: 0, right: 0, margin: "auto", top:5, textAlign: "center", fontSize: 24,},
TextBoard:{position: "absolute", width: "auto", height: 45, left: 0, right: 0, margin: "auto", zIndex: 99999, top: -20, textAlign: "center", flex: 1, alignItems: "center", justifyContent: "center",},
pieceBox: {backgroundColor: "#0d000075", borderColor: "#0d000050", position: "relative", zIndex: 9, borderTopWidth: 2, borderRadius: 10, borderLeftWidth: 2},
slot: { position: "absolute", width: SIZE, height: SIZE, },
piece: { position: "absolute", width: SIZE, height: SIZE, borderRadius: 10, },
winText: { position: "absolute", bottom: 50, alignSelf: "center", color: "white", fontSize: 24,},
hintButton: { position: "absolute", top: 10, left: 100, backgroundColor: "gold", padding: 10, borderRadius: 10, fontWeight: "bold", zIndex: 99,},
hintSlot: { borderWidth: 0, borderColor: "gold", shadowColor: "yellow", shadowOpacity: 1, shadowRadius: 100, elevation: 10, borderRadius: 100, backgroundColor: "#ffd9001f",},
hintPiece: { borderWidth: 0, borderColor: "gold", shadowColor: "gold", shadowOpacity: 1, shadowRadius: 100, elevation: 100, backgroundColor: "#ffd9001f", borderRadius: 100,},
Overlayer:{position: "absolute", right: 0, bottom: 0,},
});