// components/SharedBackground.tsx

import Background from "@/components/ui/LoginBackground";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

export default function SharedBackground({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <View style={styles.container}>
      <Background />
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