import { describe, expect, it } from "vitest";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { renderTeamCard } from "../js/ui/components/teamCard.js";

describe("teamCard", () => {
  it("mostra as evolucoes para Digimons no storage", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      uid: "storage-agumon",
      level: 17,
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

  it("mostra botao de selecao em lote no storage quando o modo de exclusao esta ativo", () => {
    const save = createEmptySave();
    const agumon = createPlayerDigimon("agumon", {
      level: 10,
      bond: 5
    });

    save.storage = [agumon];

    const html = renderTeamCard(agumon, {
      context: "storage",
      save,
      storageSelectionMode: true,
      isSelectedForTrade: true
    });

    expect(html).toContain("Selecionado para exclusao");
    expect(html).toContain("team-card--selected");
    expect(html).toContain("js-toggle-trade-selection-card");
  });
});
