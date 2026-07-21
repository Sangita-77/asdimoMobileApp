import CompoLoginBack from "@/components/ui/CompoLoginBack";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import Form from "../../components/ui/Form";
import Input from "@/components/ui/Input";
import { styles as globalStyle } from "@/constants/globalStyle";
import Button from "@/components/ButtonCompo/Button";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";
import { addChildInformation, getLoggedInUserId } from "@/services/authService";
import React, { useState } from "react";

const { width } = Dimensions.get("window");

export default function Login() {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState("");
  const [grade, setGrade] = useState("");
  const [familyType, setFamilyType] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const clearForm = () => {
    setChildName("");
    setChildAge("");
    setChildGender("");
    setGrade("");
    setFamilyType("");
    setLanguage("");
  };

  const handleSubmit = async () => {
    const age = Number(childAge);
    if (!childName.trim() || !childAge.trim() || !Number.isInteger(age) || age < 0 || !childGender || !grade || !familyType || !language) {
      setIsError(true);
      setMessage("Please complete all fields with a valid age.");
      return;
    }

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
        <View style={styles.FormWrap}>
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
                placeholder="Age"
                value={childAge}
                onChangeText={setChildAge}
                autoCapitalize="none"
                keyboardType="number-pad"
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
              width="half"
              textSize="lg"
            />
            <Button
              text="Add Another Child"
              onPress={() => {
                clearForm();
                setMessage("");
              }}
              width="half"
              variant="transparent"
              icon={<Feather name="plus-circle" size={28} color="#763DFF" />}
              textSize="lg"
            />
            </View>
          </Form>
        </View>
    </CompoLoginBack>
  );
}


const styles = StyleSheet.create({
  FormWrap: { zIndex: 100, justifyContent: "center", flex: 1, marginLeft: width * 0.25, marginRight: width * 0.05, },
  message: { textAlign: "center", fontSize: 15, marginBottom: 12 },
  errorMessage: { color: "#DC2626" },
  successMessage: { color: "#16A34A" },
});
