import OrientationLock from "@/components/ui/ScreenOrientation";
import React from "react";
import { Text, StyleSheet, View, useWindowDimensions  } from "react-native";
import Svg, { Path } from "react-native-svg";

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { width } = useWindowDimensions();
  return (
    <>
      <OrientationLock variant="portrait" />

      <View>
        <View style={styles.HeaderContainerWrap}>
          <Text style={[styles.HeaderText, { width }]}>
            {title}
          </Text>
        </View>
    
          <Svg
            width={width}
            height={20}
            viewBox="0 0 1024 20"
            preserveAspectRatio="none"
          >
          <Path
            fill="#00A0ED"
            d="
              M0,0
              L0,10
              Q32,20 64,10
              Q96,0 128,10
              Q160,20 192,10
              Q224,0 256,10
              Q288,20 320,10
              Q352,0 384,10
              Q416,20 448,10
              Q480,0 512,10
              Q544,20 576,10
              Q608,0 640,10
              Q672,20 704,10
              Q736,0 768,10
              Q800,20 832,10
              Q864,0 896,10
              Q928,20 960,10
              Q992,0 1024,10
              L1024,0
              Z
            "
          />
        </Svg>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  HeaderContainerWrap: {
    backgroundColor: "#00A0ED",
    width: "100%",
    paddingVertical: 10,
  },
  HeaderText: {
    color: "#fff",
    fontSize: 20,
    paddingTop: 20,
    paddingLeft: 20,
    fontWeight: "500",
  },
});