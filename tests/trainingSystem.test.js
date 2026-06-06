import { describe, expect, it } from "vitest";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  TRAINING_DURATION_PER_POINT_MS,
  claimTrainingJob,
  getMaxTrainingQuantity,
  getTrainingItemQuantity,
  getTrainingJobForDigimon,
  getUsedTrainingPoints,
  isTrainingJobComplete,
  startTrainingJob
} from "../js/systems/trainingSystem.js";

describe("trainingSystem", () => {
  it("inicia um treino consumindo a quantidade correta de chips", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 15
    });
    const now = 1_000_000;

    save.party = [agumon];
    save.inventory.find((entry) => entry.itemId === "training_chip_atk").quantity += 2;

    const job = startTrainingJob(save, agumon.uid, "atk", 3, now);

    expect(job.quantity).toBe(3);
    expect(job.startedAt).toBe(now);
    expect(job.endsAt).toBe(now + 3 * TRAINING_DURATION_PER_POINT_MS);
    expect(getTrainingItemQuantity(save, "atk")).toBe(0);
    expect(getTrainingJobForDigimon(save, agumon.uid)).toBeTruthy();
  });

  it("permite retirar o Digimon quando o tempo do treino termina", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 15
    });
    const now = 1_000_000;

    save.party = [agumon];
    save.inventory.push({
      itemId: "training_chip_hp",
      quantity: 2
    });

    const job = startTrainingJob(save, agumon.uid, "hp", 2, now);

    expect(isTrainingJobComplete(job, now)).toBe(false);

    const result = claimTrainingJob(save, agumon.uid, job.endsAt + 1);

    expect(result.totalGain).toBe(12);
    expect(agumon.bonusStats.hp).toBe(12);
    expect(agumon.finalStats.hp).toBe(138);
    expect(getTrainingJobForDigimon(save, agumon.uid)).toBeNull();
  });

  it("impede passar do limite de treino do estagio", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 20,
      bonusStats: {
        atk: 2,
        def: 2
      }
    });

    save.party = [agumon];

    expect(getUsedTrainingPoints(agumon)).toBe(4);
    expect(getMaxTrainingQuantity(save, agumon, "atk")).toBe(0);
    expect(() => startTrainingJob(save, agumon.uid, "atk", 1, 1000)).toThrow();
  });
});
