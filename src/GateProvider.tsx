import React, { createContext, useContext } from "react";
import { RequiredAbility, Ability } from "./types";

export type GateContext = {
  abilities: string[];
  satisfies: (
    requiredAbility: RequiredAbility,
    abilityToTest: Ability
  ) => boolean;
};

const GateContext = createContext<GateContext | null>(null);

export const useGateContext = () => {
  const context = useContext(GateContext);

  if (!context) {
    throw new Error("useGateContext must be used within an GateProvider.");
  }

  return context;
};

export type GateProviderProps = Omit<GateContext, "satisfies"> & {
  satisfies?: GateContext["satisfies"];
  children?: React.ReactNode;
};

export const GateProvider = ({
  abilities,
  satisfies = Object.is,
  children,
}: GateProviderProps) => {
  return (
    <GateContext.Provider value={{ abilities, satisfies }}>
      {children}
    </GateContext.Provider>
  );
};
