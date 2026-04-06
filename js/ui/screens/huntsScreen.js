import { HUNTS, getHuntById } from "../../data/encounters.js";
import { goToScreen } from "../../core/router.js";
import { saveGame } from "../../core/saveManager.js";
import { state } from "../../core/state.js";
import { renderHuntCard } from "../components/huntCard.js";
import { startHuntSession, stopHuntSession } from "../../systems/huntSessionSystem.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { getItemById } from "../../data/items.js";
import { useItemOnDigimon, getInventoryEntry } from "../../systems/itemSystem.js";
import {
  getSkillsForSpecies,
  getSkillById
} from "../../data/skills.js";
import { escapeHtml, clamp } from "../../core/utils.js";

/**
 * Janela curta em que a UI considera a ação como "ativa"
 * para disparar animação visual.
 */
const ACTION_ANIMATION_WINDOW_MS = 420;

/**
 * Retorna o Digimon atualmente ativo na batalha.
 *
 * Importante:
 * - não usar state.save.party[0] durante a hunt ativa
 * - o Digimon em combate é controlado por state.battle.playerDigimonUid
 */
function getActiveBattlePlayerDigimon() {
  const activeUid = state.battle.playerDigimonUid;

  if (!activeUid) {
    return state.save.party[0] || null;
  }

  return state.save.party.find((digimon) => digimon.uid === activeUid) || null;
}

/**
 * Calcula o progresso visual da fase atual.
 */
function getPhaseProgressPercent() {
  const duration = state.huntSession.phaseDurationMs || 0;
  const startedAt = state.huntSession.phaseStartedAt || 0;

  if (!duration || !startedAt) return 0;

  const elapsed = Date.now() - startedAt;
  return clamp((elapsed / duration) * 100, 0, 100);
}

/**
 * Renderiza barra de HP/SP.
 */
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

/**
 * Renderiza um dos lados da batalha.
 */
function renderBattleSide({
  title,
  sprite,
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

/**
 * Renderiza os drops acumulados na sessão.
 */
function renderDrops() {
  if (!state.huntSession.drops.length) {
    return '<p class="hunt-session__muted">Nenhum item dropado até agora.</p>';
  }

  return `
    <div class="hunt-drop-list">
      ${state.huntSession.drops
        .map((item) => `<span class="hunt-drop-pill">${escapeHtml(item.name)} x${item.quantity}</span>`)
        .join("")}
    </div>
  `;
}

/**
 * Renderiza botões rápidos de item durante a hunt.
 */
function renderBattleSupportItems() {
  const allowedItemIds = ["bandage", "small_recovery", "small_sp_disk"];
  const activePlayer = getActiveBattlePlayerDigimon();

  if (!activePlayer) {
    return '<p class="hunt-session__muted">Nenhum Digimon ativo disponível.</p>';
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

  return html || '<p class="hunt-session__muted">Nenhum item utilizável disponível.</p>';
}

/**
 * Renderiza até 4 skills ativas do Digimon do jogador.
 */
function renderActiveSkills(playerDigimon, playerSpecies) {
  if (!playerDigimon || !playerSpecies) {
    return "";
  }

  const skillIds = getSkillsForSpecies(playerSpecies.id).slice(0, 4);
  const lastAction = state.battle.lastAction;

  if (!skillIds.length) {
    return `
      <div class="hunt-skills-panel">
        <h3>Skills ativas</h3>
        <p class="hunt-session__muted">Este Digimon ainda não possui skills ativas.</p>
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
        </article>
      `;
    })
    .join("");

  return `
    <div class="hunt-skills-panel">
      <h3>Skills ativas</h3>
      <div class="hunt-skills-grid">
        ${skillsHtml}
      </div>
    </div>
  `;
}

/**
 * Painel principal da sessão de hunt ativa.
 */
function renderActiveSessionPanel() {
  const player = getActiveBattlePlayerDigimon();
  const activeHunt = state.huntSession.huntId ? getHuntById(state.huntSession.huntId) : null;
  const enemy = state.battle.enemy;
  const enemySpecies = enemy ? getDigimonSpecies(enemy.speciesId) : null;
  const playerSpecies = player ? getDigimonSpecies(player.speciesId) : null;
  const progressPercent = getPhaseProgressPercent();

  const actionText = state.battle.lastAction
    ? `${state.battle.lastAction.actor === "player" ? (playerSpecies?.name || "Aliado") : (enemySpecies?.name || "Inimigo")} usou ${state.battle.lastAction.moveName}`
    : "Aguardando próxima ação";

  return `
    <section class="screen">
      <div class="panel hunt-session-panel">
        <div class="hunt-session-panel__top">
          <div>
            <h2>Hunt em andamento</h2>
            <p class="hunt-session__muted">
              ${escapeHtml(activeHunt?.name || "Área desconhecida")} · Status: ${escapeHtml(state.huntSession.status)}
            </p>
          </div>

          <div class="button-row">
            <button class="btn btn-danger" id="btn-stop-hunt">Parar hunt</button>
            <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
          </div>
        </div>

        <div class="hunt-session-summary">
          <span class="status-pill">Vitórias: ${state.huntSession.totalWins}</span>
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

              ${renderActiveSkills(player, playerSpecies)}
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
            ${renderDrops()}
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

/**
 * Tela de hunts.
 */
export function renderHuntsScreen() {
  const player = state.save.party[0];
  const playerLevel = player?.level || 1;

  if (state.huntSession.active) {
    return renderActiveSessionPanel();
  }

  const cards = HUNTS.map((hunt) => renderHuntCard(hunt, playerLevel)).join("");

  return `
    <section class="screen">
      <div class="panel">
        <h2>Hunts</h2>
        <p>Escolha uma área para iniciar uma hunt automática.</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Nível do líder: ${playerLevel}</span>
          <span class="status-pill">Hunts concluídas: ${state.save.progress.huntsCompleted}</span>
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

/**
 * Eventos da tela de hunts.
 */
export function bindHuntsScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
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
        window.alert(error.message || "Não foi possível iniciar a hunt.");
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
          feedback.innerHTML = '<p class="hunt-session__muted">Não há Digimon válido para usar o item.</p>';
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
          feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Não foi possível usar o item.")}</p>`;
        }
      }
    });
  });
}