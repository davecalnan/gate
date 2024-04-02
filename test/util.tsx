import React from "react";
import { createGate } from "Gate";

export const makeWrapper = (
  Gate: ReturnType<typeof createGate>,
  props: Omit<React.ComponentProps<(typeof Gate)["Provider"]>, "children">
) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Gate.Provider {...props}>{children}</Gate.Provider>
  );
};
