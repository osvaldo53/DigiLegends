import { getDigimonSpecies } from "../../data/digimons.js";
import { escapeHtml } from "../../core/utils.js";

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

  return `
    <article class="team-card">
      <img src="${escapeHtml(species.sprite || "")}" alt="${escapeHtml(species.name)}" onerror="this.style.display='none'" />
      <h3>${escapeHtml(displayName)}</h3>
      <small>${escapeHtml(species.name)} · ${escapeHtml(species.stage)} · Lv. ${playerDigimon.level}</small>
      <div class="stat-list">
        <span>HP: ${playerDigimon.currentHP}/${playerDigimon.finalStats.hp}</span>
        <span>SP: ${playerDigimon.currentSP}/${playerDigimon.finalStats.sp}</span>
        <span>ATK: ${playerDigimon.finalStats.atk}</span>
        <span>DEF: ${playerDigimon.finalStats.def}</span>
        <span>INT: ${playerDigimon.finalStats.int}</span>
        <span>SPD: ${playerDigimon.finalStats.spd}</span>
        <span>EXP atual: ${playerDigimon.exp}</span>
      </div>
    </article>
  `;
}
