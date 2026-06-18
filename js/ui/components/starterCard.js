import { escapeHtml } from "../../core/utils.js";

export function renderStarterCard(species) {
  const sprite = species.sprite || "";
  const stats = [
    ["HP", species.baseStats.hp],
    ["SP", species.baseStats.sp],
    ["ATK", species.baseStats.atk],
    ["DEF", species.baseStats.def],
    ["INT", species.baseStats.int],
    ["SPD", species.baseStats.spd]
  ];

  return `
    <article class="starter-card">
      <div class="starter-card__media">
        <img src="${escapeHtml(sprite)}" alt="${escapeHtml(species.name)}" onerror="this.style.display='none'" />
      </div>
      <h3>${escapeHtml(species.name)}</h3>
      <small>${escapeHtml(species.stage)} - ${escapeHtml(species.type)} - ${escapeHtml(species.attribute)}</small>
      <div class="stat-list">
        ${stats.map(([label, value]) => `<span>${label}: ${value}</span>`).join("")}
      </div>
      <button class="btn btn-primary js-select-starter" data-species-id="${escapeHtml(species.id)}">
        Escolher ${escapeHtml(species.name)}
      </button>
    </article>
  `;
}
