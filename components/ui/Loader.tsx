import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  View,
} from "react-native";
import { commonStyles } from "../../constants/globalStyle";

interface LoaderProps {
  visible?: boolean;
  text?: string;
}

export default function Loader({
  visible = true,
  text = "Loading...",
}: LoaderProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!visible) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [visible, opacity]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />

        <Animated.Text
          style={[
            styles.text,
            {
              opacity,
            },
          ]}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...commonStyles.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    zIndex: 9999,
    elevation: 9999,
  },

  loaderContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});

