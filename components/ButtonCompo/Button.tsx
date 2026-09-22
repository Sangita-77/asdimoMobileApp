import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

export type ButtonVariant =
  | "transparent"
  | "white"
  | "solid"
  | "border"
  | "green"
  | "blue"
  | "Sky"
  | "Red";


type ButtonProps = {
  text: string;
  onPress?: () => void;
  textSize?: "xs" | "sm" | "md" | "lg";
  variant?: "transparent" | "white" | "solid" | "border" | "blue"  | "green" | "Sky" | "Red" | "Neon";
  // textSize?: "sm" | "md" | "lg";
  // variant?: "transparent" | "white" | "solid" | "border" | "blue"  | "green";
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconPosition?: "left" | "right";
  width?: "full" | "half" | "auto";
}; 

export default function Button({
  text,
  onPress,
  textSize = "sm",
  variant = "solid",
  icon,
  disabled = false,
  style,
  textStyle,
  iconPosition = "left",
  width = "auto",
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        variant === "solid" && styles.solidButton,
        variant === "white" && styles.whiteButton,
        variant === "transparent" && styles.transparentButton,
        variant === "border" && styles.transparentButton,
        variant === "blue" && styles.blueButton,
        variant === "green" && styles.greenButton,
        variant === "Sky" && styles.SkyButton,
        variant === "Red" && styles.RedButton,
        variant === "Neon" && styles.NeonButton,


        width === "full" && styles.fullWidth,
        width === "half" && styles.halfWidth,

        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}> 
        {icon && iconPosition === "left" && (
          <View style={styles.icon}>{icon}</View>
        )}

        <Text
          style={[
            styles.text,
            variant === "solid" && styles.solidText,
            variant === "white" && styles.whiteText,
            variant === "transparent" && styles.transparentText,
            variant === "blue" && styles.solidText,
            variant === "green" && styles.solidText,
            variant === "Sky" && styles.BlueText,
            variant === "Red" && styles.RedText,
            variant === "Neon" && styles.NeonText,



            textSize === "xs" && styles.xs,
            textSize === "sm" && styles.sm,
            textSize === "md" && styles.md,
            textSize === "lg" && styles.lg,

            textStyle,
          ]}
        >
          {text}
        </Text>

        {icon && iconPosition === "right" && (
          <View style={styles.icon}>{icon}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 50, justifyContent: "center", alignItems: "center", paddingHorizontal: 18,  paddingVertical: 10,},
  solid: { backgroundColor: "#763DFF",  color: "#FFF",},
  blueButton:{backgroundColor: "#007CDD",  color: "#FFF" },
  SkyButton:{backgroundColor: "#DBEAFE",  color: "#FFF", paddingHorizontal: 10,  paddingVertical: 5,},
  white: { backgroundColor: "#fff", color: "#000", },
  transparent: { backgroundColor: "transparent", borderWidth: 0, borderColor: "#4F46E5", },
  solidButton: { backgroundColor: "#763DFF", },
  greenButton: { backgroundColor: "#16A34A", },
  NeonButton: { backgroundColor: "#DBF5DB", },
  RedButton:  {backgroundColor: "#fdc5d8", paddingHorizontal: 10,  paddingVertical: 5,},
  whiteButton: { backgroundColor: "#FFF", },
  transparentButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: "#763DFF", }, 
  solidText: { color: "#FFF", },
  BlackText: { color: "#000", },
  NeonText: {color: "#16A34A",},
  RedText: {color: "#a31635",},
  BlueText: {color: "#007CDD",},
whiteText: {
  color: "#111827",
},

transparentText: {
  color: "#763DFF",
},

fullWidth: {
  width: "100%",
},

halfWidth: {
  width: "49%",
},

content: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
},

icon: {
  marginHorizontal: 6,
},

text: {
  fontWeight: "600",
},

xs: {
  fontSize: 12,
},

sm: {
  fontSize: 14,
},

md: {
  fontSize: 16,
},

lg: {
  fontSize: 22,
},

disabled: {
  opacity: 0.5,
},
});