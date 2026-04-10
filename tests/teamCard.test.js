import { describe, expect, it } from "vitest";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { renderTeamCard } from "../js/ui/components/teamCard.js";

describe("teamCard", () => {
  it("mostra as evolucoes para Digimons no storage", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      uid: "storage-agumon",
      level: 10,
      bond: 5
    });

    save.storage = [agumon];

    const html = renderTeamCard(agumon, {
      context: "storage",
      save
    });

    expect(html).toContain("Evolu");
    expect(html).toContain("greymon");
    expect(html).toContain("geogreymon");
    expect(html).toContain('class="btn btn-primary js-evolve-digimon"');
    expect(html).toContain(`data-digimon-uid="${agumon.uid}"`);
  });
});
