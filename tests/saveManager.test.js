import { beforeEach, describe, expect, it } from "vitest";
import {
  migrateSaveIfNeeded,
  saveGame,
  loadGame,
  deleteSave,
  importSaveFromText,
  serializeSaveForExport
} from "../js/core/saveManager.js";

describe("saveManager", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it("normaliza party, storage, inventario e scan ao migrar saves antigos", () => {
    const migrated = migrateSaveIfNeeded({
      playerName: "  Osval  ",
      bits: -50,
      party: [
        {
          uid: "agumon-1",
          speciesId: "agumon",
          level: 3,
          exp: 10,
          currentHP: 999,
          currentSP: 999
        },
        {
          uid: "invalido",
          speciesId: "nao-existe",
          level: 10
        }
      ],
      storage: [
        {
          uid: "storage-1",
          speciesId: "gabumon",
          level: 2,
          bond: 5
        }
      ],
      inventory: [
        { itemId: "bandage", quantity: 1 },
        { itemId: "bandage", quantity: 2 },
        { itemId: "item-falso", quantity: 99 }
      ],
      scanData: {
        agumon: 140,
        fake: 999
      },
      digidex: {
        seen: ["fake"],
        owned: []
      }
    });

    expect(migrated.playerName).toBe("Osval");
    expect(migrated.bits).toBe(0);
    expect(migrated.party).toHaveLength(1);
    expect(migrated.storage).toHaveLength(1);
    expect(migrated.party[0].finalStats.hp).toBeGreaterThan(0);
    expect(migrated.party[0].currentHP).toBeLessThanOrEqual(migrated.party[0].finalStats.hp);
    expect(migrated.inventory).toEqual([{ itemId: "bandage", quantity: 3 }]);
    expect(migrated.scanData).toEqual({ agumon: 140 });
    expect(migrated.digidex.seen).toEqual(expect.arrayContaining(["agumon", "gabumon"]));
    expect(migrated.digidex.owned).toEqual(expect.arrayContaining(["agumon", "gabumon"]));
    expect(migrated.combat.autoBattleEnabled).toBe(true);
    expect(migrated.combat.autoItemRules.bandage).toEqual({
      enabled: false,
      resource: "hp",
      thresholdPercent: 35
    });
  });

  it("salva e carrega dados do localStorage", () => {
    const payload = {
      version: 3,
      playerName: "Tester"
    };

    saveGame(payload);

    expect(loadGame()).toEqual(payload);

    deleteSave();

    expect(loadGame()).toBeNull();
  });

  it("importa um save valido e persiste o resultado migrado", () => {
    const imported = importSaveFromText(
      JSON.stringify({
        version: 3,
        playerName: "Importado",
        bits: 123,
        party: [
          {
            uid: "agumon-import",
            speciesId: "agumon",
            level: 5,
            exp: 7,
            bond: 2
          }
        ]
      })
    );

    expect(imported.playerName).toBe("Importado");
    expect(imported.party).toHaveLength(1);
    expect(loadGame()?.playerName).toBe("Importado");
  });

  it("rejeita importacao de save invalido", () => {
    expect(() => importSaveFromText("{ nao-json }")).toThrow(
      "Nao foi possivel ler o arquivo de save."
    );
  });

  it("serializa o save para exportacao em JSON", () => {
    const exported = serializeSaveForExport({
      version: 3,
      playerName: "Tester"
    });

    expect(JSON.parse(exported)).toEqual({
      version: 3,
      playerName: "Tester"
    });
  });
});
