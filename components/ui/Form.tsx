import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  Children,
} from "react";
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
  nextStep: () => boolean;
  prevStep: () => void;

  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;

  errors: Partial<Record<keyof FormData, string>>;
  validateField: (field: keyof FormData) => boolean;
};

type RowProps = {
  children: ReactNode;
};

function Row({ children }: RowProps) {
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

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormData, string>>
  >({});

  if (type === "normal") {
    return <View>{children}</View>;
  }

  const steps = Children.toArray(children);
  const validateField = (field: keyof FormData) => {
    let error = "";

    const value = formData[field].trim();

    // Required
    if (!value) {
      error = "This field is required.";
    }

    // Email
    if (field === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        error = "Enter a valid email.";
      }
    }

    // Phone
    if (field === "phone" && value) {
      const phoneRegex = /^[0-9]{10}$/;

      if (!phoneRegex.test(value)) {
        error = "Phone must be 10 digits.";
      }
    }

    // ZIP
    if (field === "zip" && value) {
      const zipRegex = /^[0-9]{4,10}$/;

      if (!zipRegex.test(value)) {
        error = "Invalid ZIP code.";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === "";
  };

  const validateCurrentStep = () => {
    let fields: (keyof FormData)[] = [];

    switch (currentStep) {
      case 0:
        fields = ["fullName", "email"];
        break;

      case 1:
        fields = ["phone", "address"];
        break;

      case 2:
        fields = ["city", "state", "zip", "country"];
        break;

      case 3:
        fields = ["referralCode"];
        break;

      default:
        fields = [];
    }

    return fields.every(validateField);
  };

  const nextStep = () => {
    const valid = validateCurrentStep();

    if (!valid) return false;

    setCurrentStep((prev) =>
      prev < steps.length - 1 ? prev + 1 : prev
    );

    return true;
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <FormContext.Provider
      value={{
        currentStep,
        nextStep,
        prevStep,
        formData,
        setFormData,
        errors,
        validateField,
      }}
    >
      <View>{steps[currentStep]}</View>
    </FormContext.Provider>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
});
