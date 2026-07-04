import React from "react";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import Svg, { Rect } from "react-native-svg";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export default function ChalkCircle({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const padding = 6;

  const perimeter = 2 * (width + height);

  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1200,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: perimeter * (1 - progress.value),
  }));

  return (
    <Svg
      style={{
        position: "absolute",
        top: -padding,
        left: -padding,
      }}
      width={width + padding * 2}
      height={height + padding * 2}
    >
      <AnimatedRect
        x={padding}
        y={padding}
        width={width}
        height={height}
        rx={12} // rounded corners (optional)
        ry={12}
        stroke="#ffffff"
        strokeWidth={6}
        strokeDasharray={perimeter}
        animatedProps={animatedProps}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
}