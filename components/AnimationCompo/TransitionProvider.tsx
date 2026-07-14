import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";

import { usePathname } from "expo-router";

import CircularTransition, {
  TransitionRef,
} from "./CircularTransition";


const TransitionContext = createContext<
  React.MutableRefObject<TransitionRef | null> | null
>(null);

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const transition = useRef<TransitionRef | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    transition.current?.reveal();
  }, [pathname]);

  return (
    <TransitionContext.Provider value={transition}>
      {children}
      <CircularTransition ref={transition} />
    </TransitionContext.Provider>
  );
}

export const useTransition = () => {
  const context = useContext(TransitionContext);

  if (!context) {
    throw new Error(
      "useTransition must be used inside TransitionProvider"
    );
  }

  return context;
};