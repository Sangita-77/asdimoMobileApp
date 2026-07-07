import LandscapeLock from "@/components/ui/LandscapeLock";
import Tab from "@/components/ui/Tab";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions, Text } from "react-native";
import CloudFloat from "../../components/AnimationCompo/CloudFloat";
import BackButton from "../../components/ButtonCompo/BackButton";
import Form, { useForm } from "../../components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ButtonCompo/Button";
import { styles as globalStyle } from "../../constants/globalStyle";




function StepOne() {
  const { nextStep } = useForm();

  return (
    <View>
      <Input placeholder="Phone / Email" />
      <Button text="Continue" onPress={nextStep} />
    </View>
  );
}

function StepTwo() {
  return (
    <View>
      <Input placeholder="Enter OTP" />
      <Button text="Verify OTP" />
    </View>
  );
}


export default function Index() {
  const [activeTab, setActiveTab] = useState("signin"); 
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const TreeLogin = require("../../assets/images/TreeLogin.png");
  const dimoAnimation = require("../../assets/images/dimoAnimation.mp4");
  const LoadingDimo = require("../../assets/images/LoadingDimo.png");
  const GoogleIcon = require("../../assets/images/GoogleIcon.png");
  const FacebookIcon = require("../../assets/images/FacebookIcon.png");

  const { width, height } = useWindowDimensions();

  const player = useVideoPlayer(
  require("../../assets/images/dimoAnimation.mp4"),
  (player) => {
    player.loop = true;
    player.play();
  }
);

const handleSubmit = () => {
  console.log("Form submitted");
  // Validate inputs
  // Call API
  // Navigate
};


useEffect(() => { Asset.loadAsync([ Rainbow, Cloude, TreeLogin, dimoAnimation, LoadingDimo, GoogleIcon, FacebookIcon]); }, []);
  return (
    
    <> 
    <LandscapeLock />
    <LinearGradient 
      colors={["#8AF8F8", "#FFA3D6"]}
      style={globalStyle.container}>
      <BackButton/>
      <Image source={TreeLogin} style={styles.TreeLogin} />
      <Image source={LoadingDimo} style={styles.AnimDino} resizeMode="contain" />
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
            <View style={styles.FormWrap}>
                    <View > 
                        <Tab tabs={[ { id: "signin", label: "Sign In" }, { id: "signup", label: "Sign Up" }, ]} activeTab={activeTab} onChange={setActiveTab} />
                        <View>
                          {activeTab === "signin" && 
                          <>
                              <Text style={styles.signinText}>Sign in to Your Account </Text>
                            <View style={styles.ContentBox}>
                                <View style={styles.socialConnection}>
                                  <Button
                                    style={{marginBottom: 20,}}
                                    text="Continue with Google"
                                    // onPress={handleSubmit}
                                    width="full"
                                    textSize="md"
                                    variant="white"
                                    icon={
                                    <Image
                                      source={GoogleIcon}
                                      style={{ width: 20, height: 20,}}
                                    />
                                    }
                                  />
                                  <Button
                                    text="Continue with Google"
                                    // onPress={handleSubmit}
                                    width="full"
                                    textSize="md"
                                    variant="white"
                                    icon={
                                    <Image
                                      source={FacebookIcon}
                                      style={{ width: 20, height: 20 }}
                                    />
                                    }
                                  />                                  
                                </View>
                                <View>
                                    <Form type="normal">
                                        <Input label="" placeholder="Enter Phone/Email ID" keyboardType="email-address" autoCapitalize="none" />
                                        <Input
                                          label=""
                                          placeholder="Enter Password"
                                          secureTextEntry
                                          autoCapitalize="none"
                                          autoCorrect={false}
                                          textContentType="password" 
                                          autoComplete="password"     
                                        />                                 
                                        <Button
                                          text="Continue"
                                          onPress={handleSubmit}
                                          width="full"
                                          textSize="lg"
                                        />
                                    </Form>
                                </View>
                            </View>
                           </>
                           }
                          {activeTab === "signup" && 
                          <> 
                            <Text style={styles.signinText}>Create Your Account</Text>
                              <View style={styles.ContentBox}>
                                <Form type="step">
                                  <StepOne />
                                  <StepTwo />
                                </Form>
                            </View>
                          </> 
                          }
                        </View>
                    </View>
           </View> 
    </LinearGradient>
    </>
  );
}


const styles = StyleSheet.create({
  formStyles:{marginTop: 20,},
  FormWrap:{zIndex: 100, marginLeft: 180,},
  ContentBox:{flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20,},
  TreeLogin:{position: "absolute", left: 0, top: -2, zIndex: 99,},
  AnimDino:{width: 320, height: 300, position: "absolute", left: -60, bottom: -20, zIndex: 99,},
  signinText:{color: "#000", textAlign: "center", fontWeight: 500, fontSize: 24, marginBottom: 15}, 
  socialConnection:{ borderRightWidth: 1, paddingRight: 20, borderColor: "#AFEBEE",}
});