import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { escapeHtml } from "../../core/utils.js";
import { renderTamerProgress } from "../components/tamerProgress.js";

function renderMenuTile({ className = "", code, icon, title, copy, buttonId, buttonClass = "btn-primary", buttonText }) {
  return `
    <div class="menu-tile ${className}">
      <div class="menu-tile__top">
        <div>
          <span class="section-kicker">${escapeHtml(code)}</span>
          <h3>${escapeHtml(title)}</h3>
        </div>
        <span class="menu-tile__icon" aria-hidden="true">${escapeHtml(icon)}</span>
      </div>
      <p>${escapeHtml(copy)}</p>
      <button class="btn ${buttonClass}" id="${escapeHtml(buttonId)}">${escapeHtml(buttonText)}</button>
    </div>
  `;
}

export function renderHomeScreen() {
  const leader = state.save.party[0] || null;
  const leaderSpecies = leader ? getDigimonSpecies(leader.speciesId) : null;
  const playerName = escapeHtml(state.save.playerName || "Sem nome");
  const leaderName = leaderSpecies?.name || leader?.nickname || "Sem parceiro";

  return `
    <section class="screen">
      <div class="topbar">
        <div>
          <span class="section-kicker">Tamer HQ</span>
          <h2 style="margin-bottom:6px;">Central de arena</h2>
          <small>Tamer: ${playerName}</small>
        </div>
        <div class="badge">Bits: ${state.save.bits}</div>
      </div>

      <div class="panel">
        <div class="home-hero">
          <div class="home-hero__leader">
            <div class="home-hero__sprite-frame">
              ${
                leaderSpecies
                  ? `
                    <img
                      src="${escapeHtml(leaderSpecies.sprite || "")}"
                      alt="${escapeHtml(leaderSpecies.name)}"
                      onerror="this.style.display='none'"
                    />
                  `
                  : ""
              }
            </div>
            <div class="home-hero__copy">
              <span class="section-kicker">Lider ativo</span>
              <h3>${escapeHtml(leaderName)}</h3>
              <p>${leader ? `Lv. ${leader.level} pronto para a proxima rodada.` : "Escolha um parceiro para iniciar a jornada."}</p>
            </div>
          </div>
          <div class="title-panel__stats">
            <span class="status-pill">Time ${state.save.party.length}</span>
            <span class="status-pill">Storage ${state.save.storage.length}</span>
            <span class="status-pill">DigiDex ${state.save.digidex.owned.length}</span>
          </div>
        </div>

        ${renderTamerProgress(state.save)}

        <div class="menu-grid">
          ${renderMenuTile({
            className: "menu-tile--combat",
            code: "Slot 01",
            icon: "TM",
            title: "Time",
            copy: "Organize a linha de frente e acione evolucoes.",
            buttonId: "btn-go-team",
            buttonText: "Ver time"
          })}

          ${renderMenuTile({
            className: "menu-tile--dex",
            code: "Slot 02",
            icon: "DX",
            title: "DigiDex",
            copy: "Consulte scans, familias e linhas evolutivas.",
            buttonId: "btn-go-dex",
            buttonText: "Abrir dex"
          })}

          ${renderMenuTile({
            className: "menu-tile--combat",
            code: "Slot 03",
            icon: "HT",
            title: "Hunts",
            copy: "Entre em zonas digitais e acumule recursos.",
            buttonId: "btn-go-hunts",
            buttonText: "Iniciar hunt"
          })}

          ${renderMenuTile({
            className: "menu-tile--danger",
            code: "Slot 04",
            icon: "BS",
            title: "Bosses",
            copy: "Desafios de alta pressao para times preparados.",
            buttonId: "btn-go-bosses",
            buttonText: "Enfrentar"
          })}

          ${renderMenuTile({
            code: "Slot 05",
            icon: "IT",
            title: "Itens",
            copy: "Recupere parceiros e gerencie suprimentos.",
            buttonId: "btn-go-items",
            buttonText: "Abrir bolsa"
          })}

          ${renderMenuTile({
            code: "Slot 06",
            icon: "TR",
            title: "Treinamento",
            copy: "Fortaleca atributos para rotas evolutivas.",
            buttonId: "btn-go-training",
            buttonText: "Treinar"
          })}

          ${renderMenuTile({
            code: "Slot 07",
            icon: "SH",
            title: "Loja",
            copy: "Troque Bits por chips, discos e suporte.",
            buttonId: "btn-go-shop",
            buttonText: "Comprar"
          })}

          ${renderMenuTile({
            className: "menu-tile--dex",
            code: "Slot 08",
            icon: "SC",
            title: "Conversao",
            copy: "Transforme dados de scan em novos aliados.",
            buttonId: "btn-go-conversion",
            buttonText: "Converter"
          })}

          ${renderMenuTile({
            code: "Slot 09",
            icon: "OP",
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
