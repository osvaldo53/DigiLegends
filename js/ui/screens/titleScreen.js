import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { deleteSave, hasSave, importSaveFromText } from "../../core/saveManager.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { escapeHtml } from "../../core/utils.js";
import { renderApp } from "../renderApp.js";

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

function setTitleFeedback(message, tone = "muted") {
  const feedback = document.getElementById("title-feedback");

  if (!feedback) {
    return;
  }

  feedback.className = "hunt-session__muted";
  feedback.style.color = tone === "error" ? "#ff9b9b" : "";
  feedback.textContent = message;
}

function renderTitleSprites() {
  const featuredIds = ["wargreymon", "agumon", "metalgarurumon"];
  const spriteClasses = ["title-sprite--left", "title-sprite--center", "title-sprite--right"];

  return featuredIds
    .map((speciesId, index) => {
      const species = getDigimonSpecies(speciesId);

      if (!species) {
        return "";
      }

      return `
        <img
          class="title-sprite ${spriteClasses[index]}"
          src="${escapeHtml(species.sprite || "")}"
          alt="${escapeHtml(species.name)}"
          onerror="this.style.display='none'"
        />
      `;
    })
    .join("");
}

export function renderTitleScreen() {
  const saveExists = hasSave();

  return `
    <section class="screen screen--centered">
      <div class="panel title-panel">
        <div class="title-panel__copy">
          <span class="title-kicker">Anime Battle Arena</span>
          <h1 class="game-title"><span>Digi</span>Legends</h1>
          <p class="subtitle">Monte seu time, entre na arena digital e evolua seus parceiros em batalhas de energia pura.</p>

          <div class="title-panel__stats">
            <span class="status-pill">Hunts AFK</span>
            <span class="status-pill">Boss Rush</span>
            <span class="status-pill">DigiDex</span>
          </div>

          <div class="button-row">
            <button class="btn btn-primary" id="btn-new-game">Novo jogo</button>
            <button class="btn btn-secondary" id="btn-import-save-title">Importar save</button>
            <input type="file" id="input-import-save-title" accept=".json,application/json" style="display:none;" />
            ${saveExists ? '<button class="btn btn-secondary" id="btn-continue">Continuar</button>' : ""}
            ${saveExists ? '<button class="btn btn-danger" id="btn-delete-save">Apagar save</button>' : ""}
          </div>

          <p id="title-feedback" class="hunt-session__muted" style="margin-top:4px;"></p>
        </div>

        <div class="title-hero-art" aria-hidden="true">
          <div class="title-sprite-stage">
            ${renderTitleSprites()}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function bindTitleScreen() {
  document.getElementById("btn-new-game")?.addEventListener("click", () => {
    goToScreen("newGame");
  });

  document.getElementById("btn-continue")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-import-save-title")?.addEventListener("click", () => {
    document.getElementById("input-import-save-title")?.click();
  });

  document.getElementById("input-import-save-title")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const importedText = await file.text();
      const importedSave = importSaveFromText(importedText);

      state.save = importedSave;
      resetTransientState();
      setTitleFeedback("Save importado com sucesso.");
      goToScreen("home");
    } catch (error) {
      setTitleFeedback(error.message || "Nao foi possivel importar o save.", "error");
    } finally {
      event.target.value = "";
    }
  });

  document.getElementById("btn-delete-save")?.addEventListener("click", () => {
    const confirmed = window.confirm("Deseja apagar o save atual?");
    if (!confirmed) return;

    deleteSave();
    renderApp();
  });
}
