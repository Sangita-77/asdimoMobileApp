import CompoLoginBack from "@/components/ui/CompoLoginBack";
import { View, Text } from "react-native";
import Form from "../../components/ui/Form";
import Input from "@/components/ui/Input";
import { styles as globalStyle } from "@/constants/globalStyle";
import Button from "@/components/ButtonCompo/Button";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";


export default function Login() {
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
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="username"
                icon={<MaterialIcons name="child-care" size={35} color="#8E8A9A"/>}
              />
            <View style={globalStyle.Dflex}>  
              <Input
                type="select"
                variant="third"
                placeholder="Gender"
                // selectedValue={gender}
                // onValueChange={setGender}
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
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
                textContentType="username"
                icon={<MaterialCommunityIcons name="calendar-month-outline" size={30} color="#8E8A9A" />}
              />
              <Input
                type="select"
                variant="third"
                placeholder="Grade"
                // selectedValue={grade}
                // onValueChange={setGrade}
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
                // selectedValue={familytype}
                // onValueChange={setFamilyType}
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
                // selectedValue={language}
                // onValueChange={setLanguage}
                icon={<MaterialIcons name="language" size={25} color="#8E8A9A" />}
                options={[
                  { label: "English", value: "first" },
                  { label: "Bengali", value: "bengali" },
                  { label: "Hindi", value: "hindi" },
                ]}
              />              
            </View> 
            <View style={globalStyle.Dflex}>
            <Button
              text="Submit"
              // onPress={handleSubmit}
              width="half"
              textSize="lg"
            />
            <Button
              text="Add Another Child"
              // onPress={handleSubmit}
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
