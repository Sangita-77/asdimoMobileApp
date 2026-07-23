import CompoLoginBack from "@/components/ui/CompoLoginBack";
import { View, Text, StyleSheet } from "react-native";
import Form from "../../components/ui/Form";
import Input from "@/components/ui/Input";
import { styles as globalStyle } from "@/constants/globalStyle";
import Button from "@/components/ButtonCompo/Button";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";
import { addChildInformation, getLoggedInUserId } from "@/services/authService";
import React, { useState } from "react";


export default function Login() {
  const [childName, setChildName] = useState("");
  const [dob, setDob] = useState("");
  const [childGender, setChildGender] = useState("");
  const [grade, setGrade] = useState("");
  const [familyType, setFamilyType] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const clearForm = () => {
    setChildName("");
    setDob("");
    setChildGender("");
    setGrade("");
    setFamilyType("");
    setLanguage("");
  };

  const handleDobChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    const formattedDob =
      digits.length > 4
        ? `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`
        : digits.length > 2
          ? `${digits.slice(0, 2)}/${digits.slice(2)}${digits.length === 4 ? "/" : ""}`
          : digits.length === 2
            ? `${digits}/`
            : digits;

    setDob(formattedDob);
    if (isError) {
      setMessage("");
      setIsError(false);
    }
  };

  const handleSubmit = async () => {
    const dobMatch = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dob);
    const birthDate = dobMatch
      ? new Date(Number(dobMatch[3]), Number(dobMatch[2]) - 1, Number(dobMatch[1]))
      : null;
    const isValidDob = birthDate &&
      birthDate.getFullYear() === Number(dobMatch![3]) &&
      birthDate.getMonth() === Number(dobMatch![2]) - 1 &&
      birthDate.getDate() === Number(dobMatch![1]) &&
      birthDate <= new Date();

    if (!childName.trim() || !birthDate || !isValidDob || !childGender || !grade || !familyType || !language) {
      setIsError(true);
      setMessage("Please complete all fields with a valid date of birth (dd/mm/yyyy).");
      return;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const birthdayHasOccurred =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    if (!birthdayHasOccurred) age -= 1;

    const parentId = await getLoggedInUserId();
    if (!parentId) {
      setIsError(true);
      setMessage("Unable to identify your account. Please sign in again.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      const response = await addChildInformation({
        parentId,
        childName: childName.trim(),
        childAge: age,
        dob,
        childGender,
        grade,
        familyType,
        language,
      });
      setIsError(false);
      setMessage(response.message || "Child information added successfully.");
      clearForm();
    } catch (submitError) {
      setIsError(true);
      setMessage(submitError instanceof Error ? submitError.message : "Unable to add child information. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CompoLoginBack>
        <View style={globalStyle.FormWrap}>
        <Text style={globalStyle.signinText}>
          Child Basic Information
        </Text>
        <Form type="normal">
              <Input
                variant="full"
                placeholder="Child Name"
                value={childName}
                onChangeText={setChildName}
                autoCapitalize="none"
                autoComplete="name"
                textContentType="name"
                icon={<MaterialIcons name="child-care" size={35} color="#8E8A9A"/>}
              />
            <View style={globalStyle.Dflex}>  
              <Input
                type="select"
                variant="third"
                placeholder="Gender"
                selectedValue={childGender}
                onValueChange={setChildGender}
                icon={<FontAwesome name="transgender" size={30} color="#8E8A9A" />}
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                  { label: "Others", value: "others" },
                ]}
              />
              <Input
                variant="third"
                placeholder="DOB (dd/mm/yyyy)"
                value={dob}
                onChangeText={handleDobChange}
                autoCapitalize="none"
                keyboardType="numbers-and-punctuation"
                maxLength={10}
                icon={<MaterialCommunityIcons name="calendar-month-outline" size={30} color="#8E8A9A" />}
              />
              <Input
                type="select"
                variant="third"
                placeholder="Grade"
                selectedValue={grade}
                onValueChange={setGrade}
                icon={<SimpleLineIcons name="book-open" size={25} color="#8E8A9A" />}
                options={[
                  { label: "First", value: "first" },
                  { label: "Second", value: "second" },
                ]}
              />
            </View>
            <View style={globalStyle.Dflex}>
              <Input
                type="select"
                variant="half"
                placeholder="Family Type"
                selectedValue={familyType}
                onValueChange={setFamilyType}
                icon={<MaterialCommunityIcons name="human-male-female-child" size={25} color="#8E8A9A" />}
                options={[
                  { label: "Nuclear", value: "nuclear" },
                  { label: "Joint", value: "joint" },
                ]}
              />
              <Input
                type="select"
                variant="half"
                placeholder="Language"
                selectedValue={language}
                onValueChange={setLanguage}
                icon={<MaterialIcons name="language" size={25} color="#8E8A9A" />}
                options={[
                  { label: "English", value: "english" },
                  { label: "Bengali", value: "bengali" },
                  { label: "Hindi", value: "hindi" },
                ]}
              />              
            </View> 
            {message ? (
              <Text style={[styles.message, isError ? styles.errorMessage : styles.successMessage]}>
                {message}
              </Text>
            ) : null}
            <View style={globalStyle.Dflex}>
            <Button
              text={isSubmitting ? "Submitting..." : "Submit"}
              onPress={handleSubmit}
              disabled={isSubmitting}
              width="full"
              textSize="lg"
            />
            {/* <Button
              text="Add Another Child"
              onPress={() => {
                clearForm();
                setMessage("");
              }}
              width="half"
              variant="transparent"
              icon={<Feather name="plus-circle" size={28} color="#763DFF" />}
              textSize="lg"
            /> */}
            </View>
          </Form>
        </View>
    </CompoLoginBack>
  );
}

const styles = StyleSheet.create({
  message: { textAlign: "center", fontSize: 15, marginBottom: 12 },
  errorMessage: { color: "#DC2626" },
  successMessage: { color: "#16A34A" },
});
