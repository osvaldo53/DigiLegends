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

    expect(evolutions).toHaveLength(2);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "greymon",
      "geogreymon"
    ]);
    expect(evolutions.every((evolution) => evolution.isAvailable === false)).toBe(true);
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

  it("lista as tres linhas evolutivas da Yokomon", () => {
    const yokomon = createPlayerDigimon("yokomon", {
      level: 3,
      bond: 1
    });

    const evolutions = getAvailableEvolutions(yokomon);

    expect(evolutions).toHaveLength(3);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "biyomon",
      "wormmon",
      "elecmon"
    ]);
    expect(evolutions.every((evolution) => evolution.isAvailable)).toBe(true);
  });

  it("lista as tres linhas evolutivas do Koromon", () => {
    const koromon = createPlayerDigimon("koromon", {
      level: 3,
      bond: 1
    });

    const evolutions = getAvailableEvolutions(koromon);

    expect(evolutions).toHaveLength(3);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "agumon",
      "dracomon",
      "guilmon"
    ]);
    expect(evolutions.every((evolution) => evolution.isAvailable)).toBe(true);
  });

  it("permite a nova linha Kapurimon ate Hagurumon", () => {
    const kapurimon = createPlayerDigimon("kapurimon", {
      level: 3,
      bond: 1
    });

    expect(canEvolveTo(kapurimon, "hagurumon")).toBe(true);
  });

  it("permite a nova linha Wanyamon ate Dorumon", () => {
    const wanyamon = createPlayerDigimon("wanyamon", {
      level: 3,
      bond: 1
    });

    expect(canEvolveTo(wanyamon, "dorumon")).toBe(true);
  });

  it("lista as duas linhas evolutivas do Wanyamon", () => {
    const wanyamon = createPlayerDigimon("wanyamon", {
      level: 3,
      bond: 1
    });

    const evolutions = getAvailableEvolutions(wanyamon);

    expect(evolutions).toHaveLength(2);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "dorumon",
      "gaomon"
    ]);
  });

  it("lista as duas linhas evolutivas do Nyaromon", () => {
    const nyaromon = createPlayerDigimon("nyaromon", {
      level: 3,
      bond: 1
    });

    const evolutions = getAvailableEvolutions(nyaromon);

    expect(evolutions).toHaveLength(2);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "terriermon",
      "salamon"
    ]);
  });

  it("permite a nova linha Pagumon ate Impmon", () => {
    const pagumon = createPlayerDigimon("pagumon", {
      level: 3,
      bond: 1
    });

    expect(canEvolveTo(pagumon, "impmon")).toBe(true);
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

  it("permite a nova linha de Wormmon para Stingmon", () => {
    const wormmon = createPlayerDigimon("wormmon", {
      level: 10,
      bond: 5
    });

    expect(canEvolveTo(wormmon, "stingmon")).toBe(true);
  });

  it("permite evoluir Hagurumon para Guardromon", () => {
    const hagurumon = createPlayerDigimon("hagurumon", {
      level: 10,
      bond: 5
    });

    expect(canEvolveTo(hagurumon, "guardromon")).toBe(true);
  });

  it("permite evoluir Dorumon para Raptordramon", () => {
    const dorumon = createPlayerDigimon("dorumon", {
      level: 10,
      bond: 5
    });

    expect(canEvolveTo(dorumon, "raptordramon")).toBe(true);
  });

  it("permite evoluir Dracomon para Ginryumon", () => {
    const dracomon = createPlayerDigimon("dracomon", {
      level: 10,
      bond: 5
    });

    expect(canEvolveTo(dracomon, "ginryumon")).toBe(true);
  });

  it("lista as tres linhas evolutivas do Dracomon", () => {
    const dracomon = createPlayerDigimon("dracomon", {
      level: 10,
      bond: 5
    });

    const evolutions = getAvailableEvolutions(dracomon);

    expect(evolutions).toHaveLength(3);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "ginryumon",
      "coredramon_blue",
      "coredramon_green"
    ]);
  });

  it("lista as duas linhas evolutivas do Guilmon", () => {
    const guilmon = createPlayerDigimon("guilmon", {
      level: 10,
      bond: 5
    });

    const evolutions = getAvailableEvolutions(guilmon);

    expect(evolutions).toHaveLength(2);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "growlmon",
      "tyrannomon"
    ]);
  });

  it("lista as duas linhas evolutivas do Impmon", () => {
    const impmon = createPlayerDigimon("impmon", {
      level: 10,
      bond: 6
    });

    const evolutions = getAvailableEvolutions(impmon);

    expect(evolutions).toHaveLength(2);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "icedevimon",
      "blackgatomon"
    ]);
  });

  it("exige Digi-Ovo da Coragem para evoluir Veemon em Flamedramon", () => {
    const save = createEmptySave();
    const veemon = createPlayerDigimon("veemon", {
      level: 10,
      bond: 6
    });

    save.party = [veemon];

    expect(canEvolveTo(veemon, "flamedramon", save)).toBe(false);

    save.inventory.push({
      itemId: "digi_egg_courage",
      quantity: 1
    });

    expect(canEvolveTo(veemon, "flamedramon", save)).toBe(true);
  });

  it("consome o Digi-Ovo ao realizar Armor Evolution", () => {
    const save = createEmptySave();
    const veemon = createPlayerDigimon("veemon", {
      level: 10,
      bond: 6
    });

    save.party = [veemon];
    save.inventory.push({
      itemId: "digi_egg_friendship",
      quantity: 1
    });

    evolveDigimon(veemon, "lighdramon", save);

    expect(veemon.speciesId).toBe("lighdramon");
    expect(save.inventory.find((entry) => entry.itemId === "digi_egg_friendship")).toBeUndefined();
    expect(save.digidex.owned).toContain("lighdramon");
  });

  it("permite Armor Evolution de Patamon para Pegasusmon com Digi-Ovo da Esperanca", () => {
    const save = createEmptySave();
    const patamon = createPlayerDigimon("patamon", {
      level: 10,
      bond: 8
    });

    save.party = [patamon];
    save.inventory.push({
      itemId: "digi_egg_hope",
      quantity: 1
    });

    expect(canEvolveTo(patamon, "pegasusmon", save)).toBe(true);
  });

  it("permite evoluir Paildramon para Imperialdramon DM", () => {
    const paildramon = createPlayerDigimon("paildramon", {
      level: 34,
      bond: 32
    });

    expect(canEvolveTo(paildramon, "imperialdramon_dm")).toBe(true);
  });

  it("permite evoluir Imperialdramon DM para Imperialdramon FM", () => {
    const imperialdramonDm = createPlayerDigimon("imperialdramon_dm", {
      level: 40,
      bond: 40
    });

    expect(canEvolveTo(imperialdramonDm, "imperialdramon_fm")).toBe(true);
  });

  it("exige Omni Sword para evoluir Imperialdramon FM em Imperialdramon PM", () => {
    const save = createEmptySave();
    const imperialdramonFm = createPlayerDigimon("imperialdramon_fm", {
      level: 45,
      bond: 55
    });

    save.party = [imperialdramonFm];

    expect(canEvolveTo(imperialdramonFm, "imperialdramon_pm", save)).toBe(false);

    save.inventory.push({
      itemId: "omni_sword",
      quantity: 1
    });

    expect(canEvolveTo(imperialdramonFm, "imperialdramon_pm", save)).toBe(true);
  });

  it("consome o Omni Sword ao evoluir Imperialdramon FM em Imperialdramon PM", () => {
    const save = createEmptySave();
    const imperialdramonFm = createPlayerDigimon("imperialdramon_fm", {
      level: 45,
      bond: 55
    });

    save.party = [imperialdramonFm];
    save.inventory.push({
      itemId: "omni_sword",
      quantity: 1
    });

    evolveDigimon(imperialdramonFm, "imperialdramon_pm", save);

    expect(imperialdramonFm.speciesId).toBe("imperialdramon_pm");
    expect(save.inventory.find((entry) => entry.itemId === "omni_sword")).toBeUndefined();
    expect(save.digidex.owned).toContain("imperialdramon_pm");
  });

  it("permite evoluir Andromon para Craniamon", () => {
    const andromon = createPlayerDigimon("andromon", {
      level: 36,
      bond: 34
    });

    expect(canEvolveTo(andromon, "craniamon")).toBe(true);
  });

  it("permite evoluir Grademon para Alphamon", () => {
    const grademon = createPlayerDigimon("grademon", {
      level: 36,
      bond: 34
    });

    expect(canEvolveTo(grademon, "alphamon")).toBe(true);
  });

  it("permite evoluir Hisyaryumon para Ouryumon", () => {
    const hisyaryumon = createPlayerDigimon("hisyaryumon", {
      level: 36,
      bond: 34
    });

    expect(canEvolveTo(hisyaryumon, "ouryumon")).toBe(true);
  });

  it("permite evoluir WarGrowlmon para Gallantmon", () => {
    const wargrowlmon = createPlayerDigimon("wargrowlmon", {
      level: 36,
      bond: 36
    });

    expect(canEvolveTo(wargrowlmon, "gallantmon")).toBe(true);
  });

  it("lista as duas linhas mega da Angewomon", () => {
    const angewomon = createPlayerDigimon("angewomon", {
      level: 40,
      bond: 40
    });

    const evolutions = getAvailableEvolutions(angewomon);

    expect(evolutions).toHaveLength(3);
    expect(evolutions.map((evolution) => evolution.targetSpeciesId)).toEqual([
      "ophanimon",
      "magnadramon",
      "mastemon"
    ]);
  });

  it("permite DNA evolution de Angewomon para Mastemon quando o parceiro existe", () => {
    const save = createEmptySave();
    const angewomon = createPlayerDigimon("angewomon", {
      level: 40,
      bond: 40
    });
    const ladydevimon = createPlayerDigimon("ladydevimon", {
      level: 40,
      bond: 40
    });

    save.party = [angewomon];
    save.storage = [ladydevimon];

    expect(canEvolveTo(angewomon, "mastemon", save)).toBe(true);
  });

  it("permite DNA evolution de LadyDevimon para Mastemon quando o parceiro existe", () => {
    const save = createEmptySave();
    const ladydevimon = createPlayerDigimon("ladydevimon", {
      level: 40,
      bond: 40
    });
    const angewomon = createPlayerDigimon("angewomon", {
      level: 40,
      bond: 40
    });

    save.party = [ladydevimon];
    save.storage = [angewomon];

    expect(canEvolveTo(ladydevimon, "mastemon", save)).toBe(true);
  });

  it("consome o parceiro ao realizar DNA evolution para Mastemon", () => {
    const save = createEmptySave();
    const angewomon = createPlayerDigimon("angewomon", {
      level: 40,
      bond: 40
    });
    const ladydevimon = createPlayerDigimon("ladydevimon", {
      level: 40,
      bond: 40
    });

    save.party = [angewomon];
    save.storage = [ladydevimon];

    evolveDigimon(angewomon, "mastemon", save);

    expect(angewomon.speciesId).toBe("mastemon");
    expect(save.storage).toHaveLength(0);
    expect(save.digidex.owned).toContain("mastemon");
  });

  it("exige Toy Gun para evoluir Beelzemon para Beelzemon BM", () => {
    const save = createEmptySave();
    const beelzemon = createPlayerDigimon("beelzemon", {
      level: 45,
      bond: 45
    });

    save.party = [beelzemon];

    expect(canEvolveTo(beelzemon, "beelzemon_bm", save)).toBe(false);

    save.inventory.push({
      itemId: "toy_gun",
      quantity: 1
    });

    expect(canEvolveTo(beelzemon, "beelzemon_bm", save)).toBe(true);
  });

  it("exige Chaos Digicore para evoluir Machinedramon para Chaosdramon", () => {
    const save = createEmptySave();
    const machinedramon = createPlayerDigimon("machinedramon", {
      level: 45,
      bond: 45
    });

    save.party = [machinedramon];

    expect(canEvolveTo(machinedramon, "chaosdramon", save)).toBe(false);

    save.inventory.push({
      itemId: "chaos_digicore",
      quantity: 1
    });

    expect(canEvolveTo(machinedramon, "chaosdramon", save)).toBe(true);
  });

  it("consome o Toy Gun ao evoluir Beelzemon para Beelzemon BM", () => {
    const save = createEmptySave();
    const beelzemon = createPlayerDigimon("beelzemon", {
      level: 45,
      bond: 45
    });

    save.party = [beelzemon];
    save.inventory.push({
      itemId: "toy_gun",
      quantity: 1
    });

    evolveDigimon(beelzemon, "beelzemon_bm", save);

    expect(beelzemon.speciesId).toBe("beelzemon_bm");
    expect(save.inventory.find((entry) => entry.itemId === "toy_gun")).toBeUndefined();
    expect(save.digidex.owned).toContain("beelzemon_bm");
  });

  it("consome o Chaos Digicore ao evoluir Machinedramon para Chaosdramon", () => {
    const save = createEmptySave();
    const machinedramon = createPlayerDigimon("machinedramon", {
      level: 45,
      bond: 45
    });

    save.party = [machinedramon];
    save.inventory.push({
      itemId: "chaos_digicore",
      quantity: 1
    });

    evolveDigimon(machinedramon, "chaosdramon", save);

    expect(machinedramon.speciesId).toBe("chaosdramon");
    expect(save.inventory.find((entry) => entry.itemId === "chaos_digicore")).toBeUndefined();
    expect(save.digidex.owned).toContain("chaosdramon");
  });

  it("permite DNA evolution de Alphamon para Alphamon Ouryuken quando o parceiro existe", () => {
    const save = createEmptySave();
    const alphamon = createPlayerDigimon("alphamon", {
      level: 45,
      bond: 45
    });
    const ouryumon = createPlayerDigimon("ouryumon", {
      level: 45,
      bond: 45
    });

    save.party = [alphamon];
    save.storage = [ouryumon];

    expect(canEvolveTo(alphamon, "alphamon_ouryuken", save)).toBe(true);
  });

  it("permite DNA evolution de Ouryumon para Alphamon Ouryuken quando o parceiro existe", () => {
    const save = createEmptySave();
    const ouryumon = createPlayerDigimon("ouryumon", {
      level: 45,
      bond: 45
    });
    const alphamon = createPlayerDigimon("alphamon", {
      level: 45,
      bond: 45
    });

    save.party = [ouryumon];
    save.storage = [alphamon];

    expect(canEvolveTo(ouryumon, "alphamon_ouryuken", save)).toBe(true);
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

  it("permite DNA evolution de ExVeemon para Paildramon quando o parceiro existe", () => {
    const save = createEmptySave();
    const exveemon = createPlayerDigimon("exveemon", {
      level: 24,
      bond: 24
    });
    const stingmon = createPlayerDigimon("stingmon", {
      level: 24,
      bond: 24
    });

    save.party = [exveemon];
    save.storage = [stingmon];

    expect(canEvolveTo(exveemon, "paildramon", save)).toBe(true);
  });

  it("permite DNA evolution de Stingmon para Paildramon quando o parceiro existe", () => {
    const save = createEmptySave();
    const stingmon = createPlayerDigimon("stingmon", {
      level: 24,
      bond: 24
    });
    const exveemon = createPlayerDigimon("exveemon", {
      level: 24,
      bond: 24
    });

    save.party = [stingmon];
    save.storage = [exveemon];

    expect(canEvolveTo(stingmon, "paildramon", save)).toBe(true);
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

  it("consome o parceiro ao realizar DNA evolution para Paildramon", () => {
    const save = createEmptySave();
    const exveemon = createPlayerDigimon("exveemon", {
      level: 24,
      bond: 24
    });
    const stingmon = createPlayerDigimon("stingmon", {
      level: 24,
      bond: 24
    });

    save.party = [exveemon];
    save.storage = [stingmon];

    evolveDigimon(exveemon, "paildramon", save);

    expect(exveemon.speciesId).toBe("paildramon");
    expect(save.storage).toHaveLength(0);
    expect(save.digidex.owned).toContain("paildramon");
  });

  it("consome o parceiro ao realizar DNA evolution para Alphamon Ouryuken", () => {
    const save = createEmptySave();
    const alphamon = createPlayerDigimon("alphamon", {
      level: 45,
      bond: 45
    });
    const ouryumon = createPlayerDigimon("ouryumon", {
      level: 45,
      bond: 45
    });

    save.party = [alphamon];
    save.storage = [ouryumon];

    evolveDigimon(alphamon, "alphamon_ouryuken", save);

    expect(alphamon.speciesId).toBe("alphamon_ouryuken");
    expect(save.storage).toHaveLength(0);
    expect(save.digidex.owned).toContain("alphamon_ouryuken");
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
