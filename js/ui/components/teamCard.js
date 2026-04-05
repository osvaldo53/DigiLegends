import { getDigimonSpecies } from "../../data/digimons.js";
import { escapeHtml } from "../../core/utils.js";
import { getAvailableEvolutions } from "../../systems/evolutionSystem.js";

/**
 * Card colapsável do Digimon do time.
 *
 * Estado fechado:
 * - sprite
 * - nome
 * - nível
 *
 * Estado aberto:
 * - tipo
 * - elemento
 * - família
 * - bond
 * - HP/SP
 * - atributos finais
 * - EXP
 * - opções de evolução
 */
export function renderTeamCard(playerDigimon) {
  const species = getDigimonSpecies(playerDigimon.speciesId);

  if (!species) {
    return `
      <article class="team-card">
        <h3>Digimon inválido</h3>
      </article>
    `;
  }

  const displayName = playerDigimon.nickname?.trim() || species.name;
  const bond = Number(playerDigimon.bond ?? 0).toFixed(1);
  const evolutions = getAvailableEvolutions(playerDigimon);

  const evolutionSection = evolutions.length
    ? `
      <div class="team-evolution-section">
        <h4 class="team-evolution-section__title">Evoluções</h4>

        <div class="team-evolution-list">
          ${evolutions.map((evolution) => `
            <div class="team-evolution-item">
              <div class="team-evolution-item__info">
                <strong>${escapeHtml(evolution.targetSpecies.name)}</strong>
                <small>
                  Requisitos: Lv. ${evolution.requirements.minLevel} · Bond ${evolution.requirements.minBond}
                </small>
              </div>

              <button
                class="btn ${evolution.isAvailable ? "btn-primary" : "btn-secondary"} js-evolve-digimon"
                data-target-species-id="${escapeHtml(evolution.targetSpeciesId)}"
                data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
                ${evolution.isAvailable ? "" : "disabled"}
              >
                Evoluir
              </button>
            </div>
          `).join("")}
        </div>
      </div>
    `
    : `
      <div class="team-evolution-section">
        <h4 class="team-evolution-section__title">Evoluções</h4>
        <p class="empty-state">Nenhuma evolução disponível para esta espécie no momento.</p>
      </div>
    `;

  return `
    <details class="team-card team-card--collapsible">
      <summary class="team-card__summary">
        <img
          src="${escapeHtml(species.sprite || "")}"
          alt="${escapeHtml(species.name)}"
          onerror="this.style.display='none'"
        />

        <div class="team-card__summary-text">
          <h3>${escapeHtml(displayName)}</h3>
          <small>Lv. ${playerDigimon.level}</small>
        </div>

        <span class="team-card__chevron">⌄</span>
      </summary>

      <div class="team-card__details">
        <div class="team-meta-grid">
          <div class="team-meta-pill">
            <span class="team-meta-pill__label">Tipo</span>
            <span class="team-meta-pill__value">${escapeHtml(species.type)}</span>
          </div>

          <div class="team-meta-pill">
            <span class="team-meta-pill__label">Elemento</span>
            <span class="team-meta-pill__value">${escapeHtml(species.element)}</span>
          </div>

          <div class="team-meta-pill">
            <span class="team-meta-pill__label">Família</span>
            <span class="team-meta-pill__value">${escapeHtml(species.family)}</span>
          </div>

          <div class="team-meta-pill">
            <span class="team-meta-pill__label">Bond</span>
            <span class="team-meta-pill__value">${bond}/200</span>
          </div>
        </div>

        <div class="team-stat-grid">
          <div class="team-stat-item">
            <span class="team-stat-item__icon">❤</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">HP</span>
              <strong>${playerDigimon.currentHP}/${playerDigimon.finalStats.hp}</strong>
            </div>
          </div>

          <div class="team-stat-item">
            <span class="team-stat-item__icon">✦</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">SP</span>
              <strong>${playerDigimon.currentSP}/${playerDigimon.finalStats.sp}</strong>
            </div>
          </div>

          <div class="team-stat-item">
            <span class="team-stat-item__icon">⚔</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">ATK</span>
              <strong>${playerDigimon.finalStats.atk}</strong>
            </div>
          </div>

          <div class="team-stat-item">
            <span class="team-stat-item__icon">🛡</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">DEF</span>
              <strong>${playerDigimon.finalStats.def}</strong>
            </div>
          </div>

          <div class="team-stat-item">
            <span class="team-stat-item__icon">✧</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">INT</span>
              <strong>${playerDigimon.finalStats.int}</strong>
            </div>
          </div>

          <div class="team-stat-item">
            <span class="team-stat-item__icon">➤</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">SPD</span>
              <strong>${playerDigimon.finalStats.spd}</strong>
            </div>
          </div>

          <div class="team-stat-item team-stat-item--wide">
            <span class="team-stat-item__icon">⬆</span>
            <div class="team-stat-item__content">
              <span class="team-stat-item__label">EXP</span>
              <strong>${playerDigimon.exp}</strong>
            </div>
          </div>
        </div>

        ${evolutionSection}
      </div>
    </details>
  `;
}