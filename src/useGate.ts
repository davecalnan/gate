import { useGateContext } from "./GateProvider";
import { Ability, RequiredAbility } from "./types";

export type UseGate = {
  (ability: RequiredAbility): boolean;
  ({ ability }: { ability: RequiredAbility }): boolean;
  ({ all }: { all: RequiredAbility[] }): boolean;
  ({ any }: { any: RequiredAbility[] }): boolean;
  /**
   * This one's annoying as it should be implied but it's needed for `<Gate />`.
   */
  (
    arg:
      | RequiredAbility
      | {
          ability: RequiredAbility;
        }
      | {
          all: RequiredAbility[];
        }
      | {
          any: RequiredAbility[];
        }
  ): boolean;
};

export const useGate: UseGate = (arg) => {
  const { abilities, satisfies } = useGateContext();
  console.log({ arg, abilities, satisfies });

  const hasAbility = (
    requiredAbility: RequiredAbility,
    abilities: Ability[]
  ) => {
    return !!abilities.find((ability) => satisfies(requiredAbility, ability));
  };

  if (typeof arg === "string") {
    return hasAbility(arg, abilities);
  }

  if (typeof arg === "object" && "ability" in arg) {
    return hasAbility(arg.ability, abilities);
  }

  if (typeof arg === "object" && "all" in arg) {
    return arg.all.every((requiredAbility) =>
      hasAbility(requiredAbility, abilities)
    );
  }

  if (typeof arg === "object" && "any" in arg) {
    return arg.any.some((requiredAbility) =>
      hasAbility(requiredAbility, abilities)
    );
  }

  throw new Error("Invalid arguments passed to useGate.");
};
