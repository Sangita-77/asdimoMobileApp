import React, { forwardRef, useImperativeHandle } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import MaskedView from "@react-native-masked-view/masked-view";

import Svg, {
  Circle,
  Defs,
  Mask,
  Rect,
} from "react-native-svg"; 

import Animated, {
  Easing,
  runOnJS,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width, height } = Dimensions.get("window");

const SIZE = 60;

const MAX_RADIUS = Math.sqrt(width * width + height * height);

const MAX_SCALE = (MAX_RADIUS * 2) / SIZE;

export interface TransitionRef {
  reveal: () => void;
  cover: (callback?: () => void) => void;
}

const CircularTransition = forwardRef<TransitionRef>((_, ref) => {
  // Android
  const scale = useSharedValue(MAX_SCALE);

  // iOS
  const radius = useSharedValue(MAX_RADIUS);

  const opacity = useSharedValue(0);

  const circleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
  }));

  useImperativeHandle(ref, () => ({
    reveal() {
      opacity.value = 1;

      if (Platform.OS === "ios") {
        radius.value = MAX_RADIUS;

        radius.value = withTiming(
          0,
          {
            duration: 700,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            opacity.value = withTiming(0, {
              duration: 120,
            });
          }
        );
      } else {
        scale.value = MAX_SCALE;

        scale.value = withTiming(
          0,
          {
            duration: 700,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            opacity.value = withTiming(0, {
              duration: 120,
            });
          }
        );
      }
    },

    cover(callback) {
      opacity.value = 1;

      if (Platform.OS === "ios") {
        radius.value = 0;

        radius.value = withTiming(
          MAX_RADIUS,
          {
            duration: 700,
            easing: Easing.in(Easing.cubic),
          },
          (finished) => {
            if (finished && callback) {
              runOnJS(callback)();
            }
          }
        );
      } else {
        scale.value = 0;

        scale.value = withTiming(
          MAX_SCALE,
          {
            duration: 700,
            easing: Easing.in(Easing.cubic),
          },
          (finished) => {
            if (finished && callback) {
              runOnJS(callback)();
            }
          }
        );
      }
    },
  }));

if (Platform.OS === "ios") {
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          zIndex: 999999,
        },
        overlayStyle,
      ]}
    >
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <View
            style={{
              flex: 1,
              backgroundColor: "black", // Mask must be opaque
            }}
          >
          <Svg
            width={width}
            height={height}
            style={StyleSheet.absoluteFill}
          >
            <Defs>
              <Mask id="mask">
                <Rect
                  width={width}
                  height={height}
                  fill="white"
                />

                <AnimatedCircle
                  animatedProps={animatedProps}
                  cx={width / 2}
                  cy={height / 2}
                  fill="black"
                />
              </Mask>
            </Defs>

            <Rect
              width={width}
              height={height}
              fill="#fff"
              mask="url(#mask)"
            />
          </Svg>
          </View>
        }
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "#fff", // Your transition color
            },
          ]}
        />
      </MaskedView>
    </Animated.View>
  );
}

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        styles.container,
      ]}
    >
      <Animated.View
        renderToHardwareTextureAndroid
        style={[
          styles.circle,
          circleStyle,
        ]}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    zIndex: 999999,
    justifyContent: "center",
    alignItems: "center",
  },

  circle: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: "#fff",
  },
});

export default CircularTransition;