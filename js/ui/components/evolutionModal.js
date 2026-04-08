import { escapeHtml } from "../../core/utils.js";

function renderSourceChip(source) {
  if (!source) {
    return "";
  }

  return `
    <div class="evolution-modal__source">
      <span class="evolution-modal__source-label">${escapeHtml(source.label || "Base")}</span>
      <div class="evolution-modal__source-frame">
        <img
          src="${escapeHtml(source.sprite || "")}"
          alt="${escapeHtml(source.name || "Fonte de evolucao")}"
          class="evolution-modal__source-sprite"
          onerror="this.style.display='none'"
        />
      </div>
      <strong>${escapeHtml(source.name || "Desconhecido")}</strong>
    </div>
  `;
}

export function renderEvolutionModal(animation) {
  if (!animation?.from || !animation?.to) {
    return "";
  }

  const heading = animation.heading || "Evolucao realizada";
  const subheading =
    animation.subheading || `${animation.from.name} evoluiu para ${animation.to.name}`;

  return `
    <div class="evolution-modal" role="dialog" aria-modal="true" aria-labelledby="evolution-modal-title">
      <div class="evolution-modal__backdrop js-close-evolution-modal"></div>

      <div class="evolution-modal__content">
        <button
          type="button"
          class="evolution-modal__close js-close-evolution-modal"
          aria-label="Fechar animacao de evolucao"
        >
          ×
        </button>

        <span class="evolution-modal__eyebrow">Digivolution</span>
        <h3 id="evolution-modal-title">${escapeHtml(heading)}</h3>
        <p>${escapeHtml(subheading)}</p>

        <div class="evolution-modal__animation">
          ${
            Array.isArray(animation.sources) && animation.sources.length
              ? `
                <div class="evolution-modal__sources">
                  ${animation.sources.map((source) => renderSourceChip(source)).join("")}
                </div>
              `
              : ""
          }

          <div class="evolution-modal__core" aria-hidden="true">
            <span class="evolution-modal__charge evolution-modal__charge--a"></span>
            <span class="evolution-modal__charge evolution-modal__charge--b"></span>
            <span class="evolution-modal__charge evolution-modal__charge--c"></span>
            <span class="evolution-modal__spark evolution-modal__spark--1"></span>
            <span class="evolution-modal__spark evolution-modal__spark--2"></span>
            <span class="evolution-modal__spark evolution-modal__spark--3"></span>
            <span class="evolution-modal__spark evolution-modal__spark--4"></span>

            <div class="evolution-modal__sprite-frame">
              <img
                src="${escapeHtml(animation.from.sprite || "")}"
                alt="${escapeHtml(animation.from.name || "Digimon atual")}"
                class="evolution-modal__sprite evolution-modal__sprite--from"
                onerror="this.style.display='none'"
              />
              <img
                src="${escapeHtml(animation.to.sprite || "")}"
                alt="${escapeHtml(animation.to.name || "Digimon evoluido")}"
                class="evolution-modal__sprite evolution-modal__sprite--to"
                onerror="this.style.display='none'"
              />
            </div>
          </div>

          <div class="evolution-modal__names">
            <span class="evolution-modal__name evolution-modal__name--from">
              ${escapeHtml(animation.from.name)}
            </span>
            <span class="evolution-modal__arrow">→</span>
            <span class="evolution-modal__name evolution-modal__name--to">
              ${escapeHtml(animation.to.name)}
            </span>
          </div>
        </div>
      </div>
    </div>
  `;
}
