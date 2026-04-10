import { describe, expect, it, vi } from "vitest";
import { HUNTS, getHuntById, rollHuntGenericDrop } from "../js/data/encounters.js";
import { createEncounterFromHunt } from "../js/systems/encounterSystem.js";

function countByStage(stageLabel) {
  return HUNTS.filter((hunt) => hunt.stageLabel === stageLabel);
}

describe("encounters", () => {
  it("organiza 3 hunts In-Training com 4 Digimons cada", () => {
    const hunts = countByStage("In-Training");

    expect(hunts).toHaveLength(3);
    expect(hunts.every((hunt) => hunt.enemyPool.length === 4)).toBe(true);
  });

  it("organiza 4 hunts Rookie com 5 Digimons cada", () => {
    const hunts = countByStage("Rookie");

    expect(hunts).toHaveLength(4);
    expect(hunts.every((hunt) => hunt.enemyPool.length === 5)).toBe(true);
  });

  it("organiza 4 hunts Champion distribuindo 25 Digimons", () => {
    const hunts = countByStage("Champion");

    expect(hunts).toHaveLength(4);
    expect(hunts.map((hunt) => hunt.enemyPool.length)).toEqual([6, 6, 6, 7]);
  });

  it("organiza 4 hunts Ultimate/Armor com apenas 3 Armors no total", () => {
    const hunts = countByStage("Ultimate/Armor");
    const armorCount = hunts
      .flatMap((hunt) => hunt.enemyPool)
      .filter((speciesId) => ["flamedramon", "lighdramon", "pegasusmon"].includes(speciesId)).length;

    expect(hunts).toHaveLength(4);
    expect(hunts.map((hunt) => hunt.enemyPool.length)).toEqual([7, 7, 7, 8]);
    expect(armorCount).toBe(3);
  });

  it("organiza 4 hunts Mega com 7 Digimons cada", () => {
    const hunts = countByStage("Mega");

    expect(hunts).toHaveLength(4);
    expect(hunts.every((hunt) => hunt.enemyPool.length === 7)).toBe(true);
  });

  it("nao inclui Digimons Ultra nas hunts", () => {
    const allSpecies = HUNTS.flatMap((hunt) => hunt.enemyPool);

    expect(allSpecies).not.toEqual(
      expect.arrayContaining([
        "alphamon_ouryuken",
        "beelzemon_bm",
        "chaosdramon",
        "imperialdramon_fm"
      ])
    );
  });

  it("usa a faixa de nivel configurada da hunt ao criar encontros e escala a EXP pelo nivel", () => {
    const randomSpy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const encounter = createEncounterFromHunt("training-bloom");

    expect(encounter.enemy.speciesId).toBe("koromon");
    expect(encounter.enemy.level).toBe(1);
    expect(encounter.hunt.levelRange).toEqual({ min: 1, max: 4 });
    expect(encounter.rewards).toEqual({ bits: 10, exp: 11 });

    randomSpy.mockRestore();
  });

  it("mantem ids de hunt unicos", () => {
    const ids = HUNTS.map((hunt) => hunt.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });

  it("mostra o roster esperado da hunt inicial", () => {
    const hunt = getHuntById("training-bloom");

    expect(hunt).toBeTruthy();
    expect(hunt.enemyPool).toEqual(["koromon", "tsunomon", "tokomon", "tsumemon"]);
    expect(hunt.levelRange).toEqual({ min: 1, max: 4 });
  });

  it("usa a tabela generica de drops da hunt", () => {
    const dropped = rollHuntGenericDrop(
      "mega-sanctuary",
      (() => {
        const values = [0.1, 0.95];
        let index = 0;
        return () => values[index++] ?? 0.99;
      })()
    );
    const notDropped = rollHuntGenericDrop(
      "training-bloom",
      (() => {
        const values = [0.99];
        let index = 0;
        return () => values[index++] ?? 0.99;
      })()
    );

    expect(dropped).toEqual(expect.objectContaining({ id: "revive_max", quantity: 1 }));
    expect(notDropped).toBeNull();
  });
});
