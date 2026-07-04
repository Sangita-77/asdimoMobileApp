import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { Asset } from "expo-asset";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { setGameVolume } from "../../components/SoundCompo/GameSound";


const SliderThumb = require("@/assets/images/SliderThumb.png");

export default function VolumeControl() {

    useEffect(() => {
    Asset.loadAsync([SliderThumb]);
  }, []);

  const [volume, setVolume] = useState(1);

  // Load saved volume on mount
  useEffect(() => {
    const loadVolume = async () => {
      try {
        const savedVolume = await AsyncStorage.getItem("gameVolume");
        if (savedVolume !== null) {
          const vol = parseFloat(savedVolume);
          setVolume(vol);
          setGameVolume(vol);
        }
      } catch (e) {
        console.log("Error loading volume", e);
      }
    };

    loadVolume();
  }, []);

  const changeVolume = async (value: number) => {
    setVolume(value);
    setGameVolume(value);

    try {
      await AsyncStorage.setItem("gameVolume", value.toString());
    } catch (e) {
      console.log("Error saving volume", e);
    }
  };

  return (
   <View style={styles.trackContainer}>
      <View style={styles.trackBackground} />
      <View style={[styles.trackFill, { width: `${volume * 100}%` }]} />
      <Image source={SliderThumb} style={[ styles.customThumb, { left: `${volume * 100}%` } ]}
/>


      <Slider
        style={[styles.VolumnSlider, { transform: [{ scale: 1.5 }] }]}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={changeVolume}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        // thumbImage={SliderThumb}
        thumbTintColor="transparent"
      />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  VolumnSlider:{
    width: 180,
  },
  trackContainer: {
  width: 180,
  height: 30,
  justifyContent: "center",
},

trackBackground: {
  position: "absolute",
  width: "100%",
  height: 20,
  backgroundColor: "#542514",
  borderRadius: 10,
},

trackFill: {
  position: "absolute",
  height: 12,
  backgroundColor: "#00D1E3",
  borderRadius: 20,
  borderLeftWidth: 3,
  borderColor: "#542514",
},

sliderOverlay: {
  width: "100%",
  height: 30,
},
customThumb: {
  position: "absolute",
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundImage: "{SliderThumb}",
  transform: [{ translateX: -15 }],
},
});