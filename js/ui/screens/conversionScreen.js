import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { saveGame } from "../../core/saveManager.js";
import {
  getAllScannedSpecies,
  canConvertScan,
  convertScanToDigimon
} from "../../systems/scanSystem.js";
import { escapeHtml, clamp } from "../../core/utils.js";

/**
 * Renderiza uma barra visual simples de scan.
 *
 * @param {number} percent
 * @returns {string}
 */
function renderScanBar(percent) {
  const safePercent = clamp(percent, 0, 100);

  return `
    <div class="battle-stat">
      <div class="battle-stat__top">
        <span>Scan</span>
        <span>${percent}%</span>
      </div>
      <div class="battle-bar battle-bar--sp">
        <span style="width:${safePercent}%;"></span>
      </div>
    </div>
  `;
}

/**
 * Renderiza a tela de conversão.
 */
export function renderConversionScreen() {
  const scannedSpecies = getAllScannedSpecies(state.save);

  const content = scannedSpecies.length
    ? scannedSpecies
        .map((entry) => {
          const isReady = canConvertScan(state.save, entry.speciesId);

          return `
            <article class="hunt-session-box">
              <div style="display:flex; gap:12px; align-items:center;">
                <img
                  src="${escapeHtml(entry.species.sprite || "")}"
                  alt="${escapeHtml(entry.species.name)}"
                  style="width:64px; height:64px; object-fit:contain;"
                  onerror="this.style.display='none'"
                />

                <div style="min-width:0;">
                  <h3 style="margin-bottom:4px;">${escapeHtml(entry.species.name)}</h3>
                  <p class="hunt-session__muted" style="margin-bottom:0;">
                    Estágio: ${escapeHtml(entry.stage)}
                  </p>
                </div>
              </div>

              <div style="margin-top:12px;">
                ${renderScanBar(entry.percent)}
              </div>

              <div class="button-row" style="margin-top:12px;">
                <button
                  class="btn ${isReady ? "btn-primary" : "btn-secondary"} js-convert-scan"
                  data-species-id="${escapeHtml(entry.speciesId)}"
                  ${isReady ? "" : "disabled"}
                >
                  Converter
                </button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="empty-state">Você ainda não possui dados de scan acumulados.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <h2>Conversão</h2>
        <p>Converta dados de scan em novos Digimons quando atingir 100%.</p>

        <div id="conversionFeedback" class="hunt-action-banner" style="display:none; margin-bottom:16px;"></div>

        <div class="card-grid">
          ${content}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

/**
 * Eventos da tela de conversão.
 */
export function bindConversionScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-convert-scan").forEach((button) => {
    button.addEventListener("click", () => {
      const speciesId = button.dataset.speciesId;
      const feedback = document.getElementById("conversionFeedback");

      try {
        const result = convertScanToDigimon(state.save, speciesId);
        saveGame(state.save);

        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent =
            result.destination === "party"
              ? `${result.digimon.speciesId} convertido com sucesso e enviado para o time.`
              : `${result.digimon.speciesId} convertido com sucesso e enviado para o storage.`;
        }

        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = error.message || "Não foi possível converter este Digimon.";
        }
      }
    });
  });
}