import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { saveGame } from "../../core/saveManager.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { getItemById } from "../../data/items.js";
import { escapeHtml } from "../../core/utils.js";
import {
  TRAINABLE_STATS,
  TRAINING_DURATION_PER_POINT_MS,
  TRAINING_GAIN_BY_STAT,
  claimTrainingJob,
  getMaxTrainingQuantity,
  getTrainingItemIdForStat,
  getTrainingItemQuantity,
  getTrainingJobForDigimon,
  getUsedTrainingPoints,
  isTrainingJobComplete,
  startTrainingJob
} from "../../systems/trainingSystem.js";
import {
  getDigimonStage,
  getLevelCapForDigimon,
  getTrainingCapForDigimon
} from "../../systems/digimonProgressionSystem.js";

const trainingViewState = {
  selectedStatKey: "atk",
  selectedDigimonUid: "",
  selectedQuantity: 1
};

function getAllOwnedDigimons() {
  return [...state.save.party, ...state.save.storage];
}

function getAvailableDigimons() {
  return getAllOwnedDigimons().filter((digimon) => !getTrainingJobForDigimon(state.save, digimon.uid));
}

function getActiveJobs() {
  return getAllOwnedDigimons()
    .map((digimon) => ({
      digimon,
      job: getTrainingJobForDigimon(state.save, digimon.uid)
    }))
    .filter((entry) => entry.job);
}

function getSelectedDigimon() {
  const availableDigimons = getAvailableDigimons();

  return (
    availableDigimons.find((digimon) => digimon.uid === trainingViewState.selectedDigimonUid) ||
    availableDigimons[0] ||
    null
  );
}

function formatDuration(durationMs) {
  const totalMinutes = Math.max(0, Math.ceil(durationMs / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h`;
  }

  return `${minutes}min`;
}

function formatDigimonOption(playerDigimon) {
  const species = getDigimonSpecies(playerDigimon.speciesId);
  const displayName = playerDigimon.nickname?.trim() || species?.name || playerDigimon.speciesId;
  const stage = getDigimonStage(playerDigimon.speciesId);
  const trainingCap = getTrainingCapForDigimon(playerDigimon);
  const usedTraining = getUsedTrainingPoints(playerDigimon);

  return `${displayName} · ${stage} · Lv. ${playerDigimon.level}/${getLevelCapForDigimon(playerDigimon)} · Treino ${usedTraining}/${trainingCap}`;
}

function formatTrainingSummary(job, now = Date.now()) {
  const remainingMs = Math.max(0, Number(job.endsAt ?? 0) - now);
  const totalGain = (TRAINING_GAIN_BY_STAT[job.statKey] ?? 1) * Number(job.quantity ?? 1);

  if (isTrainingJobComplete(job, now)) {
    return `Treino concluido · +${totalGain} ${job.statKey.toUpperCase()} pronto para retirada`;
  }

  return `Em treino · +${totalGain} ${job.statKey.toUpperCase()} · termina em ${formatDuration(remainingMs)}`;
}

function renderStatButtons() {
  return `
    <div class="digidex-stage-pills" style="margin-top:0;">
      ${TRAINABLE_STATS.map((statKey) => {
        const item = getItemById(getTrainingItemIdForStat(statKey));
        const quantity = getTrainingItemQuantity(state.save, statKey);
        const gainValue = TRAINING_GAIN_BY_STAT[statKey] ?? 1;
        const isActive = trainingViewState.selectedStatKey === statKey;

        return `
          <button
            class="status-pill ${isActive ? "status-pill--active" : ""} js-training-stat-filter"
            data-stat-key="${escapeHtml(statKey)}"
          >
            ${escapeHtml(item?.name || statKey.toUpperCase())} · +${gainValue} · ${quantity}
          </button>
        `;
      }).join("")}
    </div>
  `;
}

function renderTrainingComposer() {
  const availableDigimons = getAvailableDigimons();
  const selectedDigimon = getSelectedDigimon();
  const selectedItem = getItemById(getTrainingItemIdForStat(trainingViewState.selectedStatKey));
  const maxQuantity = selectedDigimon
    ? getMaxTrainingQuantity(state.save, selectedDigimon, trainingViewState.selectedStatKey)
    : 0;
  const selectedQuantity = Math.min(Math.max(1, trainingViewState.selectedQuantity), Math.max(1, maxQuantity || 1));
  const totalDuration = selectedQuantity * TRAINING_DURATION_PER_POINT_MS;

  return `
    <div class="hunt-session-box" style="margin-bottom:16px;">
      <h3>Iniciar treino</h3>
      <p class="hunt-session__muted">
        Escolha o atributo, selecione o Digimon no combo e defina quantos chips deseja usar.
      </p>

      ${renderStatButtons()}

      <div class="digidex-filters-grid" style="margin-top:12px;">
        <div class="field" style="margin-bottom:0;">
          <label class="label" for="training-digimon-select">Digimon</label>
          <select class="input" id="training-digimon-select" ${availableDigimons.length ? "" : "disabled"}>
            ${
              availableDigimons.length
                ? availableDigimons
                    .map((digimon) => `
                      <option
                        value="${escapeHtml(digimon.uid)}"
                        ${selectedDigimon?.uid === digimon.uid ? "selected" : ""}
                      >
                        ${escapeHtml(formatDigimonOption(digimon))}
                      </option>
                    `)
                    .join("")
                : '<option value="">Nenhum Digimon livre para treino</option>'
            }
          </select>
        </div>
      </div>

      ${
        selectedDigimon
          ? `
            <div class="button-row" style="margin-top:12px;">
              <button
                class="btn btn-secondary"
                id="btn-training-quantity-minus"
                ${selectedQuantity <= 1 ? "disabled" : ""}
              >
                -
              </button>
              <span class="status-pill">Quantidade: ${selectedQuantity}</span>
              <button
                class="btn btn-secondary"
                id="btn-training-quantity-plus"
                ${selectedQuantity >= Math.max(1, maxQuantity) ? "disabled" : ""}
              >
                +
              </button>
              <span class="status-pill">Duracao: ${formatDuration(totalDuration)}</span>
            </div>

            <div class="button-row" style="margin-top:12px;">
              <button
                class="btn btn-primary"
                id="btn-start-training"
                ${maxQuantity > 0 ? "" : "disabled"}
              >
                Iniciar ${escapeHtml(selectedItem?.name || trainingViewState.selectedStatKey)}
              </button>
            </div>

            ${
              maxQuantity > 0
                ? ""
                : `<p class="hunt-session__muted" style="margin-top:10px;">Este Digimon nao pode iniciar mais treino para ${trainingViewState.selectedStatKey.toUpperCase()} agora.</p>`
            }
          `
          : `<p class="hunt-session__muted" style="margin-top:12px;">Todos os Digimons disponiveis ja estao ocupados em treino.</p>`
      }
    </div>
  `;
}

function renderActiveJobsSection() {
  const now = Date.now();
  const jobs = getActiveJobs();

  return `
    <div class="hunt-session-box">
      <h3>Treinos em andamento</h3>
      ${
        jobs.length
          ? `
            <div class="team-evolution-list">
              ${jobs
                .map(({ digimon, job }) => {
                  const species = getDigimonSpecies(digimon.speciesId);
                  const displayName = digimon.nickname?.trim() || species?.name || digimon.speciesId;
                  const isComplete = isTrainingJobComplete(job, now);

                  return `
                    <div class="team-evolution-item">
                      <div class="team-evolution-item__info">
                        <strong>${escapeHtml(displayName)}</strong>
                        <small>${escapeHtml(formatTrainingSummary(job, now))}</small>
                        <small>Fim: ${escapeHtml(new Date(job.endsAt).toLocaleString())}</small>
                      </div>

                      ${
                        isComplete
                          ? `
                            <button
                              class="btn btn-primary js-claim-training"
                              data-digimon-uid="${escapeHtml(digimon.uid)}"
                            >
                              Retirar
                            </button>
                          `
                          : '<span class="status-pill">Em treino</span>'
                      }
                    </div>
                  `;
                })
                .join("")}
            </div>
          `
          : '<p class="empty-state">Nenhum Digimon esta treinando no momento.</p>'
      }
    </div>
  `;
}

export function renderTrainingScreen() {
  const selectedItem = getItemById(getTrainingItemIdForStat(trainingViewState.selectedStatKey));
  const gainValue = TRAINING_GAIN_BY_STAT[trainingViewState.selectedStatKey] ?? 1;

  return `
    <section class="screen">
      <div class="panel">
        <h2>Treinamento</h2>
        <p>Selecione o treino pelos botoes, depois escolha o Digimon no combo. Cada chip consome ${formatDuration(TRAINING_DURATION_PER_POINT_MS)} e o treino continua mesmo com o jogo fechado.</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Treino selecionado: ${escapeHtml(selectedItem?.name || trainingViewState.selectedStatKey)}</span>
          <span class="status-pill">Ganho por chip: +${gainValue} ${trainingViewState.selectedStatKey.toUpperCase()}</span>
          <span class="status-pill">Tempo por chip: ${formatDuration(TRAINING_DURATION_PER_POINT_MS)}</span>
        </div>

        <div id="trainingFeedback" class="hunt-action-banner" style="display:none; margin-bottom:16px;"></div>

        ${renderTrainingComposer()}
        ${renderActiveJobsSection()}

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindTrainingScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-training-stat-filter").forEach((button) => {
    button.addEventListener("click", () => {
      trainingViewState.selectedStatKey = button.dataset.statKey || "atk";
      trainingViewState.selectedQuantity = 1;
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.getElementById("training-digimon-select")?.addEventListener("change", (event) => {
    trainingViewState.selectedDigimonUid = event.target.value || "";
    trainingViewState.selectedQuantity = 1;
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("btn-training-quantity-minus")?.addEventListener("click", () => {
    trainingViewState.selectedQuantity = Math.max(1, trainingViewState.selectedQuantity - 1);
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("btn-training-quantity-plus")?.addEventListener("click", () => {
    const selectedDigimon = getSelectedDigimon();

    if (!selectedDigimon) {
      return;
    }

    const maxQuantity = getMaxTrainingQuantity(
      state.save,
      selectedDigimon,
      trainingViewState.selectedStatKey
    );

    trainingViewState.selectedQuantity = Math.min(maxQuantity, trainingViewState.selectedQuantity + 1);
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("btn-start-training")?.addEventListener("click", () => {
    const selectedDigimon = getSelectedDigimon();
    const feedback = document.getElementById("trainingFeedback");

    if (!selectedDigimon) {
      return;
    }

    try {
      const job = startTrainingJob(
        state.save,
        selectedDigimon.uid,
        trainingViewState.selectedStatKey,
        trainingViewState.selectedQuantity
      );
      saveGame(state.save);

      if (feedback) {
        const species = getDigimonSpecies(selectedDigimon.speciesId);
        const displayName = selectedDigimon.nickname?.trim() || species?.name || selectedDigimon.speciesId;
        feedback.style.display = "block";
        feedback.textContent = `${displayName} iniciou treino de ${trainingViewState.selectedStatKey.toUpperCase()} por ${formatDuration(job.endsAt - job.startedAt)}.`;
      }

      trainingViewState.selectedQuantity = 1;
      trainingViewState.selectedDigimonUid = "";
      window.dispatchEvent(new Event("digilegends:rerender"));
    } catch (error) {
      if (feedback) {
        feedback.style.display = "block";
        feedback.textContent = error.message || "Nao foi possivel iniciar o treino.";
      }
    }
  });

  document.querySelectorAll(".js-claim-training").forEach((button) => {
    button.addEventListener("click", () => {
      const feedback = document.getElementById("trainingFeedback");

      try {
        const result = claimTrainingJob(state.save, button.dataset.digimonUid);
        saveGame(state.save);

        if (feedback) {
          const species = getDigimonSpecies(result.digimon.speciesId);
          const displayName =
            result.digimon.nickname?.trim() || species?.name || result.digimon.speciesId;
          feedback.style.display = "block";
          feedback.textContent = `${displayName} saiu do treino e recebeu +${result.totalGain} ${result.statKey.toUpperCase()}.`;
        }

        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = error.message || "Nao foi possivel retirar o Digimon do treino.";
        }
      }
    });
  });
}
