import QuitButton from "@/components/ButtonCompo/CloseButton";
import { playClickSound } from "@/components/SoundCompo/ButtonSound";
import LandscapeLock from "@/components/ui/LandscapeLock";
import { Asset } from "expo-asset";
import React, { useEffect, useRef } from "react";
import { Animated, ImageBackground, Platform, StyleSheet, View,  Image, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadGameSound } from "../../components/SoundCompo/GameSound";
const CloseButton = require("@/assets/images/CloseButton.png");
import BackButton from "@/components/ButtonCompo/BackButton";
import { router } from "expo-router";
import { Theme } from "../../constants/theme";
import { useFonts } from "expo-font";

const images = {
  bgImg: require("@/assets/images/background.png"),
  communication: require("@/assets/images/CommunicationIcon.png"),
  attention: require("@/assets/images/AttentionIcon.png"),
  emotions: require("@/assets/images/EmotionsIcon.png"),
  motorSkill: require("@/assets/images/MotorSkillIcon.png"),
  sequencing: require("@/assets/images/SequencingIcon.png"),
};


interface Category {
  id: number;
  title: string;
  icon: any;
  route: string;
}

const categories = [
  { id: 1, title: "Communication", icon: images.communication, route: "/communication", },
  { id: 2, title: "Attention", icon: images.attention, route: "/attention", },
  { id: 3, title: "Emotions", icon: images.emotions, route: "/emotions", },
  { id: 4, title: "Motor Skill", icon: images.motorSkill, route: "/motor-skill", },
  { id: 5, title: "Sequencing", icon: images.sequencing, route: "/motor-skill", },
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
<LandscapeLock />
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
                        // router.push(item.route); 
                      }}
                    >
                      <Image source={item.icon} style={styles.categoryIcon} />

                        <View style={styles.categoryBg}>
                          <Text style={{ color: Theme.color.GameText, fontFamily: "GROBOLD",}} >
                            {item.title}
                          </Text>
                        </View>
                        
                    </AnimatedTouchable>
                  );
                })}
              </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
</>  
  );
}

const styles = StyleSheet.create({
  containerWrap: { flexDirection: "row", justifyContent: "center", gap: 5, alignItems: "center", marginLeft: 50, marginTop: 50,},
  categoryCard: { width: 170, height: 180, justifyContent: "center", alignItems: "center", margin: 12, },
  categoryIcon: { width: 140, height: 121, resizeMode: "contain", elevation: 12, },
  categoryText: { marginTop: 14, fontSize: 16, fontWeight: "800", color: "#542514", },
  safeArea: { flex: 1, },
  container: { flex: 1, justifyContent: "center", alignItems: "center", },
  categoryBg: { alignSelf: "center", paddingHorizontal: 20, paddingVertical: 9, backgroundColor: "#F6D6A8", borderEndEndRadius: 20, borderTopEndRadius: 13, borderTopLeftRadius: 13, borderBottomLeftRadius: 20, borderWidth: 4, borderColor: "#FD9C00", marginTop: 10, },
});