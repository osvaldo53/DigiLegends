import { state } from "../../core/state.js";
import { goToScreen } from "../../core/router.js";
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
          <p>Visualização do time usando dados da instância do Digimon.</p>
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

export function bindTeamScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });
}
