import CloudFloat from "@/components/AnimationCompo/CloudFloat";
import LandscapeLock from "@/components/ui/ScreenOrientation";
import { ROUTES } from "@/constants/routes";
import { isAuthenticated } from "@/services/authService";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, ImageBackground, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { styles as globalStyle } from "../../constants/globalStyle";
// import LottieView from "lottie-react-native";
// import { pauseGameSound, resumeGameSound } from "../components/SoundCompo/GameSound";

export default function Index() {
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const animatedWidth = useState(new Animated.Value(0))[0];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = useWindowDimensions();

  const LoadingDimo = require("../../assets/images/Diano_Run.gif");
  const LoaderImage = require("../../assets/images/LoaderImage.png");
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");

// useFocusEffect(
//   useCallback(() => {
//     pauseGameSound(); // pause on this screen

//     return () => {
//       resumeGameSound(); // resume when leaving
//     };
//   }, [])
// );

  useEffect(() => {
    Asset.loadAsync([LoadingDimo, LoaderImage, Rainbow, Cloude]);
    let count = 0;

    const interval = setInterval(() => {
      count += 1;
      setProgress(count);

      Animated.timing(animatedWidth, {
        toValue: count,
        duration: 40,
        useNativeDriver: false,
      }).start();

      if (count >= 100) {
        clearInterval(interval);
        void isAuthenticated().then((authenticated) => {
          router.replace(
            authenticated ? ROUTES.APP.HOME : ROUTES.AUTH.LOGIN,
          );
        });
      }
    }, 70
  );
  return () => clearInterval(interval);

  }, []);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    
    <> 
  <LandscapeLock />
  <LinearGradient 
    colors={["#35FFFF", "#E45FAA"]}
    style={styles.container}>
    <Animated.View style={[{ opacity: fadeAnim }]}>  
    
    <ImageBackground
      source={Rainbow}
      style={styles.rainbowImage}
      resizeMode="contain"        
    >   
   <View style={StyleSheet.absoluteFillObject}>
    {/* Small cloudes */}
    <CloudFloat source={Cloude} top={height * 0.1} size={width * 0.2} left={width * 0.8} duration={8000} loop={false} />
    <CloudFloat source={Cloude} top={height * 0.05} size={width * 0.2} left={width * 0.1} duration={25000} loop={false} />
      {/* loops */}
      <CloudFloat source={Cloude} top={60} size={120} left={-300} duration={27000} loop/>
      <CloudFloat source={Cloude} top={60} size={120} left={-600} duration={37000} loop/>

    {/* Medium cloudes */} 
      <CloudFloat source={Cloude} top={height * 0.1} size={width * 0.2} left={-width * 0.5} duration={27000} loop />
      <CloudFloat source={Cloude} top={height * 0.15} size={width * 0.2} left={-width} duration={37000} loop />
      {/* loops */}
      <CloudFloat source={Cloude} top={height * 0.12} size={Math.min(width * 0.3, 180)} left={-width * 0.5} duration={40000} loop={false} />
      
    {/* Large cloudes */}
      <CloudFloat source={Cloude} top={height * 0.2} size={Math.min(width * 0.35, 210)} left={width * 0.6} duration={32000} loop={false} />

    </View>       
      <View style={styles.ContentBox}>
        <Image
          source={LoadingDimo}
          style={globalStyle.LoadingDimo}
          resizeMode="contain"
        />
    {/* <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <LottieView
        source={require("../../assets/images/LoadingDimo.json")}
        autoPlay
        loop
      />
    </View> */}
        <Text style={styles.percentText}>{progress}%</Text>
        <View style={styles.progressWrapper}>
          <Animated.View style={[styles.progressFill, { width: widthInterpolated }]}>
          <Image
            source={LoaderImage}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        </Animated.View>
        </View>
      </View>
      </ImageBackground>
      </Animated.View>
    </LinearGradient>
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ContentBox:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
  },
    rainbowImage:{
      width: 700,
      height: 500,
      justifyContent: "center",
      alignItems: "center",
    },
  progressWrapper: {
    width: "80%",
    height: 62,
    backgroundColor: "#1E2151",
    borderRadius: 50,
    overflow: "hidden",
    shadowColor: "#077E98",
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
    padding: 5,
    borderColor: "#0FEFEF",
    borderWidth: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 50,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  percentText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ffcc",
    letterSpacing: 2,
    marginBottom: 10,
    marginTop: 10,
  },
});