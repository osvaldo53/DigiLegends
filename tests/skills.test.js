import { describe, expect, it } from "vitest";
import { getSkillById, getSkillsForSpecies } from "../js/data/skills.js";

describe("skills", () => {
  it("atribui skills ofensivas ao Omnimon", () => {
    const skillIds = getSkillsForSpecies("omnimon");

    expect(skillIds).toEqual(["grey_sword", "supreme_cannon"]);
    expect(getSkillById("grey_sword")?.kind).toBe("attack");
    expect(getSkillById("supreme_cannon")?.kind).toBe("attack");
  });

  it("atribui skills ofensivas ao Alphamon Ouryuken", () => {
    const skillIds = getSkillsForSpecies("alphamon_ouryuken");

    expect(skillIds).toEqual(["ouryu_seiken", "alpha_inforce"]);
    expect(getSkillById("ouryu_seiken")?.kind).toBe("attack");
    expect(getSkillById("alpha_inforce")?.kind).toBe("attack");
  });

  it("atribui a Mastemon pelo menos um ataque Light e um ataque Dark", () => {
    const skillIds = getSkillsForSpecies("mastemon");
    const skillElements = skillIds.map((skillId) => getSkillById(skillId)?.element);

    expect(skillIds).toEqual([
      "chaos_degradation",
      "dark_prominence",
      "greater_heal"
    ]);
    expect(skillElements).toContain("Light");
    expect(skillElements).toContain("Dark");
  });
});
