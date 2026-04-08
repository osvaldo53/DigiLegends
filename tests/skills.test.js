import { describe, expect, it } from "vitest";
import { getSkillById, getSkillsForSpecies } from "../js/data/skills.js";

describe("skills", () => {
  it("atribui skills ofensivas ao Omnimon", () => {
    const skillIds = getSkillsForSpecies("omnimon");

    expect(skillIds).toEqual(["grey_sword", "supreme_cannon"]);
    expect(getSkillById("grey_sword")?.kind).toBe("attack");
    expect(getSkillById("supreme_cannon")?.kind).toBe("attack");
  });
});
