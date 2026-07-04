import React from "react";
import { Image, Vibration } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

// TYPES (redeclare or import if shared)
export type Slot = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  image: any;
};

export type Piece = {
  id: number;
  width: number;
  height: number;
  image: any;
  startX: number;
  startY: number;
};

type Props = {
  piece: Piece;
  placed: number[];
  setPlaced: React.Dispatch<React.SetStateAction<number[]>>;
  slots: Slot[];
  slotBoxLayout: { x: number; y: number };
  pieceBoxLayout: { x: number; y: number };
  showHint: number | null;
  playCorrect: () => void;
  playWrong: () => void;
  style?: any;
};

export default function DraggablePiece({
  piece,
  placed,
  setPlaced,
  slots,
  slotBoxLayout,
  pieceBoxLayout,
  playCorrect,
  playWrong,
  style: externalStyle,
  showHint,
}: Props) {
  const isHintPiece = showHint === piece.id;
  const translateX = useSharedValue(piece.startX);
  const translateY = useSharedValue(piece.startY);

  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const isPlaced = placed.includes(piece.id);
  const target = slots.find((s) => s.id === piece.id);

  const addPlaced = (id: number) => {
    setPlaced((prev) =>
      prev.includes(id) ? prev : [...prev, id]
    );
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      if (isPlaced) return;
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      if (isPlaced) return;
      translateX.value = startX.value + event.translationX;
      translateY.value = startY.value + event.translationY;
    })
    .onEnd(() => {
      if (slotBoxLayout.x === 0 || pieceBoxLayout.x === 0) return;
      if (isPlaced || !target) return;

      const pieceX = pieceBoxLayout.x + translateX.value;
      const pieceY = pieceBoxLayout.y + translateY.value;

      const slotX = slotBoxLayout.x + target.x;
      const slotY = slotBoxLayout.y + target.y;

      const dx = pieceX - slotX;
      const dy = pieceY - slotY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 60) {
        translateX.value = withSpring(slotX - pieceBoxLayout.x);
        translateY.value = withSpring(slotY - pieceBoxLayout.y);

        runOnJS(addPlaced)(piece.id);
        runOnJS(playCorrect)();
      } else {
        runOnJS(Vibration.vibrate)(100);
        runOnJS(playWrong)();

        translateX.value = withSpring(piece.startX);
        translateY.value = withSpring(piece.startY);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            width: piece.width,
            height: piece.height,
            borderRadius: 10,
          },
          externalStyle,
          isHintPiece && {
            shadowColor: "gold",
            shadowOpacity: 1,
            shadowRadius: 100,
            elevation: 100,
          },
          style,
        ]}
      >
        <Image
          source={piece.image}
          style={{
            width: piece.width * 1,
            height: piece.height * 1,
            position: "absolute",
            top: piece.height * 0.01,
            left: piece.width * 0.01,
          }}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}