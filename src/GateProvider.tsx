import React, { createContext, useContext } from "react";
import { Ability, Satifies } from "./types";

export type GateContext = {
  abilities: Ability[];
  satisfies?: Satifies;
};

const GateContext = createContext<GateContext | null>(null);

export const useGateContext = () => {
  const context = useContext(GateContext);

  if (!context) {
    throw new Error("useGateContext must be used within an GateProvider.");
  }

  return context;
};

export type GateProviderProps = GateContext & {
  children?: React.ReactNode;
};

export const GateProvider = ({
  abilities,
  satisfies,
  children,
}: GateProviderProps) => {
  return (
    <GateContext.Provider value={{ abilities, satisfies }}>
      {children}
    </GateContext.Provider>
  );
};
