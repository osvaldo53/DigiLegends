import { goToScreen } from "../../core/router.js";
import {
  deleteSave,
  importSaveFromText,
  serializeSaveForExport
} from "../../core/saveManager.js";
import { state } from "../../core/state.js";

function buildExportFilename() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");

  return `digilegends-save-${yyyy}${mm}${dd}-${hh}${min}.json`;
}

function resetTransientState() {
  state.battle = {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    enemy: null,
    encounterRewards: null,
    log: [],
    result: null,
    rewards: null,
    lastAction: null
  };

  state.huntSession = {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    totalBattles: 0,
    totalWins: 0,
    totalDefeats: 0,
    totalBitsEarned: 0,
    totalExpEarned: 0,
    currentBattleNumber: 0,
    turnOwner: null,
    status: "idle",
    drops: [],
    phaseLabel: "",
    phaseDurationMs: 0,
    phaseStartedAt: 0,
    summary: null
  };
}

function setFeedback(message, tone = "muted") {
  const feedback = document.getElementById("options-feedback");

  if (!feedback) {
    return;
  }

  feedback.className = "hunt-session__muted";
  feedback.style.color = tone === "error" ? "#ff9b9b" : "";
  feedback.textContent = message;
}

export function renderOptionsScreen() {
  return `
    <section class="screen">
      <div class="panel">
        <h2>Opcoes</h2>
        <p>Gerencie seu save atual com exportacao, importacao e exclusao.</p>

        <div class="menu-grid">
          <div class="menu-tile">
            <h3>Exportar save</h3>
            <p>Baixa um arquivo JSON com o estado atual do jogo.</p>
            <button class="btn btn-primary" id="btn-export-save">Exportar save</button>
          </div>

          <div class="menu-tile">
            <h3>Importar save</h3>
            <p>Carrega um arquivo JSON exportado anteriormente e substitui o save atual.</p>
            <button class="btn btn-secondary" id="btn-import-save">Importar save</button>
            <input type="file" id="input-import-save" accept=".json,application/json" style="display:none;" />
          </div>

          <div class="menu-tile">
            <h3>Apagar save</h3>
            <p>Remove o save local atual e volta para a tela inicial.</p>
            <button class="btn btn-danger" id="btn-delete-save-from-options">Apagar save</button>
          </div>
        </div>

        <p id="options-feedback" class="hunt-session__muted" style="margin-top:16px;"></p>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindOptionsScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-export-save")?.addEventListener("click", () => {
    try {
      const content = serializeSaveForExport(state.save);
      const blob = new Blob([content], { type: "application/json" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = buildExportFilename();
      link.click();
      URL.revokeObjectURL(blobUrl);

      setFeedback("Save exportado com sucesso.");
    } catch {
      setFeedback("Nao foi possivel exportar o save.", "error");
    }
  });

  document.getElementById("btn-import-save")?.addEventListener("click", () => {
    document.getElementById("input-import-save")?.click();
  });

  document.getElementById("input-import-save")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const importedText = await file.text();
      const importedSave = importSaveFromText(importedText);

      state.save = importedSave;
      resetTransientState();
      setFeedback("Save importado com sucesso.");
      goToScreen("home");
    } catch (error) {
      setFeedback(error.message || "Nao foi possivel importar o save.", "error");
    } finally {
      event.target.value = "";
    }
  });

  document.getElementById("btn-delete-save-from-options")?.addEventListener("click", () => {
    const confirmed = window.confirm("Deseja apagar o save atual e voltar para a tela inicial?");

    if (!confirmed) {
      return;
    }

    deleteSave();
    resetTransientState();
    goToScreen("title");
  });
}
