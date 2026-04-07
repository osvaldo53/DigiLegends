import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  canEvolveTo,
  evolveDigimon,
  getAvailableEvolutions
} from "../js/systems/evolutionSystem.js";

describe("evolutionSystem", () => {
  it("identifica quando o Digimon pode evoluir", () => {
    const agumon = createPlayerDigimon("agumon", {
      level: 10,
      bond: 5
    });

    expect(canEvolveTo(agumon, "greymon")).toBe(true);
  });

  it("lista evolucoes com status correto", () => {
    const agumon = createPlayerDigimon("agumon", {
      level: 9,
      bond: 5
    });

    const evolutions = getAvailableEvolutions(agumon);

    expect(evolutions).toHaveLength(1);
    expect(evolutions[0].targetSpeciesId).toBe("greymon");
    expect(evolutions[0].isAvailable).toBe(false);
  });

  it("evolui e registra a especie no digidex", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 10,
      bond: 5
    });

    save.party = [agumon];

    evolveDigimon(agumon, "greymon", save);

    expect(agumon.speciesId).toBe("greymon");
    expect(agumon.currentHP).toBe(agumon.finalStats.hp);
    expect(save.digidex.owned).toContain("greymon");
  });

  it("permite a nova etapa mega quando os requisitos forem atendidos", () => {
    const metalgreymon = createPlayerDigimon("metalgreymon", {
      level: 34,
      bond: 35
    });

    expect(canEvolveTo(metalgreymon, "wargreymon")).toBe(true);
  });
});
