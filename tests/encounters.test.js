import { describe, expect, it } from "vitest";
import { HUNTS, getHuntById } from "../js/data/encounters.js";

describe("encounters", () => {
  it("inclui os novos In-Training no campo de treino", () => {
    const hunt = getHuntById("training-grounds");

    expect(hunt.enemyPool).toEqual(
      expect.arrayContaining(["tanemon", "motimon", "bukamon", "yokomon", "demiveemon"])
    );
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

  it("mantem ids de hunt unicos", () => {
    const ids = HUNTS.map((hunt) => hunt.id);
    const uniqueIds = new Set(ids);

    expect(uniqueIds.size).toBe(ids.length);
  });
});
