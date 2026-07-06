import React, { ReactNode, useState } from "react";
import { View } from "react-native";

type FormType = "normal" | "step";

type FormProps = {
  type?: FormType;
  children: ReactNode[];
  initialStep?: number;
};

export default function Form({
  type = "normal",
  children,
  initialStep = 0,
}: FormProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);

  if (type === "normal") {
    return <View>{children}</View>;
  }

  return <View>{children[currentStep]}</View>;
}

export { FormType }; 