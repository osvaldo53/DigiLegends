import { HUNTS, getHuntById } from "../../data/encounters.js";
import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { renderHuntCard } from "../components/huntCard.js";
import { renderBattleSessionView, bindBattleSessionView } from "../components/battleSessionView.js";
import { renderTamerProgress } from "../components/tamerProgress.js";
import {
  startHuntSession,
  stopHuntSession,
  clearHuntSummary,
  beginBattleItemTargetSelection,
  cancelBattleItemTargetSelection,
  getBattleItemEligibleTargets,
  toggleAutoBattleMode,
  updateAutoItemSlot,
  performManualBattleAction,
  useBattleItemTurn,
  switchBattleDigimonTurn
} from "../../systems/huntSessionSystem.js";
import { escapeHtml } from "../../core/utils.js";

function renderDrops(items) {
  if (!items.length) {
    return '<p class="hunt-session__muted">Nenhum item dropado ate agora.</p>';
  }

  return `
    <div class="hunt-drop-list">
      ${items
        .map((item) => `<span class="hunt-drop-pill">${escapeHtml(item.name)} x${item.quantity}</span>`)
        .join("")}
    </div>
  `;
}

function renderHuntSummaryPanel() {
  const summary = state.huntSession.summary;
  const hunt = summary?.huntId ? getHuntById(summary.huntId) : null;

  if (!summary) {
    return "";
  }

  const reasonText =
    summary.reason === "defeat"
      ? "Seu time foi derrotado."
      : "A hunt foi encerrada manualmente.";

  const penaltyHtml = summary.penaltyBits
    ? `<p>Penalidade por derrota: -${summary.penaltyBits} Bits.</p>`
    : "";

  const healHtml = summary.healedDigimons.length
    ? `<p>Digimons recuperados para a proxima hunt: ${escapeHtml(summary.healedDigimons.join(", "))}.</p>`
    : "";

  return `
    <section class="screen">
      <div class="panel">
        <h2>Resumo da Hunt</h2>
        <p>${escapeHtml(hunt?.name || "Hunt")} encerrada. ${escapeHtml(reasonText)}</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Batalhas: ${summary.totalBattles}</span>
          <span class="status-pill">Vitorias: ${summary.totalWins}</span>
          <span class="status-pill">Derrotas: ${summary.totalDefeats}</span>
        </div>

        <div class="hunt-session-box" style="margin-bottom:16px;">
          <h3>Recompensas da sessao</h3>
          <p>Bits ganhos: ${summary.totalBitsEarned}</p>
          <p>EXP ganha: ${summary.totalExpEarned}</p>
          <p>Tamer EXP ganha: ${summary.totalTamerExpEarned || 0}</p>
          ${penaltyHtml}
          ${summary.message ? `<p>${escapeHtml(summary.message)}</p>` : ""}
          ${healHtml}
        </div>

        <div class="hunt-session-box" style="margin-bottom:16px;">
          <h3>Itens dropados</h3>
          ${renderDrops(summary.drops)}
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="btn-close-hunt-summary">Fechar resumo</button>
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

function renderActiveSessionPanel() {
  const activeHunt = state.huntSession.huntId ? getHuntById(state.huntSession.huntId) : null;

  return renderBattleSessionView({
    session: state.huntSession,
    title: "Hunt em andamento",
    subtitle: `${activeHunt?.name || "Area desconhecida"} · Status: ${state.huntSession.status}`,
    topSummaryItems: [
      `Vitorias: ${state.huntSession.totalWins}`,
      `Derrotas: ${state.huntSession.totalDefeats}`,
      `Bits: ${state.huntSession.totalBitsEarned}`,
      `EXP: ${state.huntSession.totalExpEarned}`,
      `Tamer EXP: ${state.huntSession.totalTamerExpEarned || 0}`
    ],
    stopButtonText: "Parar hunt",
    getEligibleItemTargets: getBattleItemEligibleTargets,
    onUpdateAutoItemSlot: updateAutoItemSlot,
    dropsTitle: "Itens dropados",
    drops: state.huntSession.drops,
    emptyDropsText: "Nenhum item dropado ate agora.",
    switchDescription: "Escolha outro Digimon vivo do time para entrar em combate. A troca consome o turno do jogador.",
    noBattleMessage: "Nenhuma batalha ativa neste momento.",
    noLiveBattleMessage: "Os cards permanecem na tela enquanto a proxima batalha e preparada.",
    getPlaceholderEnemyState: (session) => ({
      name: session.status === "searching" ? "Procurando inimigo" : "Inimigo",
      type: "Aguardando",
      element: "Standby",
      sprite: "",
      isPlaceholder: true,
      message: session.status === "searching" ? "Procurando inimigo" : "Aguardando proximo combate",
      detail: session.status === "searching" ? "Escaneando area" : "Preparando encontro"
    })
  });
}

export function renderHuntsScreen() {
  const player = state.save.party[0];
  const playerLevel = player?.level || 1;

  if (state.huntSession.active) {
    return renderActiveSessionPanel();
  }

  if (state.huntSession.summary) {
    return renderHuntSummaryPanel();
  }

  const cards = HUNTS.map((hunt) => renderHuntCard(hunt, playerLevel)).join("");

  return `
    <section class="screen">
      <div class="panel">
        <h2>Hunts</h2>
        <p>Escolha uma area para iniciar uma hunt automatica.</p>
        ${renderTamerProgress(state.save, { compact: true })}

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Nivel do lider: ${playerLevel}</span>
          <span class="status-pill">Hunts concluidas: ${state.save.progress.huntsCompleted}</span>
          <span class="status-pill">Auto battle padrao: ${state.save.combat?.autoBattleEnabled !== false ? "Ligado" : "Desligado"}</span>
        </div>

        <div class="card-grid">
          ${cards}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindHuntsScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-close-hunt-summary")?.addEventListener("click", () => {
    clearHuntSummary();
  });

  if (state.huntSession.active) {
    bindBattleSessionView({
      onStopSession: stopHuntSession,
      onToggleAutoBattle: toggleAutoBattleMode,
      onPerformManualAction: performManualBattleAction,
      onSwitchDigimon: switchBattleDigimonTurn,
      onUseItemTurn: useBattleItemTurn,
      onBeginItemTargetSelection: beginBattleItemTargetSelection,
      onCancelItemTargetSelection: cancelBattleItemTargetSelection,
      onUpdateAutoItemSlot: updateAutoItemSlot
    });
  }

  document.querySelectorAll(".js-start-hunt").forEach((button) => {
    button.addEventListener("click", () => {
      const huntId = button.dataset.huntId;

      try {
        startHuntSession(huntId);
      } catch (error) {
        window.alert(error.message || "Nao foi possivel iniciar a hunt.");
      }
    });
  });
}
