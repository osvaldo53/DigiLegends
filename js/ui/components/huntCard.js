import { escapeHtml } from "../../core/utils.js";

export function renderHuntCard(hunt, playerLevel) {
  const locked = playerLevel < hunt.minLevel;

  return `
    <article class="hunt-card">
      <h3>${escapeHtml(hunt.name)}</h3>
      <p>${escapeHtml(hunt.description)}</p>
      <div class="kv-list">
        <span>Nível mínimo recomendado: ${hunt.minLevel}</span>
        <span>Recompensa: ${hunt.rewards.bits} Bits / ${hunt.rewards.exp} EXP</span>
      </div>
      <div class="button-row" style="margin-top:14px;">
        <button class="btn ${locked ? "btn-secondary" : "btn-primary"} js-start-hunt" data-hunt-id="${hunt.id}" ${locked ? "disabled" : ""}>
          ${locked ? "Bloqueada" : "Iniciar batalha"}
        </button>
      </div>
    </article>
  `;
}
