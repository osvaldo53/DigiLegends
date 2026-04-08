import { state } from "../../core/state.js";
import { escapeHtml } from "../../core/utils.js";

/**
 * Card de uma hunt.
 *
 * Regras de bloqueio:
 * - bloqueada por nível insuficiente
 * - bloqueada se já existir uma hunt AFK em andamento
 */
export function renderHuntCard(hunt, playerLevel) {
  const lockedByLevel = playerLevel < hunt.minLevel;
  const lockedBySession = state.huntSession.active;
  const locked = lockedByLevel || lockedBySession;

  let label = "Iniciar hunt";
  if (lockedByLevel) label = "Bloqueada por nível";
  if (!lockedByLevel && lockedBySession) label = "Outra hunt em andamento";

  return `
    <article class="hunt-card">
      <h3>${escapeHtml(hunt.name)}</h3>
      <p>${escapeHtml(hunt.description)}</p>

      <div class="kv-list">
        <span>Nível mínimo recomendado: ${hunt.minLevel}</span>
        <span>Recompensa: ${escapeHtml(hunt.rewardLabel || `${hunt.rewards.bits} Bits / ${hunt.rewards.exp} EXP`)}</span>
      </div>

      <div class="button-row" style="margin-top:14px;">
        <button
          class="btn ${locked ? "btn-secondary" : "btn-primary"} js-start-hunt"
          data-hunt-id="${hunt.id}"
          ${locked ? "disabled" : ""}
        >
          ${label}
        </button>
      </div>
    </article>
  `;
}
