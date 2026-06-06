import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import {
  addTamerExp,
  getTamerBossCompletionBonus,
  getTamerExpFromBattleRewards,
  getTamerExpToNextLevel,
  normalizeTamerProgression
} from "../js/systems/tamerProgressionSystem.js";

describe("tamerProgressionSystem", () => {
  it("calcula a exp necessaria para o proximo nivel", () => {
    expect(getTamerExpToNextLevel(1)).toBe(100);
    expect(getTamerExpToNextLevel(2)).toBe(130);
    expect(getTamerExpToNextLevel(3)).toBe(170);
  });

  it("adiciona Tamer EXP e permite subir multiplos niveis", () => {
    const save = createEmptySave();

    const result = addTamerExp(save, 250);

    expect(result.gainedLevels).toBe(2);
    expect(save.tamer.level).toBe(3);
    expect(save.tamer.exp).toBe(20);
  });

  it("normaliza progresso invalido de saves antigos", () => {
    expect(normalizeTamerProgression({ level: -1, exp: -5 })).toEqual({
      level: 1,
      exp: 0
    });
  });

  it("gera Tamer EXP a partir das recompensas de batalha", () => {
    expect(getTamerExpFromBattleRewards({ exp: 40 }, "hunt")).toBe(8);
    expect(getTamerExpFromBattleRewards({ exp: 40 }, "boss")).toBe(14);
    expect(getTamerBossCompletionBonus({ recommendedLevel: 50 })).toBe(100);
  });
});
