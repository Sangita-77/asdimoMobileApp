import CompoLoginBack from "@/components/ui/CompoLoginBack";
import { View, Text } from "react-native";
import Form from "../../components/ui/Form";
import Input from "@/components/ui/Input";
import { styles as globalStyle } from "@/constants/globalStyle";
import Button from "@/components/ButtonCompo/Button";
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, SimpleLineIcons, Feather } from "@expo/vector-icons";


export default function PersonalizeLearningPlan() {
  return (
    <CompoLoginBack>
        <View style={globalStyle.FormWrap}>
        <Text style={globalStyle.signinText}>
          Let's create your personalized learning plan
        </Text>
        </View>
    </CompoLoginBack>
  );
}
