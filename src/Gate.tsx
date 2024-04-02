import React, { createContext, useContext } from "react";
import { GateAbility, GateTest, Satifies } from "./types";
import { check } from "./check";

export function createGate<Ability extends GateAbility>() {
  type GateContext = {
    abilities: Ability[];
    satisfies?: Satifies<Ability>;
  };
  const GateContext = createContext<GateContext | null>(null);

  type GateProviderProps = GateContext & {
    children?: React.ReactNode;
  };

  const GateProvider = ({
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

  function useGateContext() {
    const context = useContext(GateContext);

    if (!context) {
      throw new Error("useGateContext must be used within an GateProvider.");
    }

    return context;
  }

  type GateProps = {
    children?: React.ReactNode;
    fallback?: React.ReactNode | null;
    ability: GateTest<Ability>;
  };

  /**
   * Renders its children only if the current user passes the check. See `useGate` for more details.
   * Optionally provide a fallback component to render if the user fails the check.
   */
  function Gate({
    ability,
    children = null,
    fallback = null,
  }: GateProps): React.ReactElement | null {
    if (useGate(ability)) {
      return children as React.ReactElement | null;
    }

    return fallback as React.ReactElement | null;
  }

  function useGate(test: GateTest<Ability>): boolean {
    const { abilities, satisfies } = useGateContext();

    return check<Ability>({
      abilities,
      /* @ts-expect-error ¯\_(ツ)_/¯ */
      satisfies,
      test,
    });
  }

  return Object.assign(Gate, {
    Provider: GateProvider,
    useGateContext,
    useGate,
  });
}
