import { getDigimonSpecies } from "../../data/digimons.js";
import { state } from "../../core/state.js";
import { escapeHtml } from "../../core/utils.js";

export function renderHuntCard(hunt, playerLevel) {
  const lockedByLevel = playerLevel < hunt.minLevel;
  const lockedBySession = state.huntSession.active;
  const locked = lockedByLevel || lockedBySession;

  let label = "Iniciar hunt";
  if (lockedByLevel) label = "Bloqueada por nivel";
  if (!lockedByLevel && lockedBySession) label = "Outra hunt em andamento";

  const enemyNames = (hunt.enemyPool || [])
    .map((entry) => {
      const speciesId = typeof entry === "string" ? entry : entry.speciesId;
      return getDigimonSpecies(speciesId)?.name || speciesId;
    })
    .filter(Boolean);
  const levelRangeLabel = hunt.levelRange
    ? `${hunt.levelRange.min}-${hunt.levelRange.max}`
    : `${hunt.minLevel}-${hunt.minLevel + 2}`;

  return `
    <article class="hunt-card">
      <h3>${escapeHtml(hunt.name)}</h3>
      <p>${escapeHtml(hunt.description)}</p>

      <div class="kv-list">
        <span>Estagio: ${escapeHtml(hunt.stageLabel || "Hunt")}</span>
        <span>Nivel minimo recomendado: ${hunt.minLevel}</span>
        <span>Faixa de nivel inimiga: ${levelRangeLabel}</span>
        <span>Recompensa: ${escapeHtml(hunt.rewardLabel || `${hunt.rewards.bits} Bits / ${hunt.rewards.exp} EXP`)}</span>
      </div>

      <div class="hunt-card__enemy-list" aria-label="Digimons desta hunt">
        ${enemyNames
          .map((name) => `<span class="hunt-card__enemy-pill">${escapeHtml(name)}</span>`)
          .join("")}
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
