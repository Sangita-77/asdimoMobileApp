import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle,
  TextStyle,
} from "react-native";

type ButtonProps = {
  text: string;
  onPress?: () => void;
  textSize?: "sm" | "md" | "lg";
  variant?: "transparent" | "white" | "solid" | "border";
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
  solid: { backgroundColor: "#763DFF",  color: "#FFF",},
  white: { backgroundColor: "#fff", color: "#000", },
  transparent: { backgroundColor: "transparent", borderWidth: 0, borderColor: "#4F46E5", },
  button: {
  height: 55,
  borderRadius: 50,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
},

solidButton: {
  backgroundColor: "#763DFF",
},

whiteButton: {
  backgroundColor: "#FFF",
},

transparentButton: {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: "#763DFF",
},

solidText: {
  color: "#FFF",
},

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