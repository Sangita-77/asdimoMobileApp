import React, { createContext, useContext, useState, ReactNode, Children, } from "react";
import { View, StyleSheet } from "react-native";

export type FormType = "normal" | "step";

type FormContextType = {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
};

type RowProps = {
  children: ReactNode;
};

function Row({ children }: RowProps) {
  return <View style={styles.row}>{children}</View>;
}

Form.Row = Row;

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useForm must be used inside a Form with type='step'");
  }

  return context;
};

type FormProps = {
  type?: FormType;
  children: ReactNode;
  initialStep?: number;
};

export default function Form({
  type = "normal",
  children,
  initialStep = 0,
}: FormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Normal Form
  if (type === "normal") {
    return <View>{children}</View>;
  }

  // Step Form
  const steps = Children.toArray(children);

  const nextStep = () => {
    setCurrentStep((prev) =>
      prev < steps.length - 1 ? prev + 1 : prev
    );
  };

  const prevStep = () => {
    setCurrentStep((prev) =>
      prev > 0 ? prev - 1 : prev
    );
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
      }}
    >
      <View>{steps[currentStep]}</View>
    </FormContext.Provider>
  );
}

const styles = StyleSheet.create({
  row:{ flexDirection: "row", gap: 12, marginBottom: 16, },
});