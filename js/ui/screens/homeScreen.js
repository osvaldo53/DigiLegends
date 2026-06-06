import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { renderTamerProgress } from "../components/tamerProgress.js";

export function renderHomeScreen() {
  return `
    <section class="screen">
      <div class="topbar">
        <div>
          <h2 style="margin-bottom:6px;">Menu principal</h2>
          <small>Tamer: ${state.save.playerName || "Sem nome"}</small>
        </div>
        <div class="badge">Bits: ${state.save.bits}</div>
      </div>

      <div class="panel">
        ${renderTamerProgress(state.save)}
        <p>Base atual com hunt AFK, bosses, DigiDex, time, itens, loja, evolucao e conversao por scan.</p>

        <div class="menu-grid">
          <div class="menu-tile">
            <h3>Time</h3>
            <p>Visualizar os Digimons ativos.</p>
            <button class="btn btn-primary" id="btn-go-team">Abrir time</button>
          </div>

          <div class="menu-tile">
            <h3>DigiDex</h3>
            <p>Ver especies vistas e capturadas.</p>
            <button class="btn btn-primary" id="btn-go-dex">Abrir DigiDex</button>
          </div>

          <div class="menu-tile">
            <h3>Hunts</h3>
            <p>Escolher area e iniciar combate automatico.</p>
            <button class="btn btn-primary" id="btn-go-hunts">Abrir hunts</button>
          </div>

          <div class="menu-tile">
            <h3>Bosses</h3>
            <p>Enfrentar desafios especiais com inimigos definidos e muito fortes.</p>
            <button class="btn btn-primary" id="btn-go-bosses">Abrir bosses</button>
          </div>

          <div class="menu-tile">
            <h3>Itens</h3>
            <p>Usar itens de recuperacao no lider do time.</p>
            <button class="btn btn-primary" id="btn-go-items">Abrir itens</button>
          </div>

          <div class="menu-tile">
            <h3>Treinamento</h3>
            <p>Use itens de treino para melhorar atributos e abrir rotas evolutivas.</p>
            <button class="btn btn-primary" id="btn-go-training">Abrir treinamento</button>
          </div>

          <div class="menu-tile">
            <h3>Loja</h3>
            <p>Comprar itens de cura com seus Bits.</p>
            <button class="btn btn-primary" id="btn-go-shop">Abrir loja</button>
          </div>

          <div class="menu-tile">
            <h3>Conversao</h3>
            <p>Converter dados de scan em novos Digimons.</p>
            <button class="btn btn-primary" id="btn-go-conversion">Abrir conversao</button>
          </div>

          <div class="menu-tile">
            <h3>Opcoes</h3>
            <p>Exportar, importar ou apagar o save atual.</p>
            <button class="btn btn-secondary" id="btn-go-options">Abrir opcoes</button>
          </div>
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
