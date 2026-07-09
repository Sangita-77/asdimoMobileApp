import LandscapeLock from "@/components/ui/LandscapeLock";
import Tab from "@/components/ui/Tab";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import React,{ useEffect, useState } from "react";
import { Image, StyleSheet, View, useWindowDimensions, Text } from "react-native";
import CloudFloat from "../../components/AnimationCompo/CloudFloat";
import BackButton from "../../components/ButtonCompo/BackButton";
import Form, { useForm } from "../../components/ui/Form";
import Input from "@/components/ui/Input";
import Button from "@/components/ButtonCompo/Button";
import { styles as globalStyle } from "../../constants/globalStyle";
import Select from "@/components/ui/Select";



function StepOne() {
const { nextStep, formData, setFormData, errors, } = useForm();
  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input
          variant="half"
          placeholder="Full Name"
          value={formData.fullName}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, fullName: text }))
          }
          error={errors.fullName}
        />

        <Input
          variant="half"
          placeholder="Email Address"
          value={formData.email}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, email: text }))
          }
          error={errors.email}
        />

      </View>

      <Button text="Next Step" textSize="lg" onPress={nextStep} />
    </View>
  );
}


function StepTwo() {
  const { nextStep, formData } = useForm();
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
  };

  return (
    <View>
      <Text style={globalStyle.smallText}>
        Verification code sent to <Text>{formData.email}</Text>
      </Text>
      <View style={globalStyle.Dflex}>
        <Input
          variant="otp"
          placeholder="12345"
          keyboardType="number-pad"
          maxLength={5}
          timer={timer}
          onResend={handleResend}
        />
      </View>

      <Button text="Continue" textSize="lg" onPress={nextStep} />
    </View>
  );
}



function StepThree() {
  const { nextStep, formData, setFormData } = useForm();

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input
          placeholder="Phone"
          variant="half"
          keyboardType="phone-pad"
          value={formData.phone}
          error=""
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, phone: text }))
          }
        />
        <Input
          placeholder="Address"
          variant="half"
          value={formData.address}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, address: text }))
          }
        />
      </View>

      <Button text="Next Step" textSize="lg" onPress={nextStep} />
    </View>
  );
}


function StepFour() {
  const { nextStep, formData, setFormData } = useForm();

  const cities = [
    { label: "DemiCity1", value: "democity1" },
    { label: "DemiCity2", value: "democity2" },
    { label: "DemiCity3", value: "democity3" },
    { label: "DemiCity4", value: "democity4" },
    { label: "DemiCity5", value: "democity5" },
  ];

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Select
          placeholder="City"
          data={cities}
          value={formData.city}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, city: value }))
          }
          variant="half"
        />
        <Input
          placeholder="State"
          variant="half"
          value={formData.state}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, state: text }))
          }
        />
      </View>

      <Button text="Next Step" onPress={nextStep} textSize="lg" />
    </View>
  );
}


function StepFive() {
  const { nextStep, formData, setFormData } = useForm();

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input
          placeholder="Zip"
          keyboardType="number-pad"
          variant="half"
          value={formData.zip}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, zip: text }))
          }
        />
        <Input
          placeholder="Country"
          variant="half"
          value={formData.country}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, country: text }))
          }
        />
      </View>

      <Button text="Next Step" onPress={nextStep} textSize="lg" />
    </View>
  );
}

function StepSix() {
  const { formData, setFormData } = useForm();

  const handleSubmit = () => {
    console.log(formData);
  };

  return (
    <View>
      <View style={globalStyle.Dblock}>
        <Input
          placeholder="ORG. / Therapist Referral Code"
          variant="full"
          value={formData.referralCode}
          onChangeText={(text) =>
            setFormData((prev) => ({
              ...prev,
              referralCode: text,
            }))
          }
        />
       <Button text="Submit" textSize="lg" width="full" onPress={handleSubmit} />
      </View>
    </View>
  );
}


export default function Index() {
  const [activeTab, setActiveTab] = useState("signin"); 
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const TreeLogin = require("../../assets/images/TreeLogin.png");
  const LoadingDimo = require("../../assets/images/LoadingDimo.png");
  const GoogleIcon = require("../../assets/images/GoogleIcon.png");
  const FacebookIcon = require("../../assets/images/FacebookIcon.png");

  const { width, height } = useWindowDimensions();

const handleSubmit = () => {
  console.log("Form submitted");
  // Validate inputs
  // Call API
  // Navigate
};


useEffect(() => {
    async function loadAssets() {
        await Asset.loadAsync([ Rainbow, Cloude, TreeLogin, LoadingDimo, GoogleIcon, FacebookIcon, ]);
    }
    loadAssets();
}, []);

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
                          icon={ <Image source={GoogleIcon} style={{ width: 20, height: 20,}} /> }
                        />
                        <Button
                          text="Continue with Facebook"
                          // onPress={handleSubmit}
                          width="full"
                          textSize="md"
                          variant="white"
                          icon={ <Image source={FacebookIcon} style={{ width: 20, height: 20 }} />
                          }
                        />                                  
                      </View>
                      <View>
                        <Form type="normal">
                            <Input label="" placeholder="Enter Phone/Email ID" autoCapitalize="none" />
                            <Input label="" placeholder="Enter Password" secureTextEntry autoCapitalize="none" autoCorrect={false} textContentType="password" autoComplete="password" />                                 
                            <Button text="Continue" onPress={handleSubmit} width="full" textSize="lg" />
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
                        <StepThree/>
                        <StepFour/>
                        <StepFive/>
                        <StepSix/>
                      </Form>
                    <View style={globalStyle.Dflex}>
                        <Button
                          text="Continue with Google"
                          // onPress={handleSubmit}
                          width="auto"
                          textSize="md"
                          variant="white"
                          icon={ <Image source={GoogleIcon} style={{ width: 20, height: 20,}} /> }
                        />
                        <Button
                          text="Continue with Facebook"
                          // onPress={handleSubmit}
                          width="auto"
                          textSize="md"
                          variant="white"
                          icon={ <Image source={FacebookIcon} style={{ width: 20, height: 20 }} />
                          }
                        />   
                    </View>
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
  socialConnection:{borderRightWidth: 1, paddingRight: 20, borderColor: "#AFEBEE",},
  varText:{textAlign: "center",}
});