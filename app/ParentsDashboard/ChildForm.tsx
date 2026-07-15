import Button from "@/components/ButtonCompo/Button";
import Input from "@/components/ui/Input";
import LandscapeLock from "@/components/ui/ScreenOrientation";
import { ROUTES } from "@/constants/routes";
import { loginUser } from "@/services/authService";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    View,
    useWindowDimensions
} from "react-native";
import CloudFloat from "../../components/AnimationCompo/CloudFloat";
import BackButton from "../../components/ButtonCompo/BackButton";
import Form from "../../components/ui/Form";
import { styles as globalStyle } from "../../constants/globalStyle";


export default function Index() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const TreeLogin = require("../../assets/images/TreeLogin.png");
  const dimoAnimation = require("../../assets/images/dimoAnimation.mp4");
  const LoadingDimo = require("../../assets/images/Diano_Run.gif");
  const GoogleIcon = require("../../assets/images/GoogleIcon.png");
  const FacebookIcon = require("../../assets/images/FacebookIcon.png");

  const { width, height } = useWindowDimensions();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation", "Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await loginUser(email, password);
      // router.replace("/MainScreens/home");
      router.replace(ROUTES.APP.HOME);
    } catch (error) {
      Alert.alert(
        "Login failed",
        error instanceof Error ? error.message : "Unable to log in",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    Asset.loadAsync([
      Rainbow,
      Cloude,
      TreeLogin,
      dimoAnimation,
      LoadingDimo,
      GoogleIcon,
      FacebookIcon,
    ]);
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
        <View style={styles.FormWrap}>
          <Form type="normal">
              <Input
                variant="full"
                placeholder="Enter Phone/Email ID"
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="username"
              />
            <View style={globalStyle.Dflex}>  
              <Input
                variant="half"
                placeholder="Enter Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                autoComplete="password"
              />
              <Input
                variant="half"
                placeholder="Enter Password"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                autoComplete="password"
              />
            </View>
            <Button
              text={isSubmitting ? "Please wait..." : "Continue"}
              onPress={handleSubmit}
              width="full"
              textSize="lg"
              disabled={isSubmitting}
            />
          </Form>
        <View>
      </View>
    </View>
  </LinearGradient>
</>
);
}

const styles = StyleSheet.create({
  formStyles: { marginTop: 20 },
  FormWrap: { zIndex: 100, marginLeft: 180 },
  ContentBox: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 20,
  },
  TreeLogin: { position: "absolute", left: 0, top: -2, zIndex: 99 },
  AnimDino: {
    width: 320,
    height: 300,
    position: "absolute",
    left: -60,
    bottom: -20,
    zIndex: 99,
  },
  signinText: {
    color: "#000",
    textAlign: "center",
    fontWeight: 500,
    fontSize: 24,
    marginBottom: 15,
  },
  socialConnection: {
    borderRightWidth: 1,
    paddingRight: 20,
    borderColor: "#AFEBEE",
  },
});
