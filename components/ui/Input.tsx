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
  variant?: "full" | "half" | "otp";
  timer?: number;
  onResend?: () => void;
};

export default function Input({
  label,
  error,
  variant = "full",
  timer,
  onResend,
  style,
  ...props
}: InputProps) {
  return (
    <View
      style={[
        styles.container,
        variant === "half"
          ? styles.halfContainer
          : variant === "otp"
          ? styles.otpContainer
          : styles.fullContainer,
      ]}
    >
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[
          styles.input,
          variant === "otp" && styles.otpInput,
          style,
        ]}
        placeholderTextColor="#999"
        {...props}
      />

        {variant === "otp" && (
          <View style={styles.timerRow}>
            {timer! > 0 ? (
              <Text style={styles.timer}>
                Resend OTP in 00:{String(timer).padStart(2, "0")}
              </Text>
            ) : (
              <Text style={styles.resend} onPress={onResend}>
                Resend OTP
              </Text>
            )}
          </View>
        )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18, },
  fullContainer: { flex: 1, width: "100%", height: 60,},
  halfContainer: { flex: 1, minWidth: 220, height: 60,},
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6, },
  input: { height: 58, borderWidth: 1, borderColor: "#D9D9D9", borderRadius: 50, paddingHorizontal: 16, backgroundColor: "#FFFFFF", fontSize: 16, color: "#222", }, 
  error: { marginTop: 5, color: "#E53935", fontSize: 12, },
  otpContainer: {
  alignItems: "center",
},

otpInput: {
width: "100%",
  height: 60,
  borderRadius: 16,
  textAlign: "center",
  fontSize: 28,
  fontWeight: "700",
  letterSpacing: 16, // Creates spacing between digits
},
timerRow: {
  marginTop: 10,
  alignItems: "center",
},

timer: {
  fontSize: 14,
  color: "#666",
},

resend: {
  fontSize: 14,
  color: "#3B82F6",
  fontWeight: "600",
},
});

