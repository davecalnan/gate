/**
 * It would be nice to maket these dynamic, but for now we'll just insist they are strings.
 */

export type Ability = string;

export type Satifies = (
  requiredAbility: Ability,
  abilityToTest: Ability
) => boolean;

export type GateTest =
  | Ability
  | { ability: Ability }
  | { all: Ability[] }
  | { any: Ability[] };
