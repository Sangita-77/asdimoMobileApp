import BackButton from "@/components/ButtonCompo/BackButton";
import QuitButton from "@/components/ButtonCompo/CloseButton";
import SettingsButton from "@/components/ButtonCompo/SettingsButton";
import { playClickSound } from "@/components/SoundCompo/ButtonSound";
import LandscapeLock from "@/components/ui/ScreenOrientation";
import { ROUTES } from "@/constants/routes";
import { Asset } from "expo-asset";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadGameSound } from "../../components/SoundCompo/GameSound";
import { Theme } from "../../constants/theme";
const CloseButton = require("@/assets/images/CloseButton.png");

const images = {
  bgImg: require("@/assets/images/background.png"),
  PuzzleIcon: require("@/assets/images/PuzzleIcon.png"),
  ShapeMatchingIcon: require("@/assets/images/ShapeMatchingIcon.png"),
  // emotions: require("@/assets/images/EmotionsIcon.png"),
  // motorSkill: require("@/assets/images/MotorSkillIcon.png"),
  // sequencing: require("@/assets/images/SequencingIcon.png"),
};

const { width } = Dimensions.get("window");

interface Category {
  id: number;
  title: string;
  icon: any;
  route: string;
}

const categories = [
  { id: 1, title: "Puzzle", icon: images.PuzzleIcon, route: ROUTES.PUZZLE.PUZZLE_1, },
  { id: 2, title: "Shape Matching", icon: images.ShapeMatchingIcon, route: ROUTES.SHAPESORTING.SHAPESORTING_1, },
  // { id: 3, title: "Emotions", icon: images.emotions, route: "/emotions", },
  // { id: 4, title: "Motor Skill", icon: images.motorSkill, route: "/motor-skill", },
  // { id: 5, title: "Sequencing", icon: images.sequencing, route: "/motor-skill", },
];



export default function HomeScreen() {
const [fontsLoaded] = useFonts({
  GROBOLD: require("../../assets/fonts/GROBOLD.ttf"),
});
console.log("fontsLoaded:", fontsLoaded);


// const scaleAnim = useRef(new Animated.Value(1)).current;
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const animations = useRef(
  categories.map(() => ({
    translateY: new Animated.Value(20),
    opacity: new Animated.Value(0),
    scale: new Animated.Value(1),
    float: new Animated.Value(0),
  }))
).current;

useEffect(() => {
  loadGameSound();

  Asset.loadAsync([
    images.bgImg,
    ...categories.map((item) => item.icon),
  ]);

 const startFloating = (anim: any, delay: number) => {
  setTimeout(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim.float, {
          toValue: -8,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(anim.float, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, delay);
}; 

animations.forEach((anim, index) => {
  Animated.sequence([
    Animated.delay(index * 150),
    Animated.parallel([
      Animated.timing(anim.opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(anim.translateY, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]),
  ]).start();

  startFloating(anim, index * 350);
});

}, []);

  return (
<> 
<LandscapeLock variant="landscape"/>
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>  
      <ImageBackground  source={images.bgImg} style={StyleSheet.absoluteFillObject} resizeMode="cover" >
        <View style={styles.container}>
        {Platform.OS === "android" && ( <QuitButton icon={CloseButton} /> )}
            <BackButton/>
              <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.containerWrap}>
                {categories.map((item, index) => {
                  const anim = animations[index];

                  return (
                    <AnimatedTouchable
                      key={item.id}
                      style={[
                        styles.categoryCard,
                        {
                          opacity: anim.opacity,
                          transform: [
                            { translateY: Animated.add(anim.translateY, anim.float) },
                            { scale: anim.scale },
                          ],
                        },
                      ]}
                      activeOpacity={0.5}
                      onPressIn={() => { Animated.spring(anim.scale, { toValue: 0.5, useNativeDriver: true, }).start(); }}
                      onPressOut={() => { Animated.spring(anim.scale, { toValue: 1, friction: 3, useNativeDriver: true, }).start(); }}
                      onPress={() => { playClickSound(); 
                        router.push(item.route); 
                      }}
                    >
                      <Image source={item.icon} style={styles.categoryIcon} />

                        <View style={styles.categoryBg}>
                            <Text style={[styles.categoryText, { color: Theme.color.GameText }]}>
                              {item.title}
                            </Text>
                        </View>
                        
                    </AnimatedTouchable>
                  );
                })}
              </ScrollView>
            <SettingsButton/>
        </View>
      </ImageBackground>
    </SafeAreaView>
</>  
  );
}


const styles = StyleSheet.create({
  containerWrap: { flexDirection: "row", justifyContent: "center", gap: 20, alignItems: "center", marginLeft: 50, marginTop: 50,},
  categoryCard: { width: 200, height: 200, justifyContent: "center", alignItems: "center", margin: 12, },
  categoryIcon: { width: 149, height: 129, resizeMode: "contain", elevation: 12, },
  categoryText: { fontSize: 18, fontWeight: "800", color: "#542514", },
  safeArea: { flex: 1, },
  container: { flex: 1, justifyContent: "center", alignItems: "center", },
  categoryBg: { alignSelf: "center", paddingHorizontal: width * 0.019, paddingVertical: width * 0.012 , backgroundColor: "#F6D6A8", borderEndEndRadius: 20, borderTopEndRadius: 13, borderTopLeftRadius: 13, borderBottomLeftRadius: 20, borderWidth: 4, borderColor: "#FD9C00", marginTop: 10, },
});