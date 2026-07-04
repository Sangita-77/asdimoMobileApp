import React, { ReactNode, useEffect, useRef } from "react";
import {
  ImageBackground,
  Platform,
  Animated as RNAnimated,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Defs, Mask, Rect } from "react-native-svg";

// const { width, height } = Dimensions.get("window");
// const maxRadius = Math.sqrt(width * width + height * height);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  children: ReactNode;
  duration?: number;
  fillColor?: string;
  backgroundImage?: any;
  onCloseComplete?: () => void;
  triggerClose?: boolean;
}

export default function CircularReveal({
  children,
  duration = 700,
  fillColor = "black",
  backgroundImage,
  onCloseComplete,
  triggerClose = false,
}: Props) {

  const { width, height } = useWindowDimensions(); // ✅ inside component
  const maxRadius = Math.sqrt(width * width + height * height);

    /* ---------------- IOS SVG REVEAL ---------------- */
  const radius = useSharedValue(0);


  useEffect(() => {
    if (Platform.OS === "ios") {
      radius.value = withTiming(maxRadius, { duration });
    }
  }, []);

  useEffect(() => {
    if (triggerClose && Platform.OS === "ios") {
      radius.value = withTiming(0, { duration: 400 }, (finished) => {
        if (finished && onCloseComplete) {
          runOnJS(onCloseComplete)();
        }
      });
    }
  }, [triggerClose]);

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
  }));

  /* ---------------- ANDROID GPU REVEAL ---------------- */

  const scale = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    if (Platform.OS === "android") {
      RNAnimated.timing(scale, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  useEffect(() => {
    if (triggerClose && Platform.OS === "android") {
      RNAnimated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onCloseComplete?.();
      });
    }
  }, [triggerClose]);

  return (
    <View style={StyleSheet.absoluteFill}>
      
      {/* BACKGROUND */}
{/* BACKGROUND */}
{backgroundImage ? (
  <ImageBackground
    source={backgroundImage}
    style={StyleSheet.absoluteFill}
    resizeMode="cover"
  >
    {/* IOS MASK */}
    {Platform.OS === "ios" && (
      <Svg
        width={width}
        height={height}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      >
        <Defs>
          <Mask id="mask">
            <Rect width={width} height={height} fill="white" />
            <AnimatedCircle
              cx={width / 2}
              cy={height / 2}
              fill="black"
              animatedProps={animatedProps}
            />
          </Mask>
        </Defs>

        <Rect
          width={width}
          height={height}
          fill="black"
          mask="url(#mask)"
        />
      </Svg>
    )}
  </ImageBackground>
) : (
  <View style={[StyleSheet.absoluteFill, { backgroundColor: fillColor }]} />
)}

      {/* IOS MASK */}
      {/* {Platform.OS === "ios" && (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <Mask id="mask">
              <Rect width={width} height={height} fill="white" />
              <AnimatedCircle
                cx={width / 2}
                cy={height / 2}
                fill="black"
                animatedProps={animatedProps}
              />
            </Mask>
          </Defs>

          <Rect
            width={width}
            height={height}
            fill="black"
            mask="url(#mask)"
          />
        </Svg>
      )} */}

      {/* ANDROID REVEAL */}
      {Platform.OS === "android" && (
        <RNAnimated.View
          style={[
            styles.androidCircle,
            {
              transform: [{ scale }],
            },
          ]}
        />
      )}

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
androidCircle: {
  position: "absolute",
  width: 2000,
  height: 2000,
  borderRadius: 1000,
  backgroundColor: "black",
  top: "50%",
  left: "50%",
  marginTop: -1000,
  marginLeft: -1000,
},
});