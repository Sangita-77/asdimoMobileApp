import CloudFloat from "../../components/AnimationCompo/CloudFloat";
import LandscapeLock from "@/components/ui/LandscapeLock";
import Tab from "@/components/ui/Tab";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import BackButton from "../../components/ButtonCompo/BackButton";
import { styles as globalStyle } from "../../constants/globalStyle";

export default function Index() {
  const [activeTab, setActiveTab] = useState("signin"); 
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const TreeLogin = require("../../assets/images/TreeLogin.png");
  const dimoAnimation = require("../../assets/images/dimoAnimation.mp4");
  const { width, height } = useWindowDimensions();

  const player = useVideoPlayer(
  require("../../assets/images/dimoAnimation.mp4"),
  (player) => {
    player.loop = true;
    player.play();
  }
);

useEffect(() => { Asset.loadAsync([ Rainbow, Cloude, TreeLogin, dimoAnimation ]); }, []);
 
  return (
    
    <> 
    <LandscapeLock />
    <LinearGradient 
      colors={["#8AF8F8", "#FFA3D6"]}
      style={globalStyle.container}>
      <BackButton/>
      <Image source={TreeLogin} style={styles.TreeLogin} />
            <View style={StyleSheet.absoluteFillObject}>
                {/* Small cloudes */}
                <CloudFloat source={Cloude} top={height * 0.02} size={width * 0.07} left={-width * 0.5} duration={40000} loop/>
                <CloudFloat source={Cloude} top={height * 0.02} size={width * 0.15} left={-width * 0.5} duration={40000} loop/>
                <CloudFloat source={Cloude} top={height * 0.02} size={width * 0.15} left={-width * 0.5} duration={40000} loop/>

                {/* Medium cloudes */} 
                <CloudFloat source={Cloude} top={height * 0.2} size={width * 0.2} left={width * 0.6} duration={13000} loop={false} />
                <CloudFloat source={Cloude} top={height * 0.1} size={width * 0.2} left={-width* 0.6} duration={35000} loop />
                <CloudFloat source={Cloude} top={height * 0.22} size={width * 0.2} left={width * 0.02} duration={25000} loop={false} /> 
                <CloudFloat source={Cloude} top={height * 0.22} size={width * 0.3} left={-width * 0.7} duration={60000} /> 
                
                {/* Large cloudes */}
                <CloudFloat source={Cloude} top={height * 0.15} size={width * 0.25} left={-width * 0.68} duration={40000} loop/>
            </View>       
            <View style={styles.ContentBox}>
                    <View> 
                        <Tab tabs={[ { id: "signin", label: "Sign In" }, { id: "signup", label: "Sign Up" }, ]} activeTab={activeTab} onChange={setActiveTab} />
                        <View style={{ marginTop: 30 }}>
                          {activeTab === "signin" && <Text> Sign in </Text> }
                          {activeTab === "signup" && <Text> Sign Up </Text> }
                        </View>
                    </View>
           </View> 
    </LinearGradient>
    </>
  );
}


const styles = StyleSheet.create({
  ContentBox:{flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20, alignItems: "center", zIndex:200,},
  TreeLogin:{position: "absolute", left: 0, top: -2, zIndex: 99,},
});