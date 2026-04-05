import { escapeHtml } from "../../core/utils.js";

/**
 * Renderiza um card da DigiDex.
 *
 * Estados possíveis:
 * - unknown (não visto)
 * - seen (visto)
 * - owned (capturado)
 *
 * Campos exibidos:
 * - name
 * - type
 * - element
 * - family
 */
export function renderDexCard(entry) {
  const status = entry.owned
    ? "Capturado"
    : entry.seen
      ? "Visto"
      : "Desconhecido";

  /**
   * Classe dinâmica para estilo visual do card
   */
  const cardClass = entry.owned
    ? "dex-card owned"
    : entry.seen
      ? "dex-card seen"
      : "dex-card unknown";

  return `
    <article class="${cardClass}">
      <img
        src="${entry.seen ? escapeHtml(entry.sprite || "") : ""}"
        alt="${escapeHtml(entry.name)}"
        onerror="this.style.display='none'"
      />

      <h3>
        ${entry.seen ? escapeHtml(entry.name) : "???"}
      </h3>

      <div class="stat-list">
        <span>Status: ${status}</span>

        <span>
          Tipo: ${entry.seen ? escapeHtml(entry.type) : "???"}
        </span>

        <span>
          Elemento: ${entry.seen ? escapeHtml(entry.element) : "???"}
        </span>

        <span>
          Família: ${entry.seen ? escapeHtml(entry.family) : "???"}
        </span>
      </div>
    </article>
  `;
}