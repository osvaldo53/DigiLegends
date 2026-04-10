import { describe, expect, it } from "vitest";
import { rollSpeciesDrops } from "../js/data/speciesDrops.js";

function createRandomSequence(values) {
  let index = 0;
  return () => {
    const nextValue = values[index] ?? 0.99;
    index += 1;
    return nextValue;
  };
}

describe("speciesDrops", () => {
  it("permite que Impmon drope Toy Gun", () => {
    const dropped = rollSpeciesDrops("impmon", createRandomSequence([0.014]));
    const notDropped = rollSpeciesDrops("impmon", createRandomSequence([0.016]));

    expect(dropped).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "toy_gun", quantity: 1 })])
    );
    expect(notDropped).toHaveLength(0);
  });

  it("nao gera drop por especie quando ela nao possui tabela", () => {
    expect(rollSpeciesDrops("agumon", createRandomSequence([0]))).toEqual([]);
  });

  it("permite que os Digimons Armor dropem seus Digi-Ovos", () => {
    expect(rollSpeciesDrops("flamedramon", createRandomSequence([0.014]))).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "digi_egg_courage", quantity: 1 })])
    );
    expect(rollSpeciesDrops("lighdramon", createRandomSequence([0.014]))).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "digi_egg_friendship", quantity: 1 })])
    );
    expect(rollSpeciesDrops("pegasusmon", createRandomSequence([0.014]))).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "digi_egg_hope", quantity: 1 })])
    );
  });

  it("permite que Machinedramon drope Chaos Digicore", () => {
    const dropped = rollSpeciesDrops("machinedramon", createRandomSequence([0.029]));
    const notDropped = rollSpeciesDrops("machinedramon", createRandomSequence([0.031]));

    expect(dropped).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "chaos_digicore", quantity: 1 })])
    );
    expect(notDropped).toHaveLength(0);
  });
});
