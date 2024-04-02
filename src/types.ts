/**
 * It would be nice to make these dynamic, but for now we'll just insist they are strings.
 */

export type GateAbility = string;

export type Satifies<Ability extends GateAbility = GateAbility> = (
  requiredAbility: Ability,
  abilityToTest: Ability
) => boolean;

export type GateTest<Ability extends GateAbility = GateAbility> =
  | Ability
  | { ability: Ability }
  | { all: Ability[] }
  | { any: Ability[] };
