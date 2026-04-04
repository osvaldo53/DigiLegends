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
        <p>Este pacote já inclui DigiDex, Hunts, encontros e uma primeira versão do sistema de batalha.</p>

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
            <p>Escolher área e iniciar combate.</p>
            <button class="btn btn-primary" id="btn-go-hunts">Abrir hunts</button>
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

  document.getElementById("btn-reset-save")?.addEventListener("click", () => {
    const confirmed = window.confirm("Deseja apagar o save atual e voltar para a tela inicial?");
    if (!confirmed) return;

    deleteSave();
    goToScreen("title");
  });
}
