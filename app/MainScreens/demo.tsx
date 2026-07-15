import { useTransition } from "@/components/AnimationCompo/TransitionProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import QuitButton from "@/components/ButtonCompo/CloseButton";
import SettingsButton from "@/components/ButtonCompo/SettingsButton";
import { playClickSound } from "@/components/SoundCompo/ButtonSound";
import LandscapeLock from "@/components/ui/LandscapeLock";
import { Asset } from "expo-asset";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadGameSound } from "../../components/SoundCompo/GameSound";
import { ROUTES } from "@/constants/routes";


// PRELOAD IMAGES
const bgImg = require("@/assets/images/background.png");
const demoImg = require("@/assets/images/demo.png");
const logoImg = require("@/assets/images/Logo.png");
const playImg = require("@/assets/images/PlayButton.png");
const settingsImg = require("@/assets/images/settingButton.png");
const CloseButton = require("@/assets/images/CloseButton.png");
const RingImage = require("@/assets/images/RingImage.png");

export default function HomeScreen() {
  const transition = useTransition();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [close, setClose] = useState(false);
  const [targetRoute, setTargetRoute] = useState("");

  useEffect(() => {
    loadGameSound();
  }, []);

  useEffect(() => {
    Asset.loadAsync([
      bgImg,
      demoImg,
      logoImg,
      playImg,
      settingsImg,
      CloseButton,
      RingImage,
    ]);

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
  }, []);


  
  return (
    <ProtectedRoute>
      <>
        <LandscapeLock />
        <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
          <ImageBackground
            source={bgImg}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          >
            <View style={styles.container}>
              {Platform.OS === "android" && <QuitButton icon={CloseButton} />}
              <View style={styles.containerWrap}>
                  <View style={styles.PlayButton}>
                      <Pressable
                        onPress={() => {
                          playClickSound();

                          transition.current?.cover(() => {
                            router.push(ROUTES.APP.CATEGORY);
                          });
                        }}
                      >
                      <Animated.Image
                        source={playImg}
                        style={{ transform: [{ scale: scaleAnim }] }}
                      />
                    </Pressable>
                  </View>
              </View>
              <SettingsButton/>
            </View>
          </ImageBackground>
        </SafeAreaView>
      </>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  containerWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    textAlign: "center",
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
  gridItem: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    paddingBottom: 5,
  },
  PlayButton: {
    marginTop: 50,
  },
  mainDemo: {
    flex: 1,
    justifyContent: "flex-end",
  },
  gridItemLast: {
    width: 160,
    justifyContent: "flex-end",
  },
  imageLogo: {
    width: 169,
  },
  settingsButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
});
