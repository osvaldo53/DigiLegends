import { getDigimonSpecies } from "../../data/digimons.js";
import { getItemById } from "../../data/items.js";
import { escapeHtml } from "../../core/utils.js";
import { getAvailableEvolutions } from "../../systems/evolutionSystem.js";

function formatPartnerOption(partner) {
  const speciesName =
    getDigimonSpecies(partner.speciesId)?.name || partner.speciesId;
  const displayName = partner.nickname?.trim() || speciesName;

  return `${displayName} · Lv. ${partner.level} · Bond ${Number(partner.bond ?? 0).toFixed(1)}`;
}

function formatEvolutionRequirements(evolution) {
  if (evolution.requirements.type === "armor") {
    const requiredItem =
      getItemById(evolution.requirements.requiredItemId)?.name ||
      evolution.requirements.requiredItemId;
    const itemStatus = evolution.hasRequiredItem ? "Disponivel" : "Nao possui";

    return `Armor: Lv. ${evolution.requirements.minLevel} · Bond ${evolution.requirements.minBond} · ${requiredItem} (${itemStatus})`;
  }

  if (evolution.requirements.type !== "dna") {
    return `Requisitos: Lv. ${evolution.requirements.minLevel} · Bond ${evolution.requirements.minBond}`;
  }

  const partnerSpecies =
    getDigimonSpecies(evolution.requirements.partnerSpeciesId)?.name ||
    evolution.requirements.partnerSpeciesId;
  const partnerHint =
    evolution.dnaPartners.length > 0
      ? ` · Parceiros elegíveis: ${evolution.dnaPartners.length}`
      : "";

  return `DNA: Lv. ${evolution.requirements.minLevel} · Bond ${evolution.requirements.minBond} + ${partnerSpecies} Lv. ${evolution.requirements.partnerMinLevel} · Bond ${evolution.requirements.partnerMinBond}${partnerHint}`;
}

function renderEvolutionAction(playerDigimon, evolution) {
  const isDnaEvolution = evolution.requirements.type === "dna";

  if (!isDnaEvolution) {
    return `
      <button
        class="btn ${evolution.isAvailable ? "btn-primary" : "btn-secondary"} js-evolve-digimon"
        data-target-species-id="${escapeHtml(evolution.targetSpeciesId)}"
        data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
        ${evolution.isAvailable ? "" : "disabled"}
      >
        Evoluir
      </button>
    `;
  }

  const hasPartners = evolution.dnaPartners.length > 0;
  const selectId = `dna-partner-${playerDigimon.uid}-${evolution.targetSpeciesId}`;

  return `
    <div class="button-row">
      <select
        id="${escapeHtml(selectId)}"
        class="js-dna-partner-select"
        data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
        data-target-species-id="${escapeHtml(evolution.targetSpeciesId)}"
        ${hasPartners ? "" : "disabled"}
      >
        ${
          hasPartners
            ? evolution.dnaPartners
                .map(
                  (partner) => `
            <option value="${escapeHtml(partner.uid)}">
              ${escapeHtml(formatPartnerOption(partner))}
            </option>
          `
                )
                .join("")
            : '<option value="">Nenhum parceiro elegível</option>'
        }
      </select>

      <button
        class="btn ${evolution.isAvailable ? "btn-primary" : "btn-secondary"} js-evolve-digimon"
        data-target-species-id="${escapeHtml(evolution.targetSpeciesId)}"
        data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
        data-partner-select-id="${escapeHtml(selectId)}"
        ${evolution.isAvailable ? "" : "disabled"}
      >
        DNA Evolve
      </button>
    </div>
  `;
}

/**
 * Card colapsável de Digimon.
 *
 * Pode ser usado tanto para Digimons da party quanto do storage.
 *
 * Opções:
 * - context: "party" | "storage"
 * - isLeader: boolean
 * - save: object
 */
export function renderTeamCard(playerDigimon, options = {}) {
  const species = getDigimonSpecies(playerDigimon.speciesId);
  const context = options.context || "party";
  const isLeader = Boolean(options.isLeader);
  const save = options.save;
  const storageSelectionMode = Boolean(options.storageSelectionMode);
  const isSelectedForTrade = Boolean(options.isSelectedForTrade);

  if (!species) {
    return `
      <article class="team-card">
        <h3>Digimon inválido</h3>
      </article>
    `;
  }

  const displayName = playerDigimon.nickname?.trim() || species.name;
  const bond = Number(playerDigimon.bond ?? 0).toFixed(1);
  const evolutions = getAvailableEvolutions(playerDigimon, save);

  const leaderAction =
    context === "party"
      ? isLeader
        ? `
          <span class="status-pill">Líder</span>
        `
        : `
          <button
            class="btn btn-secondary js-set-party-leader"
            data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
          >
            Definir líder
          </button>
        `
      : "";

  const storageAction =
    context === "party"
      ? `
        <button
          class="btn btn-secondary js-send-to-storage"
          data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
        >
          Enviar ao Storage
        </button>
      `
      : `
        <button
          class="btn btn-secondary js-send-to-party"
          data-digimon-uid="${escapeHtml(playerDigimon.uid)}"
          ${storageSelectionMode ? "disabled" : ""}
        >
          Adicionar ao Time
        </button>
      `;

  const evolutionSection =
    evolutions.length
      ? `
        <div class="team-evolution-section">
          <h4 class="team-evolution-section__title">Evoluções</h4>

          <div class="team-evolution-list">
            ${evolutions
              .map(
                (evolution) => `
              <div class="team-evolution-item">
                <div class="team-evolution-item__info">
                  <strong>${escapeHtml(evolution.targetSpecies.name)}</strong>
                  <small>${escapeHtml(formatEvolutionRequirements(evolution))}</small>
                </div>

                ${renderEvolutionAction(playerDigimon, evolution)}
              </div>
            `
              )
              .join("")}
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
    <details class="team-card team-card--collapsible ${isSelectedForTrade ? "team-card--selected" : ""}">
      <summary
        class="team-card__summary ${storageSelectionMode ? "js-toggle-trade-selection-card" : ""}"
        ${storageSelectionMode ? `data-digimon-uid="${escapeHtml(playerDigimon.uid)}"` : ""}
      >
        <img
          src="${escapeHtml(species.sprite || "")}"
          alt="${escapeHtml(species.name)}"
          onerror="this.style.display='none'"
        />

        <div class="team-card__summary-text">
          <h3>${escapeHtml(displayName)}</h3>
          <small>Lv. ${playerDigimon.level}</small>
          ${
            storageSelectionMode
              ? `<small>${isSelectedForTrade ? "Selecionado para exclusao" : "Toque para selecionar"}</small>`
              : ""
          }
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

        <div class="button-row" style="margin-top:12px;">
          ${leaderAction}
          ${storageAction}
        </div>

        ${evolutionSection}
      </div>
    </details>
  `;
}
