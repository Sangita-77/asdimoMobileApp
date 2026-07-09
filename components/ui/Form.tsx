import React, { createContext, useContext, useState, ReactNode, Children, } from "react";
import { View, StyleSheet } from "react-native";

export type FormType = "normal" | "step";

export type FormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  referralCode: string;
};

type FormContextType = {
  currentStep: number;
  nextStep: () => void;
  prevStep: () => void;
  errors: Partial<Record<keyof FormData, string>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

type RowProps = {
  children: ReactNode;
};

export function Row({ children }: RowProps) {
  return <View style={styles.row}>{children}</View>;
}

const FormContext = createContext<FormContextType | null>(null);

export const useForm = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error("useForm must be used inside Form");
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

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    referralCode: "",
  });

  if (type === "normal") {
    return <View>{children}</View>;
  }

  const steps = Children.toArray(children);

    const nextStep = () => {
      const newErrors: Partial<Record<keyof FormData, string>> = {};

      if (currentStep === 0) {
        if (!formData.fullName.trim()) {
          newErrors.fullName = "Full name is required";
        }

        if (!formData.email.trim()) {
          newErrors.email = "Email is required";
        } else if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
          newErrors.email = "Enter a valid email";
        }
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) return;

      setCurrentStep((prev) =>
        prev < steps.length - 1 ? prev + 1 : prev
      );
    };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const [errors, setErrors] = useState<
  Partial<Record<keyof FormData, string>>
>({});

  return (
    <FormContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
        formData,
        setFormData,
        errors,
      }}
    >
      <View>{steps[currentStep]}</View>
    </FormContext.Provider>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, marginBottom: 16, },
});