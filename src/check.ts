import { GateAbility, Satifies, GateTest } from "./types";

export function check<Ability extends GateAbility>({
  abilities,
  test,
  satisfies = Object.is,
}: {
  abilities: Ability[];
  test: GateTest<Ability>;
  satisfies?: Satifies;
}) {
  const hasAbility = (requiredAbility: Ability, abilities: Ability[]) => {
    return !!abilities.find((ability) => satisfies(requiredAbility, ability));
  };

  if (typeof test === "string") {
    return hasAbility(test, abilities);
  }

  if (typeof test === "object" && "ability" in test) {
    return hasAbility(test.ability, abilities);
  }

  if (typeof test === "object" && "all" in test) {
    return test.all.every((requiredAbility) =>
      hasAbility(requiredAbility, abilities)
    );
  }

  if (typeof test === "object" && "any" in test) {
    return test.any.some((requiredAbility) =>
      hasAbility(requiredAbility, abilities)
    );
  }

  throw new Error("Invalid arguments passed to Gate.");
}
