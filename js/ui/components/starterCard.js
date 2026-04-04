import { escapeHtml } from "../../core/utils.js";

export function renderStarterCard(species) {
  const sprite = species.sprite || "";
  return `
    <article class="starter-card">
      <img src="${escapeHtml(sprite)}" alt="${escapeHtml(species.name)}" onerror="this.style.display='none'" />
      <h3>${escapeHtml(species.name)}</h3>
      <small>${escapeHtml(species.stage)} · ${escapeHtml(species.type)} · ${escapeHtml(species.attribute)}</small>
      <div class="stat-list">
        <span>HP: ${species.baseStats.hp}</span>
        <span>SP: ${species.baseStats.sp}</span>
        <span>ATK: ${species.baseStats.atk}</span>
        <span>DEF: ${species.baseStats.def}</span>
        <span>INT: ${species.baseStats.int}</span>
        <span>SPD: ${species.baseStats.spd}</span>
      </div>
      <button class="btn btn-primary js-select-starter" data-species-id="${escapeHtml(species.id)}">
        Escolher ${escapeHtml(species.name)}
      </button>
    </article>
  `;
}
