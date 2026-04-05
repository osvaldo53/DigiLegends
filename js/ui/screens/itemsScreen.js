import { state } from "../../core/state.js";
import { goToScreen } from "../../core/router.js";
import { saveGame } from "../../core/saveManager.js";
import { getItemById } from "../../data/items.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { useItemOnDigimon } from "../../systems/itemSystem.js";
import { escapeHtml } from "../../core/utils.js";

/**
 * Renderiza a tela de itens.
 *
 * Nesta primeira versão:
 * - o alvo é sempre o primeiro Digimon do time
 * - isso simplifica o fluxo e reduz complexidade de UI
 */
export function renderItemsScreen() {
  const leader = state.save.party[0];
  const leaderSpecies = leader ? getDigimonSpecies(leader.speciesId) : null;

  const inventoryHtml = state.save.inventory.length
    ? state.save.inventory
        .map((entry) => {
          const item = getItemById(entry.itemId);
          if (!item) return "";

          return `
            <article class="hunt-session-box">
              <h3>${escapeHtml(item.name)}</h3>
              <p class="hunt-session__muted">${escapeHtml(item.description)}</p>
              <p>Quantidade: ${entry.quantity}</p>

              <div class="button-row" style="margin-top:12px;">
                <button
                  class="btn btn-primary js-use-item"
                  data-item-id="${escapeHtml(item.id)}"
                  ${leader ? "" : "disabled"}
                >
                  Usar no líder
                </button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="hunt-session__muted">Seu inventário está vazio.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <h2>Itens</h2>
        <p>Use itens no Digimon líder do time.</p>

        ${
          leader
            ? `
              <div class="hunt-session-box" style="margin-bottom:16px;">
                <h3>Alvo atual</h3>
                <p>${escapeHtml(leaderSpecies?.name || "Digimon")} · Lv. ${leader.level}</p>
                <p>HP: ${leader.currentHP}/${leader.finalStats.hp}</p>
                <p>SP: ${leader.currentSP}/${leader.finalStats.sp}</p>
              </div>
            `
            : `
              <div class="hunt-session-box" style="margin-bottom:16px;">
                <p class="hunt-session__muted">Você não possui Digimon no time.</p>
              </div>
            `
        }

        <div id="itemsFeedback" class="hunt-action-banner" style="display:none; margin-bottom:16px;"></div>

        <div class="card-grid">
          ${inventoryHtml}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

/**
 * Eventos da tela de itens.
 */
export function bindItemsScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-use-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const feedback = document.getElementById("itemsFeedback");
      const targetDigimon = state.save.party[0];

      if (!targetDigimon) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = "Não há Digimon no time para receber o item.";
        }
        return;
      }

      try {
        const result = useItemOnDigimon({
          save: state.save,
          itemId,
          targetDigimon,
          context: "menu"
        });

        saveGame(state.save);

        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = `${result.item.name} usado com sucesso em ${getDigimonSpecies(targetDigimon.speciesId)?.name || "Digimon"}.`;
        }

        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = error.message || "Não foi possível usar o item.";
        }
      }
    });
  });
}