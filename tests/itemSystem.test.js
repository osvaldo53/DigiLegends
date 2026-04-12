import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import { getItemById } from "../js/data/items.js";
import { getShopEntryByItemId } from "../js/data/shopCatalog.js";
import { useItemOnDigimon } from "../js/systems/itemSystem.js";

describe("itemSystem", () => {
  it("aplica a nova cura do Bandage", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon");

    agumon.currentHP = 5;
    save.party = [agumon];

    useItemOnDigimon({
      save,
      itemId: "bandage",
      targetDigimon: agumon,
      context: "battle"
    });

    expect(agumon.currentHP).toBe(35);
  });

  it("aplica a nova recuperacao de SP", () => {
    const save = createEmptySave();
    const patamon = createPlayerDigimon("patamon", {
      level: 10
    });

    patamon.currentSP = 5;
    save.party = [patamon];

    useItemOnDigimon({
      save,
      itemId: "small_sp_disk",
      targetDigimon: patamon,
      context: "battle"
    });

    expect(patamon.currentSP).toBe(35);
  });

  it("mantem os novos valores de item e preco na loja", () => {
    expect(getItemById("small_recovery").effect.hpRestore).toBe(60);
    expect(getShopEntryByItemId("small_recovery").price).toBe(65);
    expect(getItemById("medium_recovery").effect.hpRestore).toBe(120);
    expect(getItemById("high_recovery").effect.hpRestore).toBe(350);
    expect(getItemById("medium_sp_disk").effect.spRestore).toBe(60);
    expect(getItemById("high_sp_disk").effect.spRestore).toBe(120);
    expect(getItemById("bandage").usableInMenu).toBe(false);
    expect(getItemById("small_sp_disk").usableInMenu).toBe(false);
    expect(getItemById("xp_chip_small").usableInMenu).toBe(true);
    expect(getShopEntryByItemId("medium_recovery").price).toBe(140);
    expect(getShopEntryByItemId("high_recovery").price).toBe(260);
    expect(getShopEntryByItemId("medium_sp_disk").price).toBe(120);
    expect(getShopEntryByItemId("high_sp_disk").price).toBe(220);
    expect(getShopEntryByItemId("revive").price).toBe(180);
    expect(getShopEntryByItemId("revive_max").price).toBe(420);
    expect(getItemById("toy_gun")).toEqual(
      expect.objectContaining({
        id: "toy_gun",
        category: "evolution",
        sprite: "./assets/items/toy_gun.png",
        usableInMenu: false,
        usableInBattle: false
      })
    );
    expect(getItemById("chaos_digicore")).toEqual(
      expect.objectContaining({
        id: "chaos_digicore",
        category: "evolution",
        sprite: "./assets/items/chaos_digicore.png",
        usableInMenu: false,
        usableInBattle: false
      })
    );
    expect(getItemById("xp_chip_tiny")?.effect.expGain).toBe(32);
    expect(getItemById("xp_chip_small")?.effect.expGain).toBe(72);
    expect(getItemById("xp_chip_medium")?.effect.expGain).toBe(144);
    expect(getItemById("xp_chip_large")?.effect.expGain).toBe(240);
    expect(getItemById("xp_chip_mega")?.effect.expGain).toBe(360);
  });

  it("revive um Digimon derrotado com metade da vida", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon");

    save.inventory.push({ itemId: "revive", quantity: 1 });
    agumon.currentHP = 0;
    save.party = [agumon];

    useItemOnDigimon({
      save,
      itemId: "revive",
      targetDigimon: agumon,
      context: "battle"
    });

    expect(agumon.currentHP).toBe(Math.floor(agumon.finalStats.hp * 0.5));
  });

  it("revive max restaura toda a vida", () => {
    const save = createEmptySave();
    const gabumon = createPlayerDigimon("gabumon");

    save.inventory.push({ itemId: "revive_max", quantity: 1 });
    gabumon.currentHP = 0;
    save.party = [gabumon];

    useItemOnDigimon({
      save,
      itemId: "revive_max",
      targetDigimon: gabumon,
      context: "battle"
    });

    expect(gabumon.currentHP).toBe(gabumon.finalStats.hp);
  });

  it("usa XP Chip no menu e concede EXP ao Digimon", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 1,
      exp: 0
    });

    save.inventory.push({ itemId: "xp_chip_small", quantity: 1 });
    save.party = [agumon];

    const result = useItemOnDigimon({
      save,
      itemId: "xp_chip_small",
      targetDigimon: agumon,
      context: "menu"
    });

    expect(result.progression?.expGained).toBe(72);
    expect(agumon.level).toBe(3);
    expect(agumon.exp).toBe(17);
  });

  it("permite level up ao usar XP Chip", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 1,
      exp: 15
    });

    save.inventory.push({ itemId: "xp_chip_tiny", quantity: 1 });
    save.party = [agumon];

    const previousHp = agumon.finalStats.hp;

    const result = useItemOnDigimon({
      save,
      itemId: "xp_chip_tiny",
      targetDigimon: agumon,
      context: "menu"
    });

    expect(result.progression?.gainedLevels).toBe(1);
    expect(agumon.level).toBe(2);
    expect(agumon.exp).toBe(27);
    expect(agumon.finalStats.hp).toBeGreaterThan(previousHp);
    expect(agumon.currentHP).toBe(agumon.finalStats.hp);
  });
});
