import React from "react";
import { GateTest } from "types";
import { useGate } from "./useGate";

type GateProps = {
  children?: React.ReactNode;
  fallback?: React.ReactNode | null;
  ability: GateTest;
};

/**
 * Renders its children only if the current user passes the check. See `useGate` for more details.
 * Optionally provide a fallback component to render if the user fails the check.
 */
export const Gate = ({
  ability,
  children = null,
  fallback = null,
}: GateProps): React.ReactElement | null => {
  if (useGate(ability)) {
    return children as React.ReactElement | null;
  }

  return fallback as React.ReactElement | null;
};
