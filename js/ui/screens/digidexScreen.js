import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getDigiDexEntries } from "../../systems/digidexSystem.js";
import { renderDexCard } from "../components/dexCard.js";

export function renderDigiDexScreen() {
  const entries = getDigiDexEntries(state.save)
    .map((entry) => renderDexCard(entry))
    .join("");

  return `
    <section class="screen">
      <div class="panel">
        <h2>DigiDex</h2>
        <p>Espécies vistas e capturadas no save local atual.</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Vistos: ${state.save.digidex.seen.length}</span>
          <span class="status-pill">Capturados: ${state.save.digidex.owned.length}</span>
        </div>

        <div class="card-grid">
          ${entries}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindDigiDexScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });
}
