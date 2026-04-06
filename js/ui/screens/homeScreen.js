import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { deleteSave } from "../../core/saveManager.js";

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
        <p>Base atual com hunt AFK, DigiDex, time, itens, loja, evolução e conversão por scan.</p>

        <div class="menu-grid">
          <div class="menu-tile">
            <h3>Time</h3>
            <p>Visualizar os Digimons ativos.</p>
            <button class="btn btn-primary" id="btn-go-team">Abrir time</button>
          </div>

          <div class="menu-tile">
            <h3>DigiDex</h3>
            <p>Ver espécies vistas e capturadas.</p>
            <button class="btn btn-primary" id="btn-go-dex">Abrir DigiDex</button>
          </div>

          <div class="menu-tile">
            <h3>Hunts</h3>
            <p>Escolher área e iniciar combate automático.</p>
            <button class="btn btn-primary" id="btn-go-hunts">Abrir hunts</button>
          </div>

          <div class="menu-tile">
            <h3>Itens</h3>
            <p>Usar itens de recuperação no líder do time.</p>
            <button class="btn btn-primary" id="btn-go-items">Abrir itens</button>
          </div>

          <div class="menu-tile">
            <h3>Loja</h3>
            <p>Comprar itens de cura com seus Bits.</p>
            <button class="btn btn-primary" id="btn-go-shop">Abrir loja</button>
          </div>

          <div class="menu-tile">
            <h3>Conversão</h3>
            <p>Converter dados de scan em novos Digimons.</p>
            <button class="btn btn-primary" id="btn-go-conversion">Abrir conversão</button>
          </div>

          <div class="menu-tile">
            <h3>Save</h3>
            <p>Apagar o save atual para reiniciar os testes.</p>
            <button class="btn btn-danger" id="btn-reset-save">Apagar save</button>
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

  document.getElementById("btn-go-items")?.addEventListener("click", () => {
    goToScreen("items");
  });

  document.getElementById("btn-go-shop")?.addEventListener("click", () => {
    goToScreen("shop");
  });

  document.getElementById("btn-go-conversion")?.addEventListener("click", () => {
    goToScreen("conversion");
  });

  document.getElementById("btn-reset-save")?.addEventListener("click", () => {
    const confirmed = window.confirm("Deseja apagar o save atual e voltar para a tela inicial?");
    if (!confirmed) return;

    deleteSave();
    goToScreen("title");
  });
}