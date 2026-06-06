import { describe, expect, it } from "vitest";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import { applyExpGain } from "../js/systems/progressionSystem.js";
import {
  getLevelCapForDigimon,
  getTrainingCapForStage
} from "../js/systems/digimonProgressionSystem.js";

describe("progressionSystem", () => {
  it("respeita o level cap do estagio atual", () => {
    const agumon = createPlayerDigimon("agumon", {
      level: 19,
      exp: 0
    });

    applyExpGain(agumon, 9999);

    expect(agumon.level).toBe(20);
    expect(agumon.exp).toBeGreaterThan(0);
  });

  it("remove o level cap de formas finais mega", () => {
    const gallantmon = createPlayerDigimon("gallantmon", {
      level: 64,
      exp: 0
    });

    applyExpGain(gallantmon, 999999);

    expect(getLevelCapForDigimon(gallantmon)).toBe(100);
    expect(gallantmon.level).toBe(100);
  });

  it("remove o level cap de mega mesmo com evolucao posterior", () => {
    const wargreymon = createPlayerDigimon("wargreymon", {
      level: 64,
      exp: 0
    });

    applyExpGain(wargreymon, 999999);

    expect(getLevelCapForDigimon(wargreymon)).toBe(100);
    expect(wargreymon.level).toBe(100);
  });

  it("remove o level cap de formas armor finais", () => {
    const flamedramon = createPlayerDigimon("flamedramon", {
      level: 34,
      exp: 0
    });

    applyExpGain(flamedramon, 999999);

    expect(getLevelCapForDigimon(flamedramon)).toBe(100);
    expect(flamedramon.level).toBe(100);
  });

  it("define a capacidade de treino dobrando a partir de Rookie", () => {
    expect(getTrainingCapForStage("In-Training")).toBe(0);
    expect(getTrainingCapForStage("Rookie")).toBe(4);
    expect(getTrainingCapForStage("Champion")).toBe(8);
    expect(getTrainingCapForStage("Armor")).toBe(8);
    expect(getTrainingCapForStage("Ultimate")).toBe(16);
    expect(getTrainingCapForStage("Mega")).toBe(32);
    expect(getTrainingCapForStage("Ultra")).toBe(64);
  });
});
