import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
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
  const transition =
    useRef<TransitionRef>(null);

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
  return useContext(TransitionContext)!;
};