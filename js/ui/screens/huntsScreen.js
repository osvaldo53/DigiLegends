import { HUNTS } from "../../data/encounters.js";
import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { startBattleFromHunt } from "../../systems/battleSystem.js";
import { renderHuntCard } from "../components/huntCard.js";

export function renderHuntsScreen() {
  const player = state.save.party[0];
  const playerLevel = player?.level || 1;

  const cards = HUNTS.map((hunt) => renderHuntCard(hunt, playerLevel)).join("");

  return `
    <section class="screen">
      <div class="panel">
        <h2>Hunts</h2>
        <p>Escolha uma área para procurar batalha. O primeiro Digimon do time é usado automaticamente.</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Nível atual do líder: ${playerLevel}</span>
          <span class="status-pill">Hunts concluídas: ${state.save.progress.huntsCompleted}</span>
        </div>

        <div class="card-grid">
          ${cards}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindHuntsScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-start-hunt").forEach((button) => {
    button.addEventListener("click", () => {
      const huntId = button.dataset.huntId;
      try {
        startBattleFromHunt(huntId);
        goToScreen("battle");
      } catch (error) {
        window.alert(error.message || "Não foi possível iniciar a hunt.");
      }
    });
  });
}
