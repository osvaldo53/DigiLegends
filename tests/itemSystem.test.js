import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import { getInventoryEntry, useItemOnDigimon } from "../js/systems/itemSystem.js";

describe("itemSystem", () => {
  it("nao permite curar Digimon derrotado com item comum", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 10,
      bond: 5
    });

    agumon.currentHP = 0;
    save.party = [agumon];

    expect(() =>
      useItemOnDigimon({
        save,
        itemId: "small_recovery",
        targetDigimon: agumon,
        context: "battle"
      })
    ).toThrow("Digimon derrotado");

    expect(agumon.currentHP).toBe(0);
    expect(getInventoryEntry(save, "small_recovery")?.quantity).toBe(1);
  });
});
