import Button from "@/components/ButtonCompo/Button";
import Input from "@/components/ui/Input";
import LandscapeLock from "@/components/ui/LandscapeLock";
import Select from "@/components/ui/Select";
import Tab from "@/components/ui/Tab";
import { loginUser } from "@/services/authService";
import { Asset } from "expo-asset";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ROUTES } from "@/constants/routes";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import CloudFloat from "../../components/AnimationCompo/CloudFloat";
import BackButton from "../../components/ButtonCompo/BackButton";
import Form, { useForm } from "../../components/ui/Form";
import { styles as globalStyle } from "../../constants/globalStyle";

function StepOne() {
  const { nextStep } = useForm();

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input placeholder="First Name" variant="half" />
        <Input placeholder="Last Name" variant="half" />
      </View>
      <Button text="Next Step" textSize="lg" onPress={nextStep} />
    </View>
  );
}

function StepTwo() {
  const { nextStep } = useForm();
  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input placeholder="City" variant="half" />
        <Input placeholder="Address" variant="half" />
      </View>
      <Button text="Next Step" textSize="lg" onPress={nextStep} />
    </View>
  );
}

function StepThree() {
  const { nextStep } = useForm();

  const cities = [
    { label: "Kolkata", value: "Kolkata" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Delhi", value: "Delhi" },
    { label: "Bengaluru", value: "Bengaluru" },
    { label: "Chennai", value: "Chennai" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Pune", value: "Pune" },
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Jaipur", value: "Jaipur" },
    { label: "Lucknow", value: "Lucknow" },
  ];

  const [phoneCode, setPhoneCode] = useState("");

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Select
          placeholder="City"
          data={cities}
          value={phoneCode}
          onChange={setPhoneCode}
          variant="half"
        />
        <Input placeholder="State" keyboardType="phone-pad" variant="half" />
      </View>
      <Button text="Next Step" onPress={nextStep} textSize="lg" />
    </View>
  );
}

function StepFour() {
  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input placeholder="Zip" variant="half" />
        <Input placeholder="Country" variant="half" />
      </View>
      <Button text="Submit" textSize="lg" />
    </View>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const TreeLogin = require("../../assets/images/TreeLogin.png");
  const dimoAnimation = require("../../assets/images/dimoAnimation.mp4");
  const LoadingDimo = require("../../assets/images/LoadingDimo.png");
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
          <CloudFloat
            source={Cloude}
            top={height * 0.02}
            size={width * 0.07}
            left={-width * 0.5}
            duration={40000}
            loop
          />
          <CloudFloat
            source={Cloude}
            top={height * 0.02}
            size={width * 0.15}
            left={-width * 0.5}
            duration={40000}
            loop
          />
          <CloudFloat
            source={Cloude}
            top={height * 0.02}
            size={width * 0.15}
            left={-width * 0.5}
            duration={40000}
            loop
          />

          {/* Medium cloudes */}
          <CloudFloat
            source={Cloude}
            top={height * 0.2}
            size={width * 0.2}
            left={width * 0.6}
            duration={13000}
            loop={false}
          />
          <CloudFloat
            source={Cloude}
            top={height * 0.1}
            size={width * 0.2}
            left={-width * 0.6}
            duration={35000}
            loop
          />
          <CloudFloat
            source={Cloude}
            top={height * 0.22}
            size={width * 0.2}
            left={width * 0.02}
            duration={25000}
            loop={false}
          />
          <CloudFloat
            source={Cloude}
            top={height * 0.22}
            size={width * 0.3}
            left={-width * 0.7}
            duration={60000}
          />

          {/* Large cloudes */}
          <CloudFloat
            source={Cloude}
            top={height * 0.15}
            size={width * 0.25}
            left={-width * 0.68}
            duration={40000}
            loop
          />
        </View>
        <View style={styles.FormWrap}>
          <View>
            <Tab
              tabs={[
                { id: "signin", label: "Sign In" },
                { id: "signup", label: "Sign Up" },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
            <View>
              {activeTab === "signin" && (
                <>
                  <Text style={styles.signinText}>
                    Sign in to Your Account{" "}
                  </Text>
                  <View style={styles.ContentBox}>
                    <View style={styles.socialConnection}>
                      <Button
                        style={{ marginBottom: 20 }}
                        text="Continue with Google"
                        // onPress={handleSubmit}
                        width="full"
                        textSize="md"
                        variant="white"
                        icon={
                          <Image
                            source={GoogleIcon}
                            style={{ width: 20, height: 20 }}
                          />
                        }
                      />
                      <Button
                        text="Continue with Facebook"
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
                        <Input
                          label=""
                          placeholder="Enter Phone/Email ID"
                          keyboardType="email-address"
                          autoCapitalize="none"
                          value={email}
                          onChangeText={setEmail}
                        />
                        <Input
                          label=""
                          placeholder="Enter Password"
                          secureTextEntry
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="password"
                          autoComplete="password"
                          value={password}
                          onChangeText={setPassword}
                        />
                        <Button
                          text={isSubmitting ? "Please wait..." : "Continue"}
                          onPress={handleSubmit}
                          width="full"
                          textSize="lg"
                          disabled={isSubmitting}
                        />
                      </Form>
                    </View>
                  </View>
                </>
              )}
              {activeTab === "signup" && (
                <>
                  <Text style={styles.signinText}>Create Your Account</Text>
                  <View style={styles.ContentBox}>
                    <Form type="step">
                      <StepOne />
                      <StepTwo />
                      <StepThree />
                      <StepFour />
                    </Form>
                    <View style={globalStyle.Dflex}>
                      <Button
                        text="Continue with Google"
                        // onPress={handleSubmit}
                        width="auto"
                        textSize="md"
                        variant="white"
                        icon={
                          <Image
                            source={GoogleIcon}
                            style={{ width: 20, height: 20 }}
                          />
                        }
                      />
                      <Button
                        text="Continue with Facebook"
                        // onPress={handleSubmit}
                        width="auto"
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
                  </View>
                </>
              )}
            </View>
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
