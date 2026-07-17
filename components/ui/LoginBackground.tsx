import LandscapeLock from "@/components/ui/ScreenOrientation";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Image, StyleSheet, View, useWindowDimensions, Dimensions } from "react-native";
import { styles as globalStyle } from "../../constants/globalStyle";
import CloudFloat from "../AnimationCompo/CloudFloat";
import BackButton from "../ButtonCompo/BackButton";
const { width } = Dimensions.get("window");

export default function Index() {
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const TreeLogin = require("../../assets/images/TreeLogin.png");
  const LoadingDimo = require("../../assets/images/Diano_Run.gif");


  const { width, height } = useWindowDimensions();

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        Rainbow, Cloude, TreeLogin, LoadingDimo
      ]);
    }
    loadAssets();
  }, []);

  return (
    <>
      <LandscapeLock />
      <LinearGradient
        colors={["#8AF8F8", "#FFA3D6"]}
        style={globalStyle.container}
      >
        <BackButton />
        <Image source={TreeLogin} style={styles.TreeLogin} />
        <Image
          source={LoadingDimo}
          style={styles.AnimDino}
          resizeMode="contain"
        />
        <View style={StyleSheet.absoluteFillObject}>
          {/* Small cloudes */}
          <CloudFloat source={Cloude} top={height * 0.02} size={width * 0.07} left={-width * 0.5} duration={40000} loop />
          <CloudFloat source={Cloude} top={height * 0.02} size={width * 0.15} left={-width * 0.5} duration={40000} loop />
          <CloudFloat source={Cloude} top={height * 0.02} size={width * 0.15} left={-width * 0.5} duration={40000} loop />

          {/* Medium cloudes */}
          <CloudFloat source={Cloude} top={height * 0.2} size={width * 0.2} left={width * 0.6} duration={13000} loop={false} />
          <CloudFloat source={Cloude} top={height * 0.1} size={width * 0.2} left={-width * 0.6} duration={35000} loop />
          <CloudFloat source={Cloude} top={height * 0.22} size={width * 0.2} left={width * 0.02} duration={25000} loop={false} />
          <CloudFloat source={Cloude} top={height * 0.22} size={width * 0.3} left={-width * 0.7} duration={60000} />

          {/* Large cloudes */}
          <CloudFloat source={Cloude} top={height * 0.15} size={width * 0.25} left={-width * 0.68} duration={40000} loop />
        </View>
        <View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  TreeLogin: { position: "absolute", left: 0, top: -2, zIndex: 99 },
  AnimDino: { width: width * 0.2, height: width * 0.25, position: "absolute", left:  5, bottom: 10, zIndex: 99, },
});
