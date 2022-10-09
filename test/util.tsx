import React from "react";
import { GateProviderProps, GateProvider } from "../src/GateProvider";

export const makeWrapper = (props: Omit<GateProviderProps, "children">) => {
  return ({ children }: { children: React.ReactNode }) => (
    <GateProvider {...props}>{children}</GateProvider>
  );
};
