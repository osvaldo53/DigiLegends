import { HUNTS, getHuntById } from "../../data/encounters.js";
import { goToScreen } from "../../core/router.js";
import { saveGame } from "../../core/saveManager.js";
import { state } from "../../core/state.js";
import { renderHuntCard } from "../components/huntCard.js";
import {
  startHuntSession,
  stopHuntSession,
  clearHuntSummary
} from "../../systems/huntSessionSystem.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { getItemById } from "../../data/items.js";
import { useItemOnDigimon, getInventoryEntry } from "../../systems/itemSystem.js";
import { getSkillsForSpecies, getSkillById } from "../../data/skills.js";
import { getElementMultiplier } from "../../systems/elementChart.js";
import { getTypeMultiplier } from "../../systems/typeChart.js";
import { escapeHtml, clamp } from "../../core/utils.js";

const ACTION_ANIMATION_WINDOW_MS = 420;

function getActiveBattlePlayerDigimon() {
  const activeUid = state.battle.playerDigimonUid;
  const activeDigimon = state.save.party.find(
    (digimon) => digimon.uid === activeUid && (digimon.currentHP ?? 0) > 0
  );

  if (activeDigimon) {
    return activeDigimon;
  }

  return state.save.party.find((digimon) => (digimon.currentHP ?? 0) > 0) || null;
}

function getPhaseProgressPercent() {
  const duration = state.huntSession.phaseDurationMs || 0;
  const startedAt = state.huntSession.phaseStartedAt || 0;

  if (!duration || !startedAt) return 0;

  const elapsed = Date.now() - startedAt;
  return clamp((elapsed / duration) * 100, 0, 100);
}

function renderStatBar(label, current, max, className = "") {
  const pct = max > 0 ? clamp((current / max) * 100, 0, 100) : 0;

  return `
    <div class="battle-stat">
      <div class="battle-stat__top">
        <span>${label}</span>
        <span>${current}/${max}</span>
      </div>
      <div class="battle-bar ${className}">
        <span style="width:${pct}%;"></span>
      </div>
    </div>
  `;
}

function renderBattleSide({
  title,
  sprite,
  typeLabel,
  elementLabel,
  typeTone,
  typeMultiplier,
  hpCurrent,
  hpMax,
  spCurrent,
  spMax,
  attackValue,
  defValue,
  sideType
}) {
  const lastAction = state.battle.lastAction;
  const isRecentAction =
    !!lastAction &&
    Date.now() - lastAction.timestamp <= ACTION_ANIMATION_WINDOW_MS;

  const isAttacking = isRecentAction && lastAction.actor === sideType;
  const isTarget = isRecentAction && lastAction.target === sideType;

  const sideClass = [
    "hunt-battle-card",
    sideType === "player" ? "hunt-battle-card--player" : "hunt-battle-card--enemy",
    isAttacking ? "is-attacking" : "",
    isTarget ? "is-hit" : ""
  ].join(" ").trim();

  return `
    <article class="${sideClass}">
      <h3>${escapeHtml(title)}</h3>

      <div class="battle-affinity-row">
        <span class="battle-affinity-pill battle-affinity-pill--type battle-affinity-pill--${escapeHtml(typeTone || "neutral")}">
          ${escapeHtml(typeLabel || "Unknown Type")} · ${typeMultiplier?.toFixed(2) || "1.00"}x
        </span>
        <span class="battle-affinity-pill battle-affinity-pill--element">${escapeHtml(elementLabel || "Neutral")}</span>
      </div>

      <div class="hunt-battle-card__sprite-wrap">
        <img
          class="hunt-battle-card__sprite"
          src="${escapeHtml(sprite || "")}"
          alt="${escapeHtml(title)}"
          onerror="this.style.display='none'"
        />
        ${isAttacking ? '<div class="attack-flash"></div>' : ""}
        ${isTarget ? '<div class="hit-impact"></div>' : ""}
      </div>

      ${renderStatBar("HP", hpCurrent, hpMax, "battle-bar--hp")}
      ${renderStatBar("SP", spCurrent, spMax, "battle-bar--sp")}

      <div class="hunt-battle-card__stats">
        <span>ATK: ${attackValue}</span>
        <span>DEF: ${defValue}</span>
      </div>
    </article>
  `;
}

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

function renderBattleSupportItems() {
  const allowedItemIds = ["bandage", "small_recovery", "small_sp_disk"];
  const activePlayer = getActiveBattlePlayerDigimon();

  if (!activePlayer) {
    return '<p class="hunt-session__muted">Nenhum Digimon ativo disponivel.</p>';
  }

  const html = allowedItemIds
    .map((itemId) => {
      const item = getItemById(itemId);
      const entry = getInventoryEntry(state.save, itemId);

      if (!item || !entry || entry.quantity <= 0) {
        return "";
      }

      return `
        <button
          class="btn btn-secondary js-use-battle-item"
          data-item-id="${escapeHtml(item.id)}"
        >
          ${escapeHtml(item.name)} x${entry.quantity}
        </button>
      `;
    })
    .filter(Boolean)
    .join("");

  return html || '<p class="hunt-session__muted">Nenhum item utilizavel disponivel.</p>';
}

function getMultiplierTone(multiplier) {
  if (multiplier > 1) return "advantage";
  if (multiplier < 1) return "disadvantage";
  return "neutral";
}

function getMultiplierText(multiplier, labels) {
  if (multiplier > 1) return labels.advantage;
  if (multiplier < 1) return labels.disadvantage;
  return labels.neutral;
}

function formatMultiplier(multiplier) {
  return `${multiplier.toFixed(2)}x`;
}

function renderActiveSkills(playerDigimon, playerSpecies, enemySpecies) {
  if (!playerDigimon || !playerSpecies || !enemySpecies) {
    return "";
  }

  const skillIds = getSkillsForSpecies(playerSpecies.id).slice(0, 4);
  const lastAction = state.battle.lastAction;

  if (!skillIds.length) {
    return `
      <div class="hunt-skills-panel">
        <h3>Skills ativas</h3>
        <p class="hunt-session__muted">Este Digimon ainda nao possui skills ativas.</p>
      </div>
    `;
  }

  const skillsHtml = skillIds
    .map((skillId) => {
      const skill = getSkillById(skillId);
      if (!skill) return "";

      const hasEnoughSP = (playerDigimon.currentSP ?? 0) >= (skill.cost ?? 0);
      const isRecentAction =
        !!lastAction &&
        Date.now() - lastAction.timestamp <= ACTION_ANIMATION_WINDOW_MS;

      const isUsedNow =
        isRecentAction &&
        lastAction.actor === "player" &&
        !lastAction.isBasicAttack &&
        lastAction.skillId === skill.id;

      const elementMultiplier = getElementMultiplier(
        skill.element || "Neutral",
        enemySpecies.element || "Neutral"
      );

      const classes = [
        "hunt-skill-card",
        isUsedNow ? "is-active" : "",
        !hasEnoughSP ? "is-disabled" : ""
      ].join(" ").trim();

      return `
        <article class="${classes}">
          <div class="hunt-skill-card__top">
            <strong>${escapeHtml(skill.name)}</strong>
            <span>${escapeHtml(skill.element || skill.kind || "")}</span>
          </div>

          <div class="hunt-skill-card__meta">
            <span>${skill.kind === "healing" ? "Heal" : `Power: ${skill.power ?? 0}`}</span>
            <span>SP: ${skill.cost}</span>
          </div>

          <div class="hunt-skill-card__matchup">
            <span class="matchup-pill matchup-pill--${getMultiplierTone(elementMultiplier)}">
              Elemento ${formatMultiplier(elementMultiplier)}
            </span>
          </div>
        </article>
      `;
    })
    .join("");

  return `
    <div class="hunt-skills-panel">
      <h3>Skills ativas</h3>
      <p class="hunt-session__muted">
        Alvo atual: ${escapeHtml(enemySpecies.name)} · Tipo ${escapeHtml(enemySpecies.type)} · Elemento ${escapeHtml(enemySpecies.element)}
      </p>
      <div class="hunt-skills-grid">
        ${skillsHtml}
      </div>
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
  const player = getActiveBattlePlayerDigimon();
  const activeHunt = state.huntSession.huntId ? getHuntById(state.huntSession.huntId) : null;
  const enemy = state.battle.enemy;
  const enemySpecies = enemy ? getDigimonSpecies(enemy.speciesId) : null;
  const playerSpecies = player ? getDigimonSpecies(player.speciesId) : null;
  const progressPercent = getPhaseProgressPercent();
  const playerTypeMultiplier =
    playerSpecies && enemySpecies
      ? getTypeMultiplier(playerSpecies.type, enemySpecies.type)
      : 1;
  const enemyTypeMultiplier =
    enemySpecies && playerSpecies
      ? getTypeMultiplier(enemySpecies.type, playerSpecies.type)
      : 1;

  const actionActorName =
    state.battle.lastAction?.actor === "player"
      ? playerSpecies?.name || "Aliado"
      : enemySpecies?.name || "Inimigo";

  const actionText = state.battle.lastAction
    ? `${actionActorName} usou ${state.battle.lastAction.moveName}`
    : "Aguardando proxima acao";

  return `
    <section class="screen">
      <div class="panel hunt-session-panel">
        <div class="hunt-session-panel__top">
          <div>
            <h2>Hunt em andamento</h2>
            <p class="hunt-session__muted">
              ${escapeHtml(activeHunt?.name || "Area desconhecida")} · Status: ${escapeHtml(state.huntSession.status)}
            </p>
          </div>

          <div class="button-row">
            <button class="btn btn-danger" id="btn-stop-hunt">Parar hunt</button>
            <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
          </div>
        </div>

        <div class="hunt-session-summary">
          <span class="status-pill">Vitorias: ${state.huntSession.totalWins}</span>
          <span class="status-pill">Derrotas: ${state.huntSession.totalDefeats}</span>
          <span class="status-pill">Bits: ${state.huntSession.totalBitsEarned}</span>
          <span class="status-pill">EXP: ${state.huntSession.totalExpEarned}</span>
        </div>

        <div class="hunt-phase">
          <div class="hunt-phase__top">
            <span>${escapeHtml(state.huntSession.phaseLabel || "Em andamento")}</span>
          </div>
          <div class="hunt-phase__bar">
            <span style="width:${progressPercent}%;"></span>
          </div>
        </div>

        ${
          player && enemy
            ? `
              <div class="hunt-battle-grid">
              ${renderBattleSide({
                  title: `${playerSpecies?.name || "Aliado"} · Lv. ${player.level}`,
                  sprite: playerSpecies?.sprite || "",
                  typeLabel: playerSpecies?.type || "Unknown Type",
                  elementLabel: playerSpecies?.element || "Neutral",
                  typeTone: getMultiplierTone(playerTypeMultiplier),
                  typeMultiplier: playerTypeMultiplier,
                  hpCurrent: player.currentHP,
                  hpMax: player.finalStats.hp,
                  spCurrent: player.currentSP,
                  spMax: player.finalStats.sp,
                  attackValue: player.finalStats.atk,
                  defValue: player.finalStats.def,
                  sideType: "player"
                })}

                ${renderBattleSide({
                  title: `${enemySpecies?.name || "Inimigo"} · Lv. ${enemy.level}`,
                  sprite: enemySpecies?.sprite || "",
                  typeLabel: enemySpecies?.type || "Unknown Type",
                  elementLabel: enemySpecies?.element || "Neutral",
                  typeTone: getMultiplierTone(enemyTypeMultiplier),
                  typeMultiplier: enemyTypeMultiplier,
                  hpCurrent: enemy.currentHP,
                  hpMax: enemy.finalStats.hp,
                  spCurrent: enemy.currentSP,
                  spMax: enemy.finalStats.sp,
                  attackValue: enemy.finalStats.atk,
                  defValue: enemy.finalStats.def,
                  sideType: "enemy"
                })}
              </div>

              <div class="hunt-action-banner">
                ${escapeHtml(actionText)}
              </div>

              ${renderActiveSkills(player, playerSpecies, enemySpecies)}
            `
            : `
              <div class="hunt-empty-battle">
                <p class="hunt-session__muted">Nenhuma batalha ativa neste momento.</p>
              </div>
            `
        }

        <div class="hunt-session-extras">
          <div class="hunt-session-box">
            <h3>Suporte</h3>
            <div class="button-row">
              ${renderBattleSupportItems()}
            </div>
            <div id="huntItemFeedback" style="margin-top:12px;"></div>
          </div>

          <div class="hunt-session-box">
            <h3>Itens dropados</h3>
            ${renderDrops(state.huntSession.drops)}
          </div>

          <div class="hunt-session-box">
            <h3>Log recente</h3>
            <div class="hunt-log">
              ${
                state.battle.log.length
                  ? state.battle.log.map((line) => `<p>${escapeHtml(line)}</p>`).join("")
                  : '<p class="hunt-session__muted">Sem eventos registrados ainda.</p>'
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
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

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Nivel do lider: ${playerLevel}</span>
          <span class="status-pill">Hunts concluidas: ${state.save.progress.huntsCompleted}</span>
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

  document.getElementById("btn-stop-hunt")?.addEventListener("click", () => {
    stopHuntSession();
  });

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

  document.querySelectorAll(".js-use-battle-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const feedback = document.getElementById("huntItemFeedback");
      const targetDigimon = getActiveBattlePlayerDigimon();

      if (!targetDigimon) {
        if (feedback) {
          feedback.innerHTML = '<p class="hunt-session__muted">Nao ha Digimon valido para usar o item.</p>';
        }
        return;
      }

      try {
        const result = useItemOnDigimon({
          save: state.save,
          itemId,
          targetDigimon,
          context: "battle"
        });

        saveGame(state.save);

        if (feedback) {
          feedback.innerHTML = `<p>${escapeHtml(result.item.name)} usado com sucesso.</p>`;
        }

        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        if (feedback) {
          feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Nao foi possivel usar o item.")}</p>`;
        }
      }
    });
  });
}
