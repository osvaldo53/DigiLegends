import { describe, expect, it, vi } from "vitest";
import { HUNTS, getHuntById } from "../js/data/encounters.js";
import { createEncounterFromHunt } from "../js/systems/encounterSystem.js";

describe("encounters", () => {
  it("inclui Kapurimon, Hagurumon e Guardromon nas hunts corretas", () => {
    const trainingHunt = getHuntById("training-grounds");
    const rookieHunt = getHuntById("rookie-forest");
    const championHunt = getHuntById("champion-ridge");

    expect(trainingHunt.enemyPool).toEqual(expect.arrayContaining(["kapurimon"]));
    expect(rookieHunt.enemyPool).toEqual(expect.arrayContaining(["hagurumon"]));
    expect(championHunt.enemyPool).toEqual(expect.arrayContaining(["guardromon"]));
  });

  it("inclui uma hunt simples para as formas Mega", () => {
    const hunt = getHuntById("mega-sanctuary");

    expect(hunt).toBeTruthy();
    expect(hunt.enemyPool).toHaveLength(8);
    expect(hunt.enemyPool).toEqual(
      expect.arrayContaining([
        "wargreymon",
        "metalgarurumon",
        "seraphimon",
        "rosemon",
        "herculeskabuterimon",
        "vikemon",
        "phoenixmon",
        "ulforceveedramon"
      ])
    );
  });

  it("inclui uma hunt tematica Virus com pesos e recompensas variaveis", () => {
    const hunt = getHuntById("virus-nightmare");

    expect(hunt).toBeTruthy();
    expect(hunt.rewardLabel).toBe("Variavel por estagio");
    expect(hunt.enemyPool.length).toBeGreaterThan(8);
    expect(hunt.enemyPool[0]).toEqual(
      expect.objectContaining({
        speciesId: "tsumemon",
        weight: expect.any(Number),
        rewards: expect.objectContaining({ exp: expect.any(Number) }),
        levelRange: expect.objectContaining({ min: expect.any(Number), max: expect.any(Number) })
      })
    );
    expect(
      hunt.enemyPool.filter((entry) =>
        ["blackwargreymon", "venommyotismon", "diaboromon"].includes(entry.speciesId)
      )
    ).toEqual([
      expect.objectContaining({ speciesId: "blackwargreymon", weight: 3 }),
      expect.objectContaining({ speciesId: "venommyotismon", weight: 3 }),
      expect.objectContaining({ speciesId: "diaboromon", weight: 3 })
    ]);
  });

  it("usa as recompensas especificas do encontro ponderado", () => {
    const randomSpy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const encounter = createEncounterFromHunt("virus-nightmare");

    expect(encounter.enemy.speciesId).toBe("tsumemon");
    expect(encounter.rewards).toEqual({ bits: 12, exp: 16 });

    randomSpy.mockRestore();
  });

  it("mantem ids de hunt unicos", () => {
    const ids = HUNTS.map((hunt) => hunt.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });
});
