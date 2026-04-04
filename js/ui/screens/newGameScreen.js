import { STARTER_IDS, getDigimonSpecies } from "../../data/digimons.js";
import { goToScreen } from "../../core/router.js";
import { startNewGame } from "../../systems/gameStartSystem.js";
import { renderStarterCard } from "../components/starterCard.js";

export function renderNewGameScreen() {
  const cards = STARTER_IDS
    .map((id) => getDigimonSpecies(id))
    .filter(Boolean)
    .map((species) => renderStarterCard(species))
    .join("");

  return `
    <section class="screen">
      <div class="panel new-game-panel">
        <h2>Novo jogo</h2>
        <p>Defina o nome do tamer e escolha seu primeiro Digimon.</p>

        <div class="field">
          <label class="label" for="playerName">Nome do jogador</label>
          <input class="input" id="playerName" type="text" maxlength="20" placeholder="Ex.: Takato" />
        </div>

        <div id="newGameFeedback" class="empty-state" style="margin-bottom: 14px;"></div>

        <div class="card-grid">
          ${cards}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-title">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindNewGameScreen() {
  document.getElementById("btn-back-title")?.addEventListener("click", () => {
    goToScreen("title");
  });

  document.querySelectorAll(".js-select-starter").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById("playerName");
      const feedback = document.getElementById("newGameFeedback");
      const playerName = input?.value || "";
      const starterSpeciesId = button.dataset.speciesId;

      try {
        startNewGame(playerName, starterSpeciesId);
        goToScreen("home");
      } catch (error) {
        if (feedback) {
          feedback.textContent = error.message || "Não foi possível iniciar o jogo.";
        }
      }
    });
  });
}
