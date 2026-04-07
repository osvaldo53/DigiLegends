import { describe, expect, it } from "vitest";
import { MAX_PARTY_SIZE } from "../js/config/constants.js";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  addScanOnDefeat,
  convertScanToDigimon,
  getScanPercent,
  setScanPercent
} from "../js/systems/scanSystem.js";

describe("scanSystem", () => {
  it("acumula scan ao derrotar uma especie valida", () => {
    const save = createEmptySave();

    const result = addScanOnDefeat(save, "agumon");

    expect(result.gained).toBeGreaterThan(0);
    expect(getScanPercent(save, "agumon")).toBe(result.total);
  });

  it("converte scan para a party quando ha espaco", () => {
    const save = createEmptySave();
    setScanPercent(save, "agumon", 100);

    const result = convertScanToDigimon(save, "agumon");

    expect(result.destination).toBe("party");
    expect(save.party).toHaveLength(1);
    expect(getScanPercent(save, "agumon")).toBe(0);
  });

  it("envia para o storage quando a party estiver cheia", () => {
    const save = createEmptySave();
    save.party = Array.from({ length: MAX_PARTY_SIZE }, () => createPlayerDigimon("agumon"));
    setScanPercent(save, "gabumon", 100);

    const result = convertScanToDigimon(save, "gabumon");

    expect(result.destination).toBe("storage");
    expect(save.storage).toHaveLength(1);
  });
});
