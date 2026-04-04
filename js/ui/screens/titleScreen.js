import { goToScreen } from "../../core/router.js";
import { deleteSave, hasSave } from "../../core/saveManager.js";
import { renderApp } from "../renderApp.js";

export function renderTitleScreen() {
  const saveExists = hasSave();

  return `
    <section class="screen screen--centered">
      <div class="panel title-panel">
        <h1 class="game-title">DigiLegends</h1>
        <p class="subtitle">Protótipo reestruturado para navegador com progressão e save local.</p>

        <div class="button-row" style="justify-content:center;">
          <button class="btn btn-primary" id="btn-new-game">Novo jogo</button>
          ${saveExists ? '<button class="btn btn-secondary" id="btn-continue">Continuar</button>' : ""}
          ${saveExists ? '<button class="btn btn-danger" id="btn-delete-save">Apagar save</button>' : ""}
        </div>
      </div>
    </section>
  `;
}

export function bindTitleScreen() {
  document.getElementById("btn-new-game")?.addEventListener("click", () => {
    goToScreen("newGame");
  });

  document.getElementById("btn-continue")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-delete-save")?.addEventListener("click", () => {
    const confirmed = window.confirm("Deseja apagar o save atual?");
    if (!confirmed) return;

    deleteSave();
    renderApp();
  });
}
