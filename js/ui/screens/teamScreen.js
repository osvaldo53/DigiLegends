import { state } from "../../core/state.js";
import { goToScreen } from "../../core/router.js";
import { saveGame } from "../../core/saveManager.js";
import { evolveDigimon } from "../../systems/evolutionSystem.js";
import { renderTeamCard } from "../components/teamCard.js";

export function renderTeamScreen() {
  const cards = state.save.party.length
    ? state.save.party.map((digimon) => renderTeamCard(digimon)).join("")
    : '<p class="empty-state">Seu time está vazio.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <div class="team-header">
          <h2>Time</h2>
          <p>Visualização do time com detalhes expansíveis e evolução manual.</p>
        </div>

        <div class="team-card-grid">
          ${cards}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindTeamScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-evolve-digimon").forEach((button) => {
    button.addEventListener("click", () => {
      const digimonUid = button.dataset.digimonUid;
      const targetSpeciesId = button.dataset.targetSpeciesId;

      const playerDigimon = state.save.party.find(
        (digimon) => digimon.uid === digimonUid
      );

      if (!playerDigimon) {
        window.alert("Não foi possível localizar o Digimon selecionado.");
        return;
      }

      try {
        evolveDigimon(playerDigimon, targetSpeciesId, state.save);
        saveGame(state.save);
        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        window.alert(error.message || "Não foi possível evoluir o Digimon.");
      }
    });
  });
}