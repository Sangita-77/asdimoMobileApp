import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  ImageSourcePropType,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

interface CloudFloatProps {
  source: ImageSourcePropType;
  top?: number;
  left?: number;
  size?: number;
  duration?: number;
  loop?: boolean;
}

export default function CloudFloat({
  source,
  top = 0,
  left = 0,
  size = 200,
  duration = 12000,
  loop = true,
}: CloudFloatProps) {
  const { width } = useWindowDimensions();
const translateX = useRef(new Animated.Value(0)).current;

  const [visible, setVisible] = useState(true);

useEffect(() => {
  let mounted = true;

  const startAnimation = () => {
    translateX.setValue(0);

    Animated.timing(translateX, {
      toValue: width + 20 - left,
      duration,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!mounted) return;

      if (loop && finished) {
        startAnimation();
      } else if (finished) {
        setVisible(false);
      }
    });
  };

  startAnimation();

  return () => {
    mounted = false;
    translateX.stopAnimation();
  };
}, [width, left, duration, loop]);

  if (!visible) return null;

  return (
    <Animated.Image
      source={source}
      resizeMode="contain"
      style={[
        styles.cloud,
        {
          top,
          left, // <-- fixed starting position
          width: size,
          height: size,
          transform: [{ translateX }],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  cloud: {
    position: "absolute",
  },
});