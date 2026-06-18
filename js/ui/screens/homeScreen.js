import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { clamp, escapeHtml } from "../../core/utils.js";
import {
  getTamerExpToNextLevel,
  getTamerProgress,
  TAMER_MAX_LEVEL
} from "../../systems/tamerProgressionSystem.js";

function renderMenuTile({ className = "", title, copy, buttonId, buttonClass = "btn-primary", buttonText }) {
  return `
    <div class="menu-tile ${className}">
      <div class="menu-tile__top">
        <h3>${escapeHtml(title)}</h3>
      </div>
      <p>${escapeHtml(copy)}</p>
      <button class="btn ${buttonClass}" id="${escapeHtml(buttonId)}">${escapeHtml(buttonText)}</button>
    </div>
  `;
}

function renderTopProgress(save) {
  const tamer = getTamerProgress(save);
  const expToNextLevel = getTamerExpToNextLevel(tamer.level);
  const isMaxLevel = tamer.level >= TAMER_MAX_LEVEL;
  const progressPercent = isMaxLevel ? 100 : clamp((tamer.exp / expToNextLevel) * 100, 0, 100);

  return `
    <div class="topbar-progress">
      <div class="topbar-progress__text">
        <span>Tamer Lv. ${tamer.level}</span>
        <strong>${isMaxLevel ? "MAX" : `${tamer.exp}/${expToNextLevel}`}</strong>
      </div>
      <div class="tamer-progress__bar">
        <span style="width:${progressPercent}%;"></span>
      </div>
    </div>
  `;
}

function renderPartyPreview() {
  if (!state.save.party.length) {
    return `
      <div class="home-party-empty">
        <p>Escolha seus primeiros parceiros para formar o time ativo.</p>
      </div>
    `;
  }

  return `
    <div class="home-party-grid">
      ${state.save.party
        .map((digimon) => {
          const species = getDigimonSpecies(digimon.speciesId);
          const displayName = digimon.nickname?.trim() || species?.name || digimon.speciesId;

          return `
            <div class="home-party-card">
              <div class="home-party-card__sprite">
                ${
                  species
                    ? `
                      <img
                        src="${escapeHtml(species.sprite || "")}"
                        alt="${escapeHtml(species.name)}"
                        onerror="this.style.display='none'"
                      />
                    `
                    : ""
                }
              </div>
              <div class="home-party-card__copy">
                <strong>${escapeHtml(displayName)}</strong>
                <span>Lv. ${digimon.level}</span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

export function renderHomeScreen() {
  const playerName = state.save.playerName?.trim() || "Sem nome";

  return `
    <section class="screen">
      <div class="topbar topbar--home">
        <div class="topbar__main">
          <div>
            <h2 style="margin-bottom:6px;">${escapeHtml(playerName)}</h2>
            <small>Central de arena</small>
          </div>

          <div class="topbar__stats">
            <span class="status-pill">Bits: ${state.save.bits}</span>
            <span class="status-pill">Time: ${state.save.party.length}</span>
            <span class="status-pill">Storage: ${state.save.storage.length}</span>
            <span class="status-pill">DigiDex: ${state.save.digidex.owned.length}</span>
          </div>
        </div>

        ${renderTopProgress(state.save)}
      </div>

      <div class="panel">
        <div class="home-hero">
          <div class="home-hero__copy">
            <h3>Time ativo</h3>
            <p>Parceiros prontos para hunts, bosses e evolucoes.</p>
          </div>
          ${renderPartyPreview()}
        </div>

        <div class="menu-grid">
          ${renderMenuTile({
            className: "menu-tile--combat",
            title: "Time",
            copy: "Organize a linha de frente e acione evolucoes.",
            buttonId: "btn-go-team",
            buttonText: "Ver time"
          })}

          ${renderMenuTile({
            className: "menu-tile--dex",
            title: "DigiDex",
            copy: "Consulte scans, familias e linhas evolutivas.",
            buttonId: "btn-go-dex",
            buttonText: "Abrir dex"
          })}

          ${renderMenuTile({
            className: "menu-tile--combat",
            title: "Hunts",
            copy: "Entre em zonas digitais e acumule recursos.",
            buttonId: "btn-go-hunts",
            buttonText: "Iniciar hunt"
          })}

          ${renderMenuTile({
            className: "menu-tile--danger",
            title: "Bosses",
            copy: "Desafios de alta pressao para times preparados.",
            buttonId: "btn-go-bosses",
            buttonText: "Enfrentar"
          })}

          ${renderMenuTile({
            title: "Itens",
            copy: "Recupere parceiros e gerencie suprimentos.",
            buttonId: "btn-go-items",
            buttonText: "Abrir bolsa"
          })}

          ${renderMenuTile({
            title: "Treinamento",
            copy: "Fortaleca atributos para rotas evolutivas.",
            buttonId: "btn-go-training",
            buttonText: "Treinar"
          })}

          ${renderMenuTile({
            title: "Loja",
            copy: "Troque Bits por chips, discos e suporte.",
            buttonId: "btn-go-shop",
            buttonText: "Comprar"
          })}

          ${renderMenuTile({
            className: "menu-tile--dex",
            title: "Conversao",
            copy: "Transforme dados de scan em novos aliados.",
            buttonId: "btn-go-conversion",
            buttonText: "Converter"
          })}

          ${renderMenuTile({
            title: "Opcoes",
            copy: "Controle exportacao, importacao e save local.",
            buttonId: "btn-go-options",
            buttonClass: "btn-secondary",
            buttonText: "Ajustar"
          })}
        </div>
      </div>
    </section>
  `;
}

export function bindHomeScreen() {
  document.getElementById("btn-go-team")?.addEventListener("click", () => {
    goToScreen("team");
  });

  document.getElementById("btn-go-dex")?.addEventListener("click", () => {
    goToScreen("digidex");
  });

  document.getElementById("btn-go-hunts")?.addEventListener("click", () => {
    goToScreen("hunts");
  });

  document.getElementById("btn-go-bosses")?.addEventListener("click", () => {
    goToScreen("bosses");
  });

  document.getElementById("btn-go-items")?.addEventListener("click", () => {
    goToScreen("items");
  });

  document.getElementById("btn-go-training")?.addEventListener("click", () => {
    goToScreen("training");
  });

  document.getElementById("btn-go-shop")?.addEventListener("click", () => {
    goToScreen("shop");
  });

  document.getElementById("btn-go-conversion")?.addEventListener("click", () => {
    goToScreen("conversion");
  });

  document.getElementById("btn-go-options")?.addEventListener("click", () => {
    goToScreen("options");
  });
}
