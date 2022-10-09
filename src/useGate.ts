import { check } from "./check";
import { useGateContext } from "./GateProvider";
import { GateTest } from "./types";

export type UseGate = {
  (test: GateTest): boolean;
};

export const useGate: UseGate = (test: GateTest) => {
  const { abilities, satisfies } = useGateContext();

  return check({ abilities, satisfies, test });
};
