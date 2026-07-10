import React, { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import Animated, {
    runOnJS,
    useAnimatedProps,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GlobalCircleTransitionProps {
  duration?: number;
  trigger: boolean;
  mode?: "open" | "close";
  onFinish?: () => void;
  startX?: number;
  startY?: number;
  color?: string;
}

export default function GlobalCircleTransition({
  duration = 600,
  trigger,
  mode = "open",
  onFinish,
  startX,
  startY,
  color = "white",
}: GlobalCircleTransitionProps) {
  const { width, height } = useWindowDimensions();

  const maxRadius = Math.sqrt(width * width + height * height);
  const radius = useSharedValue(mode === "open" ? 0 : maxRadius);

  useEffect(() => {
    if (!trigger) return;

    const toValue = mode === "open" ? maxRadius : 0;

    radius.value = withTiming(toValue, { duration }, (finished) => {
      if (finished && onFinish) {
        runOnJS(onFinish)();
      }
    });
  }, [trigger]);

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
  }));

  return (
    <Svg
      width={width}
      height={height}
      style={[styles.overlay, { pointerEvents: "none" }]}
    >
      <Defs>
        <Mask id="mask">
          <Rect width="100%" height="100%" fill="white" />
          <AnimatedCircle
            cx={startX ?? width / 2}
            cy={startY ?? height / 2}
            fill="black"
            animatedProps={animatedProps}
          />
        </Mask>
      </Defs>

      {/* Frame layer */}
      <Rect width="100%" height="100%" fill={color} mask="url(#mask)" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
});
