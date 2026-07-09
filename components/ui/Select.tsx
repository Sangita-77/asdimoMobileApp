import React from "react";
import { StyleSheet } from "react-native";
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
};

export default function Select({
  data,
  value,
  onChange,
  placeholder = "Select",
  variant = "full",
}: SelectProps) {
  return (
    <Dropdown
      style={[
        styles.dropdown,
        variant === "half" ? styles.half : styles.full,
      ]}
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
    marginBottom: 18,
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