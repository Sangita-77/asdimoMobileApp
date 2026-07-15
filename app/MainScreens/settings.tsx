import QuitButton from "@/components//ButtonCompo/CloseButton";
import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import BackButton from "@/components/ButtonCompo/BackButton";
import { playClickSound } from "@/components/SoundCompo/ButtonSound";
import ButtonSoundController from "@/components/ui/ButtonSoundStages";
import LandscapeLock from "@/components/ui/ScreenOrientation";
import VolumeControl from "@/components/ui/SoundSlider";
import { ROUTES } from "@/constants/routes";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect } from "react";
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// PRELOAD IMAGES
const bgImg = require("@/assets/images/SettingsBackground.png");
const BackButtonIcon = require("@/assets/images/BackButton.png");
const CloseButton = require("@/assets/images/CloseButton.png");
const SettingBoard = require("@/assets/images/SettingBoard.png");
const SettingController = require("@/assets/images/SettingController.png");
const DashBoardButton = require("@/assets/images/DashBoardButton.png");

export default function SettingsScreen() {
  const transition = useTransition();
  const [loaded] = useFonts({
    GROBOLD: require("../../assets/fonts/GROBOLD.ttf"),
  });
  useEffect(() => {
    Asset.loadAsync([
      bgImg,
      BackButtonIcon,
      CloseButton,
      SettingBoard,
      SettingController,
      DashBoardButton,
    ]);
  }, []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  if (!loaded) return null;

  return (
    <>
    <LandscapeLock />
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
        <ImageBackground source={bgImg} style={StyleSheet.absoluteFillObject} resizeMode="cover" >
        <View style={StyleSheet.absoluteFillObject}>
           <BackButton icon={BackButtonIcon} />
             {Platform.OS === "android" && <QuitButton icon={CloseButton} />}
               <View style={[styles.SettingBoardWrap]}>
                  <ImageBackground
                    source={SettingBoard}
                    style={[styles.SettingBoard]}
                    resizeMode="contain"
                  >
              <View style={[styles.SettingcontrollerWrap]}>
                <ImageBackground
                  source={SettingController}
                  style={[styles.SettingController]}
                  resizeMode="contain"
                >
                  <View style={styles.SoundWrap}>
                    <View style={styles.FlexBox}>
                      <Text style={styles.fontStyle}>MUSIC</Text>
                      <VolumeControl />
                    </View>
                    <View style={styles.FlexBox}>
                      <Text style={styles.fontStyle}>SOUND</Text>
                      <ButtonSoundController />
                    </View>
                  </View>
                </ImageBackground>
                  <Pressable
                    onPress={() => {
                      playClickSound();
                      transition.current?.cover(() => {
                          router.push(ROUTES.AUTH.DOCTORSLIST);
                      });
                    }}
                  >
                    <Image source={DashBoardButton} style={styles.DashBoardButton} resizeMode="cover" />
                </Pressable>
              </View>
            </ImageBackground>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  </>
  );
}

const styles = StyleSheet.create({
  SettingcontrollerWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  safeArea: {
    flex: 1,
  },
  SettingBoard: {
    height: 421,
    width: 379,
  },
  SettingBoardWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  SettingController: {
    height: 108,
    width: 315,
    justifyContent: "center",
    alignItems: "center",
  },
  RightIcon: {
    marginRight: 20,
  },
  WrongIcon: {
    marginLeft: 20,
  },
  FlexWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: -100,
  },
  FlexBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  DashBoardButton: {
    marginTop: 30,
    marginBottom: 15,
  },
  SoundWrap: {
    paddingTop: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fontStyle: {
    fontFamily: "GROBOLD",
    color: "#542514",
    fontSize: 26,
    width: 105,
  },
});
