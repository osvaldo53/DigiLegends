import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getAllDigimonSpecies, getDigimonSpecies } from "../../data/digimons.js";
import { getScanRule } from "../../data/scanRules.js";
import { getSkillById, getSkillsForSpecies } from "../../data/skills.js";
import { escapeHtml } from "../../core/utils.js";

const digidexViewState = {
  search: "",
  statusFilter: "all",
  stageFilter: "all",
  typeFilter: "all",
  elementFilter: "all",
  familyFilter: "all",
  detailSpeciesId: null,
  filtersOpen: false
};

function buildDexEntries(save) {
  const seen = new Set(save.digidex.seen || []);
  const owned = new Set(save.digidex.owned || []);

  return getAllDigimonSpecies()
    .map((species) => {
      const scanRule = getScanRule(species.id);

      return {
        ...species,
        stage: scanRule.stage,
        scanPercent: Number(save.scanData?.[species.id] ?? 0),
        seen: seen.has(species.id),
        owned: owned.has(species.id)
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function getUniqueValues(entries, key) {
  return [...new Set(entries.map((entry) => entry[key]).filter(Boolean))].sort();
}

function getCompletionPercent(entries) {
  if (!entries.length) {
    return 0;
  }

  const ownedCount = entries.filter((entry) => entry.owned).length;
  return Math.floor((ownedCount / entries.length) * 100);
}

function filterEntries(entries) {
  return entries.filter((entry) => {
    const matchesSearch =
      !digidexViewState.search ||
      entry.name.toLowerCase().includes(digidexViewState.search.toLowerCase()) ||
      entry.id.toLowerCase().includes(digidexViewState.search.toLowerCase());

    const matchesStatus =
      digidexViewState.statusFilter === "all" ||
      (digidexViewState.statusFilter === "seen" && entry.seen) ||
      (digidexViewState.statusFilter === "owned" && entry.owned) ||
      (digidexViewState.statusFilter === "unknown" && !entry.seen);

    const matchesStage =
      digidexViewState.stageFilter === "all" ||
      entry.stage === digidexViewState.stageFilter;

    const matchesType =
      digidexViewState.typeFilter === "all" ||
      entry.type === digidexViewState.typeFilter;

    const matchesElement =
      digidexViewState.elementFilter === "all" ||
      entry.element === digidexViewState.elementFilter;

    const matchesFamily =
      digidexViewState.familyFilter === "all" ||
      entry.family === digidexViewState.familyFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStage &&
      matchesType &&
      matchesElement &&
      matchesFamily
    );
  });
}

function getStatusLabel(entry) {
  if (entry.owned) {
    return "Owned";
  }

  if (entry.seen) {
    return "Seen";
  }

  return "Unknown";
}

function getDexCardClass(entry) {
  if (entry.owned) {
    return "digidex-card digidex-card--owned";
  }

  if (entry.seen) {
    return "digidex-card digidex-card--seen";
  }

  return "digidex-card digidex-card--unknown";
}

function renderDexCard(entry) {
  return `
    <button
      class="${getDexCardClass(entry)} js-open-dex-detail"
      data-species-id="${escapeHtml(entry.id)}"
    >
      <div class="digidex-card__media">
        ${
          entry.seen
            ? `
              <img
                src="${escapeHtml(entry.sprite || "")}"
                alt="${escapeHtml(entry.name)}"
                onerror="this.style.display='none'"
              />
            `
            : `<div class="digidex-card__silhouette">?</div>`
        }
      </div>

      <div class="digidex-card__body">
        <div class="digidex-card__topline">
          <span class="status-pill">${escapeHtml(getStatusLabel(entry))}</span>
          <span class="status-pill">${escapeHtml(entry.stage || "Unknown")}</span>
        </div>

        <h3>${entry.seen ? escapeHtml(entry.name) : "???"}</h3>

        <div class="digidex-card__meta">
          <span>${entry.seen ? escapeHtml(entry.type) : "???"}</span>
          <span>${entry.seen ? escapeHtml(entry.element) : "???"}</span>
        </div>

        <p class="digidex-card__family">
          ${entry.seen ? escapeHtml(entry.family) : "Familia desconhecida"}
        </p>

        <div class="digidex-card__footer">
          <span>Scan: ${entry.scanPercent}%</span>
        </div>
      </div>
    </button>
  `;
}

function getPreviousSpeciesIds(speciesId, allEntries) {
  return allEntries
    .filter((entry) => Array.isArray(entry.evolutions) && entry.evolutions.includes(speciesId))
    .map((entry) => entry.id);
}

function renderEvolutionChain(speciesId, allEntries) {
  const previousSpeciesIds = getPreviousSpeciesIds(speciesId, allEntries);
  const currentSpecies = getDigimonSpecies(speciesId);
  const nextSpeciesIds = currentSpecies?.evolutions || [];
  const chainIds = [...previousSpeciesIds, speciesId, ...nextSpeciesIds];

  return `
    <div class="digidex-detail__evolution-chain">
      ${chainIds
        .map((chainSpeciesId) => {
          const species = getDigimonSpecies(chainSpeciesId);
          const isCurrent = chainSpeciesId === speciesId;

          if (!species) {
            return "";
          }

          return `
            <div class="digidex-detail__evolution-node ${isCurrent ? "digidex-detail__evolution-node--current" : ""}">
              <span>${escapeHtml(species.name)}</span>
            </div>
          `;
        })
        .join('<span class="digidex-detail__evolution-arrow">→</span>')}
    </div>
  `;
}

function buildDexEntryMap(allEntries) {
  return new Map(allEntries.map((entry) => [entry.id, entry]));
}

function buildPreviousSpeciesMap(allEntries) {
  const previousMap = new Map();

  allEntries.forEach((entry) => {
    if (!Array.isArray(entry.evolutions)) {
      return;
    }

    entry.evolutions.forEach((evolutionId) => {
      const previousSpeciesIds = previousMap.get(evolutionId) || [];
      previousSpeciesIds.push(entry.id);
      previousMap.set(evolutionId, previousSpeciesIds);
    });
  });

  return previousMap;
}

function buildEvolutionPathsToRoots(speciesId, previousMap, path = []) {
  if (path.includes(speciesId)) {
    return [[speciesId]];
  }

  const previousSpeciesIds = previousMap.get(speciesId) || [];

  if (!previousSpeciesIds.length) {
    return [[speciesId]];
  }

  return previousSpeciesIds.flatMap((previousSpeciesId) =>
    buildEvolutionPathsToRoots(previousSpeciesId, previousMap, [...path, speciesId]).map((rootPath) => [
      ...rootPath,
      speciesId
    ])
  );
}

function buildEvolutionPathsToLeaves(speciesId, speciesMap, path = []) {
  if (path.includes(speciesId)) {
    return [[speciesId]];
  }

  const species = speciesMap.get(speciesId);
  const nextSpeciesIds = Array.isArray(species?.evolutions) ? species.evolutions : [];

  if (!nextSpeciesIds.length) {
    return [[speciesId]];
  }

  return nextSpeciesIds.flatMap((nextSpeciesId) =>
    buildEvolutionPathsToLeaves(nextSpeciesId, speciesMap, [...path, speciesId]).map((leafPath) => [
      speciesId,
      ...leafPath
    ])
  );
}

function buildFullEvolutionLines(speciesId, allEntries) {
  const speciesMap = buildDexEntryMap(allEntries);
  const previousMap = buildPreviousSpeciesMap(allEntries);
  const rootPaths = buildEvolutionPathsToRoots(speciesId, previousMap);
  const leafPaths = buildEvolutionPathsToLeaves(speciesId, speciesMap);
  const uniqueLines = new Map();

  rootPaths.forEach((rootPath) => {
    leafPaths.forEach((leafPath) => {
      const fullLine = [...rootPath, ...leafPath.slice(1)];
      uniqueLines.set(JSON.stringify(fullLine), fullLine);
    });
  });

  return [...uniqueLines.values()];
}

function renderFullEvolutionNode(speciesId, allEntries, currentSpeciesId) {
  const entry = allEntries.find((item) => item.id === speciesId);
  const isCurrent = speciesId === currentSpeciesId;
  const isKnown = Boolean(entry?.seen || entry?.owned);
  const displayName = isKnown ? entry.name : "???";
  const displayStage = isKnown ? entry.stage || "Desconhecido" : "Nao descoberto";

  return `
    <div class="digidex-detail__evolution-node ${isCurrent ? "digidex-detail__evolution-node--current" : ""} ${isKnown ? "" : "digidex-detail__evolution-node--hidden"}">
      <strong>${escapeHtml(displayName)}</strong>
      <small>${escapeHtml(displayStage)}</small>
    </div>
  `;
}

function renderFullEvolutionChain(speciesId, allEntries) {
  const evolutionLines = buildFullEvolutionLines(speciesId, allEntries);

  return `
    <div class="digidex-detail__evolution-lines">
      ${evolutionLines
        .map(
          (line) => `
            <div class="digidex-detail__evolution-chain">
              ${line
                .map((lineSpeciesId) => renderFullEvolutionNode(lineSpeciesId, allEntries, speciesId))
                .join('<span class="digidex-detail__evolution-arrow">→</span>')}
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderDetailModal(allEntries) {
  if (!digidexViewState.detailSpeciesId) {
    return "";
  }

  const entry = allEntries.find((item) => item.id === digidexViewState.detailSpeciesId);

  if (!entry) {
    return "";
  }

  const skills = getSkillsForSpecies(entry.id)
    .map((skillId) => getSkillById(skillId))
    .filter(Boolean);

  return `
    <div class="digidex-detail-modal">
      <div class="digidex-detail-modal__backdrop js-close-dex-detail"></div>

      <div class="digidex-detail-modal__content">
        <button class="digidex-detail-modal__close js-close-dex-detail">×</button>

        <div class="digidex-detail">
          <div class="digidex-detail__hero">
            <div class="digidex-detail__sprite-frame">
              ${
                entry.seen
                  ? `
                    <img
                      src="${escapeHtml(entry.sprite || "")}"
                      alt="${escapeHtml(entry.name)}"
                      onerror="this.style.display='none'"
                    />
                  `
                  : `<div class="digidex-card__silhouette">?</div>`
              }
            </div>

            <div class="digidex-detail__hero-copy">
              <div class="button-row">
                <span class="status-pill">${escapeHtml(getStatusLabel(entry))}</span>
                <span class="status-pill">${escapeHtml(entry.stage || "Unknown")}</span>
              </div>
              <h3>${entry.seen ? escapeHtml(entry.name) : "???"}</h3>
              <p>${entry.seen ? escapeHtml(entry.family) : "Dados insuficientes para esta especie."}</p>
              <div class="button-row">
                <span class="status-pill">Tipo: ${entry.seen ? escapeHtml(entry.type) : "???"}</span>
                <span class="status-pill">Elemento: ${entry.seen ? escapeHtml(entry.element) : "???"}</span>
                <span class="status-pill">Scan: ${entry.scanPercent}%</span>
              </div>
            </div>
          </div>

          <div class="digidex-detail__section">
            <h4>Linha evolutiva</h4>
            ${renderFullEvolutionChain(entry.id, allEntries)}
          </div>

          <div class="digidex-detail__section">
            <h4>Atributos base</h4>
            <div class="digidex-detail__stats">
              <span>HP ${entry.baseStats?.hp ?? "?"}</span>
              <span>SP ${entry.baseStats?.sp ?? "?"}</span>
              <span>ATK ${entry.baseStats?.atk ?? "?"}</span>
              <span>DEF ${entry.baseStats?.def ?? "?"}</span>
              <span>INT ${entry.baseStats?.int ?? "?"}</span>
              <span>SPD ${entry.baseStats?.spd ?? "?"}</span>
            </div>
          </div>

          <div class="digidex-detail__section">
            <h4>Skills principais</h4>
            ${
              skills.length
                ? `
                  <div class="digidex-detail__skills">
                    ${skills
                      .map(
                        (skill) => `
                          <div class="digidex-detail__skill">
                            <strong>${escapeHtml(skill.name)}</strong>
                            <span>${escapeHtml(skill.kind)} · ${escapeHtml(skill.element || "Support")}</span>
                          </div>
                        `
                      )
                      .join("")}
                  </div>
                `
                : '<p class="empty-state">Nenhuma skill cadastrada para esta especie.</p>'
            }
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderFilterModal(allEntries) {
  if (!digidexViewState.filtersOpen) {
    return "";
  }

  const typeOptions = getUniqueValues(allEntries, "type");
  const elementOptions = getUniqueValues(allEntries, "element");
  const familyOptions = getUniqueValues(allEntries, "family");

  return `
    <div class="digidex-detail-modal">
      <div class="digidex-detail-modal__backdrop js-close-dex-filters"></div>

      <div class="digidex-detail-modal__content">
        <button class="digidex-detail-modal__close js-close-dex-filters">×</button>
        <div class="digidex-detail">
          <div class="digidex-detail__section">
            <h4>Filtros</h4>
            <div class="digidex-filters-grid">
              <div class="hunt-session-box">
                <label class="label" for="digidex-status-filter">Status</label>
                <select class="input" id="digidex-status-filter">
                  <option value="all" ${digidexViewState.statusFilter === "all" ? "selected" : ""}>Todos</option>
                  <option value="seen" ${digidexViewState.statusFilter === "seen" ? "selected" : ""}>Seen</option>
                  <option value="owned" ${digidexViewState.statusFilter === "owned" ? "selected" : ""}>Owned</option>
                  <option value="unknown" ${digidexViewState.statusFilter === "unknown" ? "selected" : ""}>Unknown</option>
                </select>
              </div>

              <div class="hunt-session-box">
                <label class="label" for="digidex-type-filter">Tipo</label>
                <select class="input" id="digidex-type-filter">
                  <option value="all">Todos</option>
                  ${typeOptions
                    .map(
                      (type) => `
                        <option value="${escapeHtml(type)}" ${digidexViewState.typeFilter === type ? "selected" : ""}>
                          ${escapeHtml(type)}
                        </option>
                      `
                    )
                    .join("")}
                </select>
              </div>

              <div class="hunt-session-box">
                <label class="label" for="digidex-element-filter">Elemento</label>
                <select class="input" id="digidex-element-filter">
                  <option value="all">Todos</option>
                  ${elementOptions
                    .map(
                      (element) => `
                        <option value="${escapeHtml(element)}" ${digidexViewState.elementFilter === element ? "selected" : ""}>
                          ${escapeHtml(element)}
                        </option>
                      `
                    )
                    .join("")}
                </select>
              </div>

              <div class="hunt-session-box">
                <label class="label" for="digidex-family-filter">Familia</label>
                <select class="input" id="digidex-family-filter">
                  <option value="all">Todas</option>
                  ${familyOptions
                    .map(
                      (family) => `
                        <option value="${escapeHtml(family)}" ${digidexViewState.familyFilter === family ? "selected" : ""}>
                          ${escapeHtml(family)}
                        </option>
                      `
                    )
                    .join("")}
                </select>
              </div>
            </div>
          </div>

          <div class="button-row">
            <button class="btn btn-secondary" id="btn-clear-digidex-filters">Limpar filtros</button>
            <button class="btn btn-primary js-close-dex-filters">Aplicar</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function clearFilters() {
  digidexViewState.search = "";
  digidexViewState.statusFilter = "all";
  digidexViewState.stageFilter = "all";
  digidexViewState.typeFilter = "all";
  digidexViewState.elementFilter = "all";
  digidexViewState.familyFilter = "all";
}

export function renderDigiDexScreen() {
  const allEntries = buildDexEntries(state.save);
  const filteredEntries = filterEntries(allEntries);
  const stageOptions = getUniqueValues(allEntries, "stage");
  const completionPercent = getCompletionPercent(allEntries);

  return `
    <section class="screen">
      <div class="panel">
        <div class="digidex-header">
          <div>
            <h2>DigiDex</h2>
            <p>Seu compendio de especies vistas, obtidas e suas linhas evolutivas.</p>
          </div>

          <div class="digidex-summary">
            <div class="digidex-summary__item">
              <strong>${state.save.digidex.seen.length}</strong>
              <span>Vistos</span>
            </div>
            <div class="digidex-summary__item">
              <strong>${state.save.digidex.owned.length}</strong>
              <span>Obtidos</span>
            </div>
            <div class="digidex-summary__item">
              <strong>${completionPercent}%</strong>
              <span>Conclusao</span>
            </div>
          </div>
        </div>

        <div class="field">
          <label class="label" for="digidex-search">Buscar por nome</label>
          <input
            class="input"
            id="digidex-search"
            type="text"
            placeholder="Ex.: Agumon"
            value="${escapeHtml(digidexViewState.search)}"
          />
        </div>

        <div class="digidex-stage-pills">
          <button class="status-pill ${digidexViewState.stageFilter === "all" ? "status-pill--active" : ""} js-digidex-stage-filter" data-stage="all">Todos</button>
          ${stageOptions
            .map(
              (stage) => `
                <button
                  class="status-pill ${digidexViewState.stageFilter === stage ? "status-pill--active" : ""} js-digidex-stage-filter"
                  data-stage="${escapeHtml(stage)}"
                >
                  ${escapeHtml(stage)}
                </button>
              `
            )
            .join("")}
        </div>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Resultados: ${filteredEntries.length}</span>
          <button class="btn btn-secondary" id="btn-open-dex-filters">Filtro</button>
        </div>

        <div class="digidex-grid">
          ${
            filteredEntries.length
              ? filteredEntries.map((entry) => renderDexCard(entry)).join("")
              : '<p class="empty-state">Nenhum Digimon encontrado com os filtros atuais.</p>'
          }
        </div>

        <div class="button-row" style="margin-top: 18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>

      ${renderDetailModal(allEntries)}
      ${renderFilterModal(allEntries)}
    </section>
  `;
}

export function bindDigiDexScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    digidexViewState.detailSpeciesId = null;
    goToScreen("home");
  });

  document.getElementById("btn-clear-digidex-filters")?.addEventListener("click", () => {
    clearFilters();
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("btn-open-dex-filters")?.addEventListener("click", () => {
    digidexViewState.filtersOpen = true;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.querySelectorAll(".js-close-dex-filters").forEach((button) => {
    button.addEventListener("click", () => {
      digidexViewState.filtersOpen = false;
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.getElementById("digidex-search")?.addEventListener("input", (event) => {
    digidexViewState.search = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digidex-status-filter")?.addEventListener("change", (event) => {
    digidexViewState.statusFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digidex-type-filter")?.addEventListener("change", (event) => {
    digidexViewState.typeFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digidex-element-filter")?.addEventListener("change", (event) => {
    digidexViewState.elementFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digidex-family-filter")?.addEventListener("change", (event) => {
    digidexViewState.familyFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.querySelectorAll(".js-digidex-stage-filter").forEach((button) => {
    button.addEventListener("click", () => {
      digidexViewState.stageFilter = button.dataset.stage || "all";
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.querySelectorAll(".js-open-dex-detail").forEach((button) => {
    button.addEventListener("click", () => {
      digidexViewState.detailSpeciesId = button.dataset.speciesId || null;
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.querySelectorAll(".js-close-dex-detail").forEach((button) => {
    button.addEventListener("click", () => {
      digidexViewState.detailSpeciesId = null;
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });
}
