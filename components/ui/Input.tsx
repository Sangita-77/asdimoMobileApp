import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View, } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Option = {
  label: string;
  value: string;
};

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  variant?: "full" | "half" | "third" | "otp";
  icon?: any;
  type?: "text" | "select";
  options?: Option[];
  selectedValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  timer?: number;
  onResend?: () => void;
};

export default function Input({
  label,
  error,
  icon,
  placeholder,
  variant = "full",
  type = "text",
  options = [],
  selectedValue,
  onValueChange,
  timer = 0,
  onResend,
  style,
  editable = true,
  ...props
}: InputProps) {
  return (
    <View
      style={[
        styles.container,
        variant === "half"
          ? styles.halfContainer
          : variant === "third"
          ? styles.thirdContainer
          : variant === "otp"
          ? styles.otpContainer
          : styles.fullContainer,
      ]}
    >
      {label && <Text style={styles.label}>{label}</Text>}

      {type === "select" ? (
        <View
          style={[
            styles.selectContainer,
            error && styles.inputError,
            !editable && styles.disabledInput,
          ]}
        >
          {icon && <View style={styles.iconContainer}>{icon}</View>}

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.selectedText}
            iconStyle={styles.icon}
            containerStyle={styles.dropdownContainer}
            itemContainerStyle={styles.itemContainer}
            itemTextStyle={styles.itemText}
            activeColor="#EEF6FF"
            data={options}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={selectedValue}
            maxHeight={280}
            showsVerticalScrollIndicator={false}
            onChange={(item) => onValueChange?.(item.value)}
          />
        </View>
      ) : (
      <View
        style={[
          styles.inputWrapper,
          error && styles.inputError,
          !editable && styles.disabledInput,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          {...props}
          placeholder={placeholder}
          editable={editable}
          placeholderTextColor="#999"
          style={[
            styles.input,
            variant === "otp" && styles.otpInput,
            style,
          ]}
        />
      </View>
      )}

      {variant === "otp" && (
        <View style={styles.timerRow}>
          {timer > 0 ? (
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

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 18, },
  fullContainer: { width: "100%", },
  halfContainer: { width: "50%", },
  thirdContainer:{ width: "33.33%", },
  otpContainer: { alignItems: "center", width: "100%", }, 
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
    backgroundColor: "#FFF",
    marginHorizontal: 8,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#222",
    paddingVertical: 0,
    backgroundColor: "transparent",
  },
  inputError: { borderColor: "#E53935", },
  disabledInput: { backgroundColor: "#F5F5F5", color: "#999", },
  error: {
    marginTop: 6,
    marginLeft: 16,
    color: "#E53935",
    fontSize: 12,
  },

  otpInput: {
    height: 60,
    borderRadius: 16,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 16,
  },
  timerRow: { marginTop: 10, alignItems: "center", }, 
  timer: { fontSize: 14, color: "#666", },
  resend: { fontSize: 14, color: "#3B82F6", fontWeight: "600", },
  selectContainer: {
  flexDirection: "row",
  alignItems: "center",
  height: 55,
  backgroundColor: "#FFFFFF",
  borderWidth: 1,
  borderColor: "#E5E7EB",
  borderRadius: 50,
  paddingHorizontal: 14,
  marginHorizontal: 8,
  // iOS Shadow
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.05,
  shadowRadius: 6,
  // Android Shadow
  elevation: 2,
},

iconContainer: {
  width: 40,
  height: 40,
  justifyContent: "center",
},
  dropdown: {
    height: 55,
    width: "80%",
    borderWidth: 0,
    borderRadius: 50,
    backgroundColor: "#FFF",
    paddingHorizontal: 0,
  },

  placeholder: {
    color: "#9CA3AF",
    fontSize: 16,
  },

  selectedText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "500",
  },

  icon: {
    width: 20,
    height: 20,
  },

  dropdownContainer: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 0,
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },

  itemContainer: {
    borderRadius: 10,
    marginHorizontal: 0,
    marginVertical: 2,
  },

  itemText: {
    fontSize: 16,
    color: "#111827",
    backgroundColor: "",
    padding: 0,
    paddingVertical: 6,
  },
}); 