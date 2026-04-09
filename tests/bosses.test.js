import { describe, expect, it } from "vitest";
import { getBossById, rollBossRewardDrops } from "../js/data/bosses.js";
import { getItemById } from "../js/data/items.js";

function createRandomSequence(values) {
  let index = 0;
  return () => {
    const nextValue = values[index] ?? 0.99;
    index += 1;
    return nextValue;
  };
}

describe("bosses", () => {
  it("cadastra o desafio de Omnimon com tres etapas fixas", () => {
    const boss = getBossById("omnimon");

    expect(boss).toBeTruthy();
    expect(boss.recommendedLevel).toBe(50);
    expect(boss.stages).toHaveLength(3);
    expect(boss.stages.map((stage) => stage.speciesId)).toEqual([
      "metalgarurumon",
      "wargreymon",
      "omnimon"
    ]);
    expect(boss.stages[1].transitionAnimation).toEqual(
      expect.objectContaining({
        heading: "DNA Digivolution",
        to: expect.objectContaining({ name: "Omnimon" })
      })
    );
  });

  it("mantem 10% de chance para o drop de Omni Sword", () => {
    const dropped = rollBossRewardDrops(
      "omnimon",
      createRandomSequence([0, 0, 0, 0, 0.09])
    );
    const notDropped = rollBossRewardDrops(
      "omnimon",
      createRandomSequence([0, 0, 0, 0, 0.11])
    );

    expect(dropped).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "omni_sword", quantity: 1 })])
    );
    expect(notDropped.find((item) => item.id === "omni_sword")).toBeUndefined();
  });

  it("cadastra o item raro Omni Sword com sprite reservado", () => {
    const item = getItemById("omni_sword");

    expect(item).toEqual(
      expect.objectContaining({
        id: "omni_sword",
        category: "boss",
        sprite: "./assets/items/omni_sword.png",
        usableInMenu: false,
        usableInBattle: false
      })
    );
  });

  it("cadastra o desafio de Alphamon Ouryuken com tres etapas fixas", () => {
    const boss = getBossById("alphamon-ouryuken");

    expect(boss).toBeTruthy();
    expect(boss.recommendedLevel).toBe(100);
    expect(boss.stages).toHaveLength(3);
    expect(boss.stages.map((stage) => stage.speciesId)).toEqual([
      "ouryumon",
      "alphamon",
      "alphamon_ouryuken"
    ]);
    expect(boss.stages[0].bonusStats.hp).toBeGreaterThan(800);
    expect(boss.stages[2].bonusStats.hp).toBeGreaterThan(boss.stages[1].bonusStats.hp);
    expect(boss.stages[1].transitionAnimation).toEqual(
      expect.objectContaining({
        heading: "DNA Digivolution",
        to: expect.objectContaining({ name: "Alphamon Ouryuken" })
      })
    );
  });
});
