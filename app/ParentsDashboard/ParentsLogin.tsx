import Button from "@/components/ButtonCompo/Button";
import Input from "@/components/ui/Input";
import CompoLoginBack from "@/components/ui/CompoLoginBack";
import Select from "@/components/ui/Select";
import Tab from "@/components/ui/Tab";
import { ROUTES } from "@/constants/routes";
import {
  loginUser,
  registerParent,
  validateSignupOtp,
  verifySignupEmail,
} from "@/services/authService";
import { Asset } from "expo-asset";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import Form, { useForm } from "../../components/ui/Form";
import { styles as globalStyle } from "../../constants/globalStyle";

const { width } = Dimensions.get("window");

function StepOne() {
  const { nextStep, formData, setFormData, errors } = useForm();
  const [requestError, setRequestError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const handleNext = async () => {
    const name = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextStep();
      return;
    }

    try {
      setRequestError("");
      setIsSendingOtp(true);
      await verifySignupEmail(email);
      setFormData((previous) => ({ ...previous, fullName: name, email }));
      nextStep();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Unable to send OTP.");
    } finally {
      setIsSendingOtp(false);
    }
  };

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

      {requestError ? <Text style={styles.formError}>{requestError}</Text> : null}
      <Button
        text={isSendingOtp ? "Sending OTP..." : "Next Step"}
        textSize="lg"
        onPress={handleNext}
        disabled={isSendingOtp}
      />
    </View>
  );
}

function StepTwo() {
  const { nextStep, formData, setFormData } = useForm();
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState("");
  const [requestError, setRequestError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleResend = async () => {
    try {
      setRequestError("");
      await verifySignupEmail(formData.email);
      setTimer(30);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Unable to resend OTP.");
    }
  };

  const handleContinue = async () => {
    if (otp.length !== 6) {
      setRequestError("Enter the 6-digit OTP.");
      return;
    }

    try {
      setRequestError("");
      setIsValidating(true);
      await validateSignupOtp(formData.email, otp);
      setFormData((previous) => ({ ...previous, otp }));
      nextStep();
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Invalid OTP.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <View>
      <Text style={globalStyle.smallText}>
        Verification code sent to <Text>{formData.email}</Text>
      </Text>
      <View style={globalStyle.Dflex}>
        <Input
          variant="otp"
          placeholder="123456"
          keyboardType="number-pad"
          maxLength={6}
          timer={timer}
          onResend={handleResend}
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
          error={requestError}
        />
      </View>

      <Button
        text={isValidating ? "Verifying..." : "Continue"}
        textSize="lg"
        onPress={handleContinue}
        disabled={isValidating}
      />
    </View>
  );
}

function StepThree() {
  const { nextStep, formData, setFormData, errors } = useForm();

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input
          placeholder="Phone"
          variant="half"
          keyboardType="phone-pad"
          value={formData.phone}
          error={errors.phone}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, phone: text }))
          }
        />
        <Input
          placeholder="Address"
          variant="half"
          value={formData.address}
          error={errors.address}
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
  const { nextStep, formData, setFormData, errors } = useForm();

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
          error={errors.city}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, city: value }))
          }
          variant="half"
        />
        <Input
          placeholder="State"
          variant="half"
          value={formData.state}
          error={errors.state}
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
  const { nextStep, formData, setFormData, errors } = useForm();

  return (
    <View>
      <View style={globalStyle.Dflex}>
        <Input
          placeholder="Zip"
          keyboardType="number-pad"
          variant="half"
          value={formData.zip}
          error={errors.zip}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, zip: text }))
          }
        />
        <Input
          placeholder="Country"
          variant="half"
          value={formData.country}
          error={errors.country}
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setRegistrationMessage("");
      setIsRegistrationSuccess(false);
      const referralCode = formData.referralCode.trim();
      const response = await registerParent({
        name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        pincode: formData.zip.trim(),
        country: formData.country.trim(),
        flag: referralCode ? 2 : 4,
        ...(referralCode ? { referralCode } : {}),
      });
      setIsRegistrationSuccess(true);
      setRegistrationMessage(response.message || "Your account has been created.");
      router.replace(ROUTES.AUTH.LOGIN);
    } catch (error) {
      setIsRegistrationSuccess(false);
      setRegistrationMessage(
        error instanceof Error
          ? error.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
          error={isRegistrationSuccess ? "" : registrationMessage}
        />
        {isRegistrationSuccess && registrationMessage ? (
          <Text style={styles.formSuccess}>{registrationMessage}</Text>
        ) : null}
        <Button
          text={isSubmitting ? "Submitting..." : "Submit"}
          textSize="lg"
          width="full"
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </View>
  );
}

export default function Index() {
  const [activeTab, setActiveTab] = useState("signin");
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInErrors, setSignInErrors] = useState({
    email: "",
    password: "",
    loginError: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Rainbow = require("../../assets/images/Rainbow.png");
  const Cloude = require("../../assets/images/Cloude.png");
  const LoadingDimo = require("../../assets/images/Diano_Run.gif");
  const GoogleIcon = require("../../assets/images/GoogleIcon.png");
  const FacebookIcon = require("../../assets/images/FacebookIcon.png");

  const handleSubmit = async () => {
    const email = signInEmail.trim();
    const errors = {
      email: !email
        ? "Email is required."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Enter a valid email address."
          : "",
      password: !signInPassword
        ? "Password is required."
        : signInPassword.length < 6
          ? "Password must be at least 6 characters."
          : "",

      // loginError: "Login failed. Please check your credentials.",
      loginError: "",
    };

    setSignInErrors(errors);

    if (errors.email || errors.password) {
      return;
    }

    try {
      setIsSubmitting(true);
      await loginUser(email, signInPassword);
      // router.replace("/MainScreens/home");
      router.replace(ROUTES.APP.HOME);
    } catch (error) {
      // Alert.alert(
      //   "Login failed",
      //   error instanceof Error ? error.message : "Unable to log in",
      // );
      setSignInErrors((prev) => ({
        ...prev,
        loginError:
          error instanceof Error
            ? error.message
            : "Login failed. Please check your credentials.",
      }));

    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function loadAssets() {
      await Asset.loadAsync([
        Rainbow,
        Cloude,
        LoadingDimo,
        GoogleIcon,
        FacebookIcon,
      ]);
    }
    loadAssets();
  }, []);

  return (
    <>
    <CompoLoginBack>
        <View style={globalStyle.FormWrap}>
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
                  <Text style={globalStyle.signinText}>
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
                          autoCapitalize="none"
                          value={signInEmail}
                          keyboardType="email-address"
                          autoComplete="email"
                          textContentType="username"
                          error={signInErrors.email}
                          onChangeText={(text) => {
                            setSignInEmail(text);
                            if (signInErrors.email) {
                              setSignInErrors((current) => ({
                                ...current,
                                email: "",
                              }));
                            }
                          }}
                        />
                        <Input
                          label=""
                          placeholder="Enter Password"
                          secureTextEntry
                          autoCapitalize="none"
                          autoCorrect={false}
                          textContentType="password"
                          autoComplete="password"
                          value={signInPassword}
                          error={signInErrors.password || signInErrors.loginError}
                          onChangeText={(text) => {
                            setSignInPassword(text);
                            if (signInErrors.password) {
                              setSignInErrors((current) => ({
                                ...current,
                                password: "",
                              }));
                            }
                          }}
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
                  <Text style={globalStyle.signinText}>Create Your Account</Text>
                  <View style={styles.ContentBox}>
                    <Form type="step">
                      <StepOne />
                      <StepTwo />
                      <StepThree />
                      <StepFour />
                      <StepFive />
                      <StepSix />
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
    </CompoLoginBack>
    </>
  );
}

const styles = StyleSheet.create({
  formError: { color: "#E53935", fontSize: 12, marginBottom: 10 },
  formSuccess: { color: "#2E7D32", fontSize: 12, marginBottom: 10 },
  formStyles: { marginTop: 20 },
  ContentBox: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20, },
  socialConnection: { borderRightWidth: 1, paddingRight: 20, borderColor: "#AFEBEE", },
  varText: { textAlign: "center" },
});
