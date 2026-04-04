import { escapeHtml } from "../../core/utils.js";

export function renderDexCard(entry) {
  const status = entry.owned ? "Capturado" : entry.seen ? "Visto" : "Desconhecido";

  return `
    <article class="dex-card">
      <img src="${entry.seen ? escapeHtml(entry.sprite || "") : ""}" alt="${escapeHtml(entry.name)}" onerror="this.style.display='none'" />
      <h3>${entry.seen ? escapeHtml(entry.name) : "???"}</h3>
      <div class="stat-list">
        <span>Status: ${status}</span>
        <span>Stage: ${entry.seen ? escapeHtml(entry.stage) : "???"}</span>
        <span>Type: ${entry.seen ? escapeHtml(entry.type) : "???"}</span>
        <span>Attribute: ${entry.seen ? escapeHtml(entry.attribute) : "???"}</span>
      </div>
    </article>
  `;
}
