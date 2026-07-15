import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  data: Option[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  variant?: "full" | "half";
  error?: string;
};

export default function Select({
  data,
  value,
  onChange,
  placeholder = "Select",
  variant = "full",
  error,
}: SelectProps) {
  return (
    <View style={[variant === "half" ? styles.half : styles.full, styles.container]}>
      <Dropdown
        style={[styles.dropdown, error ? styles.dropdownError : undefined]}
        placeholderStyle={styles.placeholder}
        selectedTextStyle={styles.selectedText}
        inputSearchStyle={styles.search}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => onChange(item.value)}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  full: {
    width: "100%",
  },

  half: {
    flex: 1,
    minWidth: 220,
  },

  dropdown: {
    height: 58,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 50,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    marginBottom: 0,
  },

  container: {
    marginBottom: 18,
  },

  dropdownError: {
    borderColor: "#E53935",
  },

  error: {
    marginTop: 6,
    marginLeft: 16,
    color: "#E53935",
    fontSize: 12,
  },

  placeholder: {
    color: "#999",
    fontSize: 16,
  },

  selectedText: {
    fontSize: 16,
    color: "#222",
  },

  search: {
    borderRadius: 12,
  },
});
