import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getDigiDexEntries } from "../../systems/digidexSystem.js";
import { renderDexCard } from "../components/dexCard.js";

/**
 * Estado local simples da tela da DigiDex.
 *
 * Mantido fora do state global para evitar acoplamento desnecessário.
 */
const digidexViewState = {
  search: "",
  statusFilter: "all",   // all | seen | owned | unknown
  typeFilter: "all",
  elementFilter: "all"
};

/**
 * Retorna as opções únicas de tipo a partir das entradas da DigiDex.
 *
 * @param {object[]} entries
 * @returns {string[]}
 */
function getUniqueTypes(entries) {
  return [...new Set(entries.map((entry) => entry.type).filter(Boolean))].sort();
}

/**
 * Retorna as opções únicas de elemento a partir das entradas da DigiDex.
 *
 * @param {object[]} entries
 * @returns {string[]}
 */
function getUniqueElements(entries) {
  return [...new Set(entries.map((entry) => entry.element).filter(Boolean))].sort();
}

/**
 * Aplica filtros e busca nas entradas da DigiDex.
 *
 * @param {object[]} entries
 * @returns {object[]}
 */
function filterEntries(entries) {
  return entries.filter((entry) => {
    const matchesSearch =
      !digidexViewState.search ||
      entry.name.toLowerCase().includes(digidexViewState.search.toLowerCase());

    const matchesStatus =
      digidexViewState.statusFilter === "all" ||
      (digidexViewState.statusFilter === "seen" && entry.seen) ||
      (digidexViewState.statusFilter === "owned" && entry.owned) ||
      (digidexViewState.statusFilter === "unknown" && !entry.seen);

    const matchesType =
      digidexViewState.typeFilter === "all" ||
      entry.type === digidexViewState.typeFilter;

    const matchesElement =
      digidexViewState.elementFilter === "all" ||
      entry.element === digidexViewState.elementFilter;

    return matchesSearch && matchesStatus && matchesType && matchesElement;
  });
}

/**
 * Renderiza a tela da DigiDex com busca e filtros.
 */
export function renderDigiDexScreen() {
  const allEntries = getDigiDexEntries(state.save);
  const filteredEntries = filterEntries(allEntries);

  const typeOptions = getUniqueTypes(allEntries);
  const elementOptions = getUniqueElements(allEntries);

  const entriesHtml = filteredEntries.length
    ? filteredEntries.map((entry) => renderDexCard(entry)).join("")
    : '<p class="empty-state">Nenhum Digimon encontrado com os filtros atuais.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <h2>DigiDex</h2>
        <p>Consulte espécies vistas e capturadas, com busca e filtros.</p>

        <div class="button-row" style="margin-bottom: 16px;">
          <span class="status-pill">Vistos: ${state.save.digidex.seen.length}</span>
          <span class="status-pill">Capturados: ${state.save.digidex.owned.length}</span>
          <span class="status-pill">Total: ${allEntries.length}</span>
        </div>

        <div class="field">
          <label class="label" for="digdex-search">Buscar por nome</label>
          <input
            class="input"
            id="digdex-search"
            type="text"
            placeholder="Ex.: Agumon"
            value="${digidexViewState.search}"
          />
        </div>

        <div class="card-grid" style="margin-bottom: 16px;">
          <div class="hunt-session-box">
            <label class="label" for="digdex-status-filter">Status</label>
            <select class="input" id="digdex-status-filter">
              <option value="all" ${digidexViewState.statusFilter === "all" ? "selected" : ""}>Todos</option>
              <option value="seen" ${digidexViewState.statusFilter === "seen" ? "selected" : ""}>Vistos</option>
              <option value="owned" ${digidexViewState.statusFilter === "owned" ? "selected" : ""}>Capturados</option>
              <option value="unknown" ${digidexViewState.statusFilter === "unknown" ? "selected" : ""}>Desconhecidos</option>
            </select>
          </div>

          <div class="hunt-session-box">
            <label class="label" for="digdex-type-filter">Tipo</label>
            <select class="input" id="digdex-type-filter">
              <option value="all">Todos</option>
              ${typeOptions
                .map(
                  (type) =>
                    `<option value="${type}" ${digidexViewState.typeFilter === type ? "selected" : ""}>${type}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="hunt-session-box">
            <label class="label" for="digdex-element-filter">Elemento</label>
            <select class="input" id="digdex-element-filter">
              <option value="all">Todos</option>
              ${elementOptions
                .map(
                  (element) =>
                    `<option value="${element}" ${digidexViewState.elementFilter === element ? "selected" : ""}>${element}</option>`
                )
                .join("")}
            </select>
          </div>
        </div>

        <div class="card-grid">
          ${entriesHtml}
        </div>

        <div class="button-row" style="margin-top: 18px;">
          <button class="btn btn-secondary" id="btn-clear-digidex-filters">Limpar filtros</button>
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

/**
 * Eventos da tela da DigiDex.
 */
export function bindDigiDexScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-clear-digidex-filters")?.addEventListener("click", () => {
    digidexViewState.search = "";
    digidexViewState.statusFilter = "all";
    digidexViewState.typeFilter = "all";
    digidexViewState.elementFilter = "all";

    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digdex-search")?.addEventListener("input", (event) => {
    digidexViewState.search = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digdex-status-filter")?.addEventListener("change", (event) => {
    digidexViewState.statusFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digdex-type-filter")?.addEventListener("change", (event) => {
    digidexViewState.typeFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("digdex-element-filter")?.addEventListener("change", (event) => {
    digidexViewState.elementFilter = event.target.value;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });
}