import { getItemById } from "./items.js";

export const SPECIES_DROP_TABLES = {
  impmon: [
    {
      itemId: "toy_gun",
      quantity: 1,
      chance: 0.015
    }
  ],
  flamedramon: [
    {
      itemId: "digi_egg_courage",
      quantity: 1,
      chance: 0.015
    }
  ],
  lighdramon: [
    {
      itemId: "digi_egg_friendship",
      quantity: 1,
      chance: 0.015
    }
  ],
  pegasusmon: [
    {
      itemId: "digi_egg_hope",
      quantity: 1,
      chance: 0.015
    }
  ],
  machinedramon: [
    {
      itemId: "chaos_digicore",
      quantity: 1,
      chance: 0.03
    }
  ]
};

export function rollSpeciesDrops(speciesId, randomFn = Math.random) {
  const table = SPECIES_DROP_TABLES[speciesId] || [];

  return table
    .filter((drop) => randomFn() < Number(drop.chance ?? 0))
    .map((drop) => ({
      id: drop.itemId,
      itemId: drop.itemId,
      name: getItemById(drop.itemId)?.name || drop.itemId,
      quantity: Number(drop.quantity ?? 1)
    }));
}
