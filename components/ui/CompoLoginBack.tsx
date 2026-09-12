import Background from "@/components/ui/LoginBackground";
import { ReactNode } from "react";
import { ImageSourcePropType, StyleSheet, View } from "react-native";

interface SharedBackgroundProps {
  children: ReactNode;
  dinoImage?: ImageSourcePropType;
}

export default function SharedBackground({
  children,
  dinoImage,
}: SharedBackgroundProps) {
  return (
    <View style={styles.container}>
      <Background dinoImage={dinoImage} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    ...StyleSheet.absoluteFillObject,
  },
});