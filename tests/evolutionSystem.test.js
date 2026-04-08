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

  it("lista as tres linhas evolutivas do Tsumemon", () => {
    const tsumemon = createPlayerDigimon("tsumemon", {
      level: 3,
      bond: 1
    });

    const evolutions = getAvailableEvolutions(tsumemon);

    expect(evolutions).toHaveLength(3);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "agumon_black",
      "keramon",
      "demidevimon"
    ]);
    expect(evolutions.every((evolution) => evolution.isAvailable)).toBe(true);
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

  it("permite DNA evolution de WarGreymon para Omnimon quando o parceiro existe", () => {
    const save = createEmptySave();
    const wargreymon = createPlayerDigimon("wargreymon", {
      level: 40,
      bond: 60
    });
    const metalgarurumon = createPlayerDigimon("metalgarurumon", {
      level: 40,
      bond: 60
    });

    save.party = [wargreymon];
    save.storage = [metalgarurumon];

    expect(canEvolveTo(wargreymon, "omnimon", save)).toBe(true);
  });

  it("permite DNA evolution de MetalGarurumon para Omnimon quando o parceiro existe", () => {
    const save = createEmptySave();
    const metalgarurumon = createPlayerDigimon("metalgarurumon", {
      level: 40,
      bond: 60
    });
    const wargreymon = createPlayerDigimon("wargreymon", {
      level: 40,
      bond: 60
    });

    save.party = [metalgarurumon];
    save.storage = [wargreymon];

    expect(canEvolveTo(metalgarurumon, "omnimon", save)).toBe(true);
  });

  it("consome o parceiro ao realizar DNA evolution", () => {
    const save = createEmptySave();
    const wargreymon = createPlayerDigimon("wargreymon", {
      level: 40,
      bond: 60
    });
    const metalgarurumon = createPlayerDigimon("metalgarurumon", {
      level: 40,
      bond: 60
    });

    save.party = [wargreymon];
    save.storage = [metalgarurumon];

    evolveDigimon(wargreymon, "omnimon", save);

    expect(wargreymon.speciesId).toBe("omnimon");
    expect(save.storage).toHaveLength(0);
    expect(save.digidex.owned).toContain("omnimon");
  });

  it("permite escolher qual parceiro sera consumido na DNA evolution", () => {
    const save = createEmptySave();
    const wargreymon = createPlayerDigimon("wargreymon", {
      level: 40,
      bond: 60
    });
    const metalgarurumonA = createPlayerDigimon("metalgarurumon", {
      nickname: "Lobo A",
      level: 40,
      bond: 60
    });
    const metalgarurumonB = createPlayerDigimon("metalgarurumon", {
      nickname: "Lobo B",
      level: 45,
      bond: 75
    });

    save.party = [wargreymon];
    save.storage = [metalgarurumonA, metalgarurumonB];

    const evolutions = getAvailableEvolutions(wargreymon, save);

    expect(evolutions[0].dnaPartners).toHaveLength(2);
    expect(
      canEvolveTo(wargreymon, "omnimon", save, {
        partnerUid: metalgarurumonB.uid
      })
    ).toBe(true);

    evolveDigimon(wargreymon, "omnimon", save, {
      partnerUid: metalgarurumonB.uid
    });

    expect(save.storage).toHaveLength(1);
    expect(save.storage[0].uid).toBe(metalgarurumonA.uid);
  });

  it("bloqueia DNA evolution quando o parceiro nao atende os requisitos", () => {
    const save = createEmptySave();
    const wargreymon = createPlayerDigimon("wargreymon", {
      level: 40,
      bond: 60
    });
    const metalgarurumon = createPlayerDigimon("metalgarurumon", {
      level: 39,
      bond: 60
    });

    save.party = [wargreymon];
    save.storage = [metalgarurumon];

    const evolutions = getAvailableEvolutions(wargreymon, save);

    expect(canEvolveTo(wargreymon, "omnimon", save)).toBe(false);
    expect(evolutions).toHaveLength(1);
    expect(evolutions[0].targetSpeciesId).toBe("omnimon");
    expect(evolutions[0].isAvailable).toBe(false);
  });
});
