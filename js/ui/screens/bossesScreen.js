import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getBossById, BOSSES } from "../../data/bosses.js";
import { escapeHtml } from "../../core/utils.js";
import { clearEvolutionAnimation } from "../../systems/evolutionAnimationSystem.js";
import {
  beginBossItemTargetSelection,
  cancelBossItemTargetSelection,
  clearBossSummary,
  getBossItemEligibleTargets,
  performManualBossAction,
  startBossSession,
  stopBossSession,
  switchBossDigimonTurn,
  toggleBossAutoBattleMode,
  updateBossAutoItemSlot,
  useBossItemTurn
} from "../../systems/bossSessionSystem.js";
import { renderBattleSessionView, bindBattleSessionView } from "../components/battleSessionView.js";
import { renderTamerProgress } from "../components/tamerProgress.js";

function renderDrops(items) {
  if (!items.length) {
    return '<p class="hunt-session__muted">Nenhum item obtido ainda.</p>';
  }

  return `
    <div class="hunt-drop-list">
      ${items
        .map((item) => `<span class="hunt-drop-pill">${escapeHtml(item.name)} x${item.quantity}</span>`)
        .join("")}
    </div>
  `;
}

function renderBossSummaryPanel() {
  const summary = state.bossSession.summary;

  if (!summary) {
    return "";
  }

  const reasonText =
    summary.reason === "victory"
      ? "Voce superou o desafio."
      : summary.reason === "defeat"
        ? "Seu time foi derrotado."
        : "O desafio foi encerrado manualmente.";

  const healHtml = summary.healedDigimons.length
    ? `<p>Digimons recuperados: ${escapeHtml(summary.healedDigimons.join(", "))}.</p>`
    : "";

  return `
    <section class="screen">
      <div class="panel">
        <h2>Resumo do Boss</h2>
        <p>${escapeHtml(summary.bossName)} encerrado. ${escapeHtml(reasonText)}</p>

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
          ${summary.message ? `<p>${escapeHtml(summary.message)}</p>` : ""}
          ${healHtml}
        </div>

        <div class="hunt-session-box" style="margin-bottom:16px;">
          <h3>Itens obtidos</h3>
          ${renderDrops(summary.drops)}
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="btn-close-boss-summary">Fechar resumo</button>
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

function renderBossCard(boss) {
  return `
    <article class="hunt-card">
      <h3>${escapeHtml(boss.name)}</h3>
      <p>${escapeHtml(boss.description)}</p>
      <div class="stat-list">
        <span>Nivel recomendado: ${boss.recommendedLevel}</span>
        <span>Etapas: ${boss.stages.length}</span>
        <span>Recompensas: ${escapeHtml(boss.rewardLabel)}</span>
      </div>
      <button class="btn btn-primary js-start-boss" data-boss-id="${escapeHtml(boss.id)}">
        Enfrentar boss
      </button>
    </article>
  `;
}

function renderActiveBossSessionPanel() {
  const boss = getBossById(state.bossSession.bossId);
  const stage = boss?.stages?.[state.bossSession.stageIndex] || null;

  return renderBattleSessionView({
    session: state.bossSession,
    title: boss?.name || "Boss",
    subtitle: `Etapa ${state.bossSession.stageIndex + 1}/${boss?.stages.length || 0} · ${stage?.name || "Preparando"} · Status: ${state.bossSession.status}`,
    topSummaryItems: [
      `Vitorias: ${state.bossSession.totalWins}`,
      `Derrotas: ${state.bossSession.totalDefeats}`,
      `Bits: ${state.bossSession.totalBitsEarned}`,
      `EXP: ${state.bossSession.totalExpEarned}`,
      `Tamer EXP: ${state.bossSession.totalTamerExpEarned || 0}`
    ],
    stopButtonText: "Parar desafio",
    getEligibleItemTargets: getBossItemEligibleTargets,
    onUpdateAutoItemSlot: updateBossAutoItemSlot,
    dropsTitle: "Recompensas obtidas",
    drops: state.bossSession.drops,
    emptyDropsText: "Nenhum item obtido ainda.",
    switchDescription: "Escolha outro Digimon vivo do time para entrar em combate. A troca consome o turno do jogador.",
    noBattleMessage: "Nenhuma batalha de boss ativa neste momento.",
    noLiveBattleMessage: "A proxima etapa do boss esta sendo preparada.",
    getPlaceholderEnemyState: (session) => ({
      name: session.status === "transitioning" ? "Transicao em andamento" : "Boss",
      type: "Aguardando",
      element: "Standby",
      sprite: "",
      isPlaceholder: true,
      message: session.status === "transitioning" ? "DNA Digivolution" : "Aguardando boss",
      detail: session.status === "transitioning" ? "Fusao em andamento" : "Preparando fase"
    })
  });
}

export function renderBossesScreen() {
  if (state.bossSession.active) {
    return renderActiveBossSessionPanel();
  }

  if (state.bossSession.summary) {
    return renderBossSummaryPanel();
  }

  return `
    <section class="screen">
      <div class="panel">
        <h2>Bosses</h2>
        <p>Desafios especiais com inimigos definidos e muito mais poderosos que as hunts comuns.</p>
        ${renderTamerProgress(state.save, { compact: true })}

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Bosses concluidos: ${state.save.progress.bossesCompleted || 0}</span>
          <span class="status-pill">Nivel sugerido: 50</span>
        </div>

        <div class="card-grid">
          ${BOSSES.map((boss) => renderBossCard(boss)).join("")}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindBossesScreen() {
  document.querySelectorAll(".js-close-evolution-modal").forEach((button) => {
    button.addEventListener("click", () => {
      clearEvolutionAnimation();
    });
  });

  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-close-boss-summary")?.addEventListener("click", () => {
    clearBossSummary();
  });

  if (state.bossSession.active) {
    bindBattleSessionView({
      onStopSession: stopBossSession,
      onToggleAutoBattle: toggleBossAutoBattleMode,
      onPerformManualAction: performManualBossAction,
      onSwitchDigimon: switchBossDigimonTurn,
      onUseItemTurn: useBossItemTurn,
      onBeginItemTargetSelection: beginBossItemTargetSelection,
      onCancelItemTargetSelection: cancelBossItemTargetSelection,
      onUpdateAutoItemSlot: updateBossAutoItemSlot
    });
  }

  document.querySelectorAll(".js-start-boss").forEach((button) => {
    button.addEventListener("click", () => {
      try {
        startBossSession(button.dataset.bossId);
      } catch (error) {
        window.alert(error.message || "Nao foi possivel iniciar o boss.");
      }
    });
  });
}
