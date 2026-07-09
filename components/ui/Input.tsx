import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  variant?: "full" | "half";
};

export default function Input({
  label,
  error,
  variant = "full",
  style,
  ...props
}: InputProps) {
  return (
    <View
      style={[
        styles.container,
        variant === "half" ? styles.halfContainer : styles.fullContainer,
      ]}
    >
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#999"
        {...props}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },

  fullContainer: {
    width: "100%",
  },

  halfContainer: {
    flex: 1,
    minWidth: 220,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },

  input: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#222",
  },

  error: {
    marginTop: 5,
    color: "#E53935",
    fontSize: 12,
  },
});

