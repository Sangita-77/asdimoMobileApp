import React, {
  forwardRef,
  useImperativeHandle,
} from "react";

import {
  Dimensions,
  StyleSheet,
} from "react-native";

import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const { width, height } =
  Dimensions.get("window");

const SIZE =
  Math.sqrt(width * width + height * height) *
  2;

export interface TransitionRef {
  reveal: () => void;
  cover: (callback?: () => void) => void;
}

const CircularTransition =
  forwardRef<TransitionRef>((_, ref) => {
    const scale = useSharedValue(1);

    const opacity = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));

    useImperativeHandle(ref, () => ({
      reveal() {
        opacity.value = 1;

        scale.value = 1;

        scale.value = withTiming(
          45,
          {
            duration: 700,
            easing: Easing.out(Easing.cubic),
          },
          () => {
            opacity.value = withTiming(0, {
              duration: 150,
            });
          }
        );
      },

      cover(callback) {
        opacity.value = 1;

        scale.value = 45;

        scale.value = withTiming(
          1,
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
      },
    }));

    return (
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          {
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999,
            elevation: 99999,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              width: SIZE,
              height: SIZE,
              borderRadius: SIZE / 2,
              backgroundColor: "#fff",
            },
            animatedStyle,
          ]}
        />
      </Animated.View>
    );
  });

export default CircularTransition;