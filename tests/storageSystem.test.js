import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  getXpChipRewardForSpecies,
  moveDigimonToParty,
  moveDigimonToStorage,
  setPartyLeader,
  tradeMultipleStorageDigimonsForXpChips,
  tradeStorageDigimonForXpChip
} from "../js/systems/storageSystem.js";

describe("storageSystem", () => {
  it("impede esvaziar a party ao enviar Digimon para o storage", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon");
    save.party = [agumon];

    expect(() => moveDigimonToStorage(save, agumon.uid)).toThrow();
  });

  it("move Digimon do storage para a party quando ha espaco", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon");
    const gabumon = createPlayerDigimon("gabumon");

    save.party = [agumon];
    save.storage = [gabumon];

    moveDigimonToParty(save, gabumon.uid);

    expect(save.party.map((digimon) => digimon.uid)).toContain(gabumon.uid);
    expect(save.storage).toHaveLength(0);
  });

  it("define corretamente um novo lider", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon");
    const gabumon = createPlayerDigimon("gabumon");

    save.party = [agumon, gabumon];

    setPartyLeader(save, gabumon.uid);

    expect(save.party[0].uid).toBe(gabumon.uid);
  });

  it("troca um Digimon do storage por XP Chip conforme o estagio", () => {
    const save = createEmptySave();
    const wargreymon = createPlayerDigimon("wargreymon");

    save.storage = [wargreymon];

    const result = tradeStorageDigimonForXpChip(save, wargreymon.uid);

    expect(result.rewardItemId).toBe("xp_chip_mega");
    expect(save.storage).toHaveLength(0);
    expect(save.inventory).toContainEqual({
      itemId: "xp_chip_mega",
      quantity: 1
    });
  });

  it("retorna o chip correto para Armor e Ultimate", () => {
    expect(getXpChipRewardForSpecies("flamedramon")).toBe("xp_chip_medium");
    expect(getXpChipRewardForSpecies("angewomon")).toBe("xp_chip_large");
  });

  it("troca varios Digimons do storage de uma vez", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon");
    const greymon = createPlayerDigimon("greymon");

    save.storage = [agumon, greymon];

    const result = tradeMultipleStorageDigimonsForXpChips(save, [
      agumon.uid,
      greymon.uid
    ]);

    expect(save.storage).toHaveLength(0);
    expect(result.tradedDigimons).toHaveLength(2);
    expect(result.rewards).toContainEqual({
      itemId: "xp_chip_small",
      quantity: 1
    });
    expect(result.rewards).toContainEqual({
      itemId: "xp_chip_medium",
      quantity: 1
    });
  });
});
