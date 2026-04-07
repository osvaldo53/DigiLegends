import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  moveDigimonToParty,
  moveDigimonToStorage,
  setPartyLeader
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
});
