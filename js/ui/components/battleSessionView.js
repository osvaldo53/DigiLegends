import { state } from "../../core/state.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { getItemById, ITEMS } from "../../data/items.js";
import { getSkillById, getSkillsForSpecies } from "../../data/skills.js";
import { escapeHtml, clamp } from "../../core/utils.js";
import { getElementMultiplier } from "../../systems/elementChart.js";
import { getInventoryEntry } from "../../systems/itemSystem.js";
import { getExpToNextLevel } from "../../systems/progressionSystem.js";
import { getTypeMultiplier } from "../../systems/typeChart.js";

const ACTION_ANIMATION_WINDOW_MS = 420;
const BATTLE_ITEM_IDS = Object.keys(ITEMS).filter((itemId) => ITEMS[itemId].usableInBattle);

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

function isAutoBattleEnabled() {
  return state.save.combat?.autoBattleEnabled !== false;
}

function getPhaseProgressPercent(session) {
  const duration = session.phaseDurationMs || 0;
  const startedAt = session.phaseStartedAt || 0;

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

function renderExpBar(level, currentExp) {
  const expToNextLevel = getExpToNextLevel(level);
  const safeCurrentExp = clamp(currentExp ?? 0, 0, expToNextLevel);
  const pct = expToNextLevel > 0 ? clamp((safeCurrentExp / expToNextLevel) * 100, 0, 100) : 0;

  return `
    <div class="battle-stat">
      <div class="battle-stat__top">
        <span>EXP</span>
        <span>${safeCurrentExp}/${expToNextLevel}</span>
      </div>
      <div class="battle-bar battle-bar--exp">
        <span style="width:${pct}%;"></span>
      </div>
    </div>
  `;
}

function getMultiplierTone(multiplier) {
  if (multiplier > 1) return "advantage";
  if (multiplier < 1) return "disadvantage";
  return "neutral";
}

function formatMultiplier(multiplier) {
  return `${multiplier.toFixed(2)}x`;
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
  expCurrent,
  level,
  attackValue,
  defValue,
  sideType,
  showExp = false,
  isPlaceholder = false,
  placeholderMessage = "",
  placeholderDetail = ""
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
    isPlaceholder ? "hunt-battle-card--placeholder" : "",
    isAttacking ? "is-attacking" : "",
    isTarget ? "is-hit" : ""
  ].join(" ").trim();

  if (isPlaceholder) {
    return `
      <article class="${sideClass}">
        <h3>${escapeHtml(title)}</h3>
        <div class="battle-affinity-row">
          <span class="battle-affinity-pill battle-affinity-pill--type battle-affinity-pill--neutral">
            Aguardando
          </span>
          <span class="battle-affinity-pill battle-affinity-pill--element">Standby</span>
        </div>
        <div class="hunt-battle-card__sprite-wrap hunt-battle-card__sprite-wrap--placeholder">
          <div class="hunt-battle-card__placeholder-orb"></div>
        </div>
        <div class="battle-stat battle-stat--placeholder">
          <div class="battle-stat__top">
            <span>${escapeHtml(placeholderMessage || "Preparando")}</span>
            <span>${escapeHtml(placeholderDetail || "...")}</span>
          </div>
          <div class="battle-bar battle-bar--placeholder">
            <span></span>
          </div>
        </div>
        <div class="battle-stat battle-stat--placeholder">
          <div class="battle-stat__top">
            <span>Assinatura</span>
            <span>--</span>
          </div>
          <div class="battle-bar battle-bar--placeholder">
            <span></span>
          </div>
        </div>
        <div class="hunt-battle-card__stats hunt-battle-card__stats--placeholder">
          <span>ATK: --</span>
          <span>DEF: --</span>
        </div>
      </article>
    `;
  }

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
      ${showExp ? renderExpBar(level, expCurrent) : ""}
      <div class="hunt-battle-card__stats">
        <span>ATK: ${attackValue}</span>
        <span>DEF: ${defValue}</span>
      </div>
    </article>
  `;
}

function renderDrops(items, emptyText) {
  if (!items.length) {
    return `<p class="hunt-session__muted">${escapeHtml(emptyText)}</p>`;
  }

  return `
    <div class="hunt-drop-list">
      ${items
        .map((item) => `<span class="hunt-drop-pill">${escapeHtml(item.name)} x${item.quantity}</span>`)
        .join("")}
    </div>
  `;
}

function renderBattleSupportItems(canUseItem) {
  const activePlayer = getActiveBattlePlayerDigimon();

  if (!activePlayer) {
    return '<p class="hunt-session__muted">Nenhum Digimon ativo disponivel.</p>';
  }

  const html = BATTLE_ITEM_IDS
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
          ${canUseItem ? "" : "disabled"}
        >
          ${escapeHtml(item.name)} x${entry.quantity}
        </button>
      `;
    })
    .filter(Boolean)
    .join("");

  return html || '<p class="hunt-session__muted">Nenhum item utilizavel disponivel.</p>';
}

function renderPendingBattleItemSelection(pendingBattleItem, getEligibleItemTargets) {
  if (!pendingBattleItem?.itemId) {
    return "";
  }

  const item = getItemById(pendingBattleItem.itemId);
  const targets = getEligibleItemTargets(pendingBattleItem.itemId);

  if (!item || !targets.length) {
    return "";
  }

  return `
    <div class="hunt-session-box" style="margin-top:12px;">
      <h3>Escolher alvo do ${escapeHtml(item.name)}</h3>
      <p class="hunt-session__muted">
        Selecione um Digimon derrotado para receber o efeito do item.
      </p>
      <div class="hunt-target-grid">
        ${targets
          .map((digimon) => {
            const species = getDigimonSpecies(digimon.speciesId);

            return `
              <button
                class="hunt-skill-card hunt-skill-card--defeated hunt-skill-card--target js-select-battle-item-target"
                data-item-id="${escapeHtml(item.id)}"
                data-digimon-uid="${escapeHtml(digimon.uid)}"
              >
                <div class="hunt-skill-card__top">
                  <strong>${escapeHtml(species?.name || digimon.nickname || digimon.speciesId)}</strong>
                  <span class="hunt-skill-card__status">Derrotado</span>
                </div>
                <div class="hunt-skill-card__meta">
                  <span>Lv. ${digimon.level}</span>
                  <span>HP: 0/${digimon.finalStats.hp}</span>
                  <span>SP: ${digimon.currentSP}/${digimon.finalStats.sp}</span>
                </div>
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="button-row" style="margin-top:12px;">
        <button class="btn btn-secondary" id="btn-cancel-battle-item-target">Cancelar</button>
      </div>
    </div>
  `;
}

function renderAutoItemSettings(onAutoItemRule) {
  if (!onAutoItemRule) {
    return "";
  }

  const config = state.save.combat?.autoItemRules || {};

  return BATTLE_ITEM_IDS.map((itemId) => {
    const item = getItemById(itemId);
    const entry = getInventoryEntry(state.save, itemId);
    const rule = config[itemId];

    if (!item || !rule) {
      return "";
    }

    return `
      <div class="hunt-auto-item-row" style="margin-top:10px;">
        <div class="button-row" style="align-items:center;">
          <label style="display:flex; align-items:center; gap:6px;">
            <input
              type="checkbox"
              class="js-auto-item-enabled"
              data-item-id="${escapeHtml(itemId)}"
              ${rule.enabled ? "checked" : ""}
            />
            <span>${escapeHtml(item.name)}${entry ? ` x${entry.quantity}` : " x0"}</span>
          </label>

          <select class="js-auto-item-resource" data-item-id="${escapeHtml(itemId)}">
            <option value="hp" ${rule.resource === "hp" ? "selected" : ""}>HP</option>
            <option value="sp" ${rule.resource === "sp" ? "selected" : ""}>SP</option>
          </select>

          <label style="display:flex; align-items:center; gap:6px;">
            <span>abaixo de</span>
            <input
              type="number"
              min="1"
              max="100"
              value="${rule.thresholdPercent}"
              class="js-auto-item-threshold"
              data-item-id="${escapeHtml(itemId)}"
              style="width:72px;"
            />
            <span>%</span>
          </label>
        </div>
      </div>
    `;
  }).join("");
}

function renderBattleSwitchOptions(canAct) {
  const activePlayer = getActiveBattlePlayerDigimon();

  if (!activePlayer) {
    return '<p class="hunt-session__muted">Nenhum Digimon ativo disponivel.</p>';
  }

  const availableDigimons = state.save.party.filter((digimon) => {
    if (digimon.uid === activePlayer.uid) {
      return false;
    }

    return (digimon.currentHP ?? 0) > 0;
  });

  if (!availableDigimons.length) {
    return '<p class="hunt-session__muted">Nao ha outro Digimon vivo no time para trocar agora.</p>';
  }

  return `
    <div class="hunt-target-grid">
      ${availableDigimons
        .map((digimon) => {
          const species = getDigimonSpecies(digimon.speciesId);

          return `
            <button
              class="hunt-skill-card hunt-skill-card--target js-switch-battle-digimon"
              data-digimon-uid="${escapeHtml(digimon.uid)}"
              ${canAct ? "" : "disabled"}
            >
              <div class="hunt-skill-card__top">
                <strong>${escapeHtml(species?.name || digimon.nickname || digimon.speciesId)}</strong>
                <span>Lv. ${digimon.level}</span>
              </div>
              <div class="hunt-skill-card__meta">
                <span>HP: ${digimon.currentHP}/${digimon.finalStats.hp}</span>
                <span>SP: ${digimon.currentSP}/${digimon.finalStats.sp}</span>
              </div>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderActiveSkills(playerDigimon, enemySpecies, canAct) {
  const playerSpecies = playerDigimon ? getDigimonSpecies(playerDigimon.speciesId) : null;

  if (!playerDigimon || !playerSpecies || !enemySpecies || enemySpecies.isPlaceholder) {
    return "";
  }

  const skillIds = getSkillsForSpecies(playerSpecies.id).slice(0, 4);
  const lastAction = state.battle.lastAction;
  const manualMode = !isAutoBattleEnabled();

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
        !hasEnoughSP || (manualMode && !canAct) ? "is-disabled" : ""
      ].join(" ").trim();

      return `
        <button
          class="${classes} js-manual-skill"
          data-skill-id="${escapeHtml(skill.id)}"
          ${manualMode && canAct && hasEnoughSP ? "" : "disabled"}
        >
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
        </button>
      `;
    })
    .join("");

  return `
    <div class="hunt-skills-panel">
      <h3>Skills ativas</h3>
      <p class="hunt-session__muted">
        Alvo atual: ${escapeHtml(enemySpecies.name)} · Tipo ${escapeHtml(enemySpecies.type)} · Elemento ${escapeHtml(enemySpecies.element)}
      </p>
      ${
        manualMode
          ? `<p class="hunt-session__muted">No modo manual, clique em uma skill para agir. Skills sem SP suficiente ficam desativadas.</p>`
          : ""
      }
      <div class="hunt-skills-grid">
        ${skillsHtml}
      </div>
    </div>
  `;
}

function renderCombatControlPanel(turnOwner, canAct) {
  const autoEnabled = isAutoBattleEnabled();

  return `
    <div class="hunt-session-box">
      <h3>Controle de combate</h3>
      <div class="button-row">
        <span class="status-pill">Modo: ${autoEnabled ? "Automatico" : "Manual"}</span>
        <span class="status-pill">Turno: ${escapeHtml(turnOwner || "-")}</span>
      </div>
      <div class="button-row" style="margin-top:12px;">
        <button class="btn btn-secondary" id="btn-toggle-auto-battle">
          ${autoEnabled ? "Desativar auto battle" : "Ativar auto battle"}
        </button>
        <button class="btn btn-primary" id="btn-basic-attack" ${!canAct ? "disabled" : ""}>
          Ataque Basico
        </button>
      </div>
      <p class="hunt-session__muted" style="margin-top:10px;">
        Itens usados manualmente tambem consomem o turno do jogador. No modo manual, clique numa skill ou use o ataque basico.
      </p>
    </div>
  `;
}

export function renderBattleSessionView({
  session,
  title,
  subtitle,
  topSummaryItems,
  stopButtonText,
  getEligibleItemTargets,
  onUpdateAutoItemRule,
  dropsTitle,
  drops,
  emptyDropsText,
  switchDescription,
  noBattleMessage,
  noLiveBattleMessage,
  getPlaceholderEnemyState
}) {
  const player = getActiveBattlePlayerDigimon();
  const enemy = state.battle.enemy || {
    level: 0,
    currentHP: 0,
    currentSP: 0,
    finalStats: { hp: 0, sp: 0, atk: 0, def: 0 }
  };
  const enemySpecies = enemy ? getDigimonSpecies(enemy.speciesId) : null;
  const playerSpecies = player ? getDigimonSpecies(player.speciesId) : null;
  const progressPercent = getPhaseProgressPercent(session);
  const canAct =
    session.active &&
    state.battle.active &&
    !state.battle.result &&
    session.turnOwner === "player";
  const playerTypeMultiplier =
    playerSpecies && enemySpecies ? getTypeMultiplier(playerSpecies.type, enemySpecies.type) : 1;
  const enemyTypeMultiplier =
    enemySpecies && playerSpecies ? getTypeMultiplier(enemySpecies.type, playerSpecies.type) : 1;
  const hasLiveBattle = Boolean(player && enemy && enemySpecies);
  const placeholderEnemyState = getPlaceholderEnemyState(session);
  const displayEnemySpecies = hasLiveBattle ? enemySpecies : placeholderEnemyState;
  const actionActorName =
    state.battle.lastAction?.actor === "player"
      ? playerSpecies?.name || "Aliado"
      : displayEnemySpecies?.name || "Inimigo";
  const actionText = state.battle.lastAction
    ? `${actionActorName} usou ${state.battle.lastAction.moveName}`
    : "Aguardando proxima acao";

  return `
    <section class="screen">
      <div class="panel hunt-session-panel">
        <div class="hunt-session-panel__top">
          <div>
            <h2>${escapeHtml(title)}</h2>
            <p class="hunt-session__muted">${escapeHtml(subtitle)}</p>
          </div>
          <div class="button-row">
            <button class="btn btn-danger" id="btn-stop-session">${escapeHtml(stopButtonText)}</button>
            <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
          </div>
        </div>

        <div class="hunt-session-summary">
          ${topSummaryItems.map((item) => `<span class="status-pill">${escapeHtml(item)}</span>`).join("")}
        </div>

        <div class="hunt-phase">
          <div class="hunt-phase__top">
            <span>${escapeHtml(session.phaseLabel || "Em andamento")}</span>
          </div>
          <div class="hunt-phase__bar">
            <span style="width:${progressPercent}%;"></span>
          </div>
        </div>

        ${
          player
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
                  expCurrent: player.exp ?? 0,
                  level: player.level,
                  attackValue: player.finalStats.atk,
                  defValue: player.finalStats.def,
                  sideType: "player",
                  showExp: true
                })}
                ${renderBattleSide({
                  title: displayEnemySpecies.isPlaceholder
                    ? displayEnemySpecies.name
                    : `${displayEnemySpecies?.name || "Inimigo"} · Lv. ${enemy.level}`,
                  sprite: displayEnemySpecies?.sprite || "",
                  typeLabel: displayEnemySpecies?.type || "Unknown Type",
                  elementLabel: displayEnemySpecies?.element || "Neutral",
                  typeTone: getMultiplierTone(enemyTypeMultiplier),
                  typeMultiplier: enemyTypeMultiplier,
                  hpCurrent: enemy.currentHP ?? 0,
                  hpMax: enemy.finalStats?.hp ?? 0,
                  spCurrent: enemy.currentSP ?? 0,
                  spMax: enemy.finalStats?.sp ?? 0,
                  attackValue: enemy.finalStats?.atk ?? 0,
                  defValue: enemy.finalStats?.def ?? 0,
                  sideType: "enemy",
                  isPlaceholder: displayEnemySpecies.isPlaceholder,
                  placeholderMessage: placeholderEnemyState.message,
                  placeholderDetail: placeholderEnemyState.detail
                })}
              </div>

              <div class="hunt-action-banner">
                ${escapeHtml(actionText)}
              </div>

              ${
                hasLiveBattle
                  ? renderActiveSkills(player, enemySpecies, canAct)
                  : `
                    <div class="hunt-empty-battle">
                      <p class="hunt-session__muted">${escapeHtml(noLiveBattleMessage)}</p>
                    </div>
                  `
              }
            `
            : `
              <div class="hunt-empty-battle">
                <p class="hunt-session__muted">${escapeHtml(noBattleMessage)}</p>
              </div>
            `
        }

        <div class="hunt-session-extras">
          ${renderCombatControlPanel(session.turnOwner, canAct)}

          <div class="hunt-session-box">
            <h3>Auto-itens</h3>
            <p class="hunt-session__muted">
              Escolha quais itens podem ser usados automaticamente e em qual percentual de HP ou SP.
            </p>
            ${renderAutoItemSettings(onUpdateAutoItemRule)}
          </div>

          <div class="hunt-session-box">
            <h3>Suporte manual</h3>
            <div class="button-row">
              ${renderBattleSupportItems(canAct)}
            </div>
            ${renderPendingBattleItemSelection(session.pendingBattleItem, getEligibleItemTargets)}
            <div id="battleItemFeedback" style="margin-top:12px;"></div>
          </div>

          <div class="hunt-session-box">
            <h3>Trocar Digimon</h3>
            <p class="hunt-session__muted">${escapeHtml(switchDescription)}</p>
            ${renderBattleSwitchOptions(canAct)}
          </div>

          <div class="hunt-session-box">
            <h3>${escapeHtml(dropsTitle)}</h3>
            ${renderDrops(drops, emptyDropsText)}
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

export function bindBattleSessionView({
  onStopSession,
  onToggleAutoBattle,
  onPerformManualAction,
  onSwitchDigimon,
  onUseItemTurn,
  onBeginItemTargetSelection,
  onCancelItemTargetSelection,
  onUpdateAutoItemRule
}) {
  document.getElementById("btn-stop-session")?.addEventListener("click", () => {
    onStopSession();
  });

  document.getElementById("btn-toggle-auto-battle")?.addEventListener("click", () => {
    onToggleAutoBattle();
  });

  document.getElementById("btn-basic-attack")?.addEventListener("click", () => {
    const feedback = document.getElementById("battleItemFeedback");

    try {
      onPerformManualAction("basic_attack");
      if (feedback) {
        feedback.innerHTML = "<p>Ataque basico executado. O turno do inimigo esta em andamento.</p>";
      }
    } catch (error) {
      if (feedback) {
        feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Nao foi possivel agir agora.")}</p>`;
      }
    }
  });

  document.querySelectorAll(".js-manual-skill").forEach((button) => {
    button.addEventListener("click", () => {
      const feedback = document.getElementById("battleItemFeedback");

      try {
        onPerformManualAction(button.dataset.skillId);
        if (feedback) {
          feedback.innerHTML = "<p>Skill executada. O turno do inimigo esta em andamento.</p>";
        }
      } catch (error) {
        if (feedback) {
          feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Nao foi possivel usar a skill.")}</p>`;
        }
      }
    });
  });

  document.querySelectorAll(".js-switch-battle-digimon").forEach((button) => {
    button.addEventListener("click", () => {
      const feedback = document.getElementById("battleItemFeedback");

      try {
        onSwitchDigimon(button.dataset.digimonUid);
        if (feedback) {
          feedback.innerHTML = "<p>Troca realizada com sucesso. O turno do inimigo esta em andamento.</p>";
        }
      } catch (error) {
        if (feedback) {
          feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Nao foi possivel trocar de Digimon.")}</p>`;
        }
      }
    });
  });

  document.querySelectorAll(".js-use-battle-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const feedback = document.getElementById("battleItemFeedback");
      const item = getItemById(itemId);

      try {
        if (item?.effect?.revivePercent) {
          onBeginItemTargetSelection(itemId);

          if (feedback) {
            feedback.innerHTML = `<p>Escolha um Digimon derrotado para usar ${escapeHtml(item.name)}.</p>`;
          }

          return;
        }

        const result = onUseItemTurn(itemId);

        if (feedback) {
          feedback.innerHTML = `<p>${escapeHtml(result.item.name)} usado com sucesso. O turno foi consumido.</p>`;
        }
      } catch (error) {
        if (feedback) {
          feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Nao foi possivel usar o item.")}</p>`;
        }
      }
    });
  });

  document.querySelectorAll(".js-select-battle-item-target").forEach((button) => {
    button.addEventListener("click", () => {
      const feedback = document.getElementById("battleItemFeedback");

      try {
        const result = onUseItemTurn(button.dataset.itemId, button.dataset.digimonUid);

        if (feedback) {
          feedback.innerHTML = `<p>${escapeHtml(result.item.name)} usado em ${escapeHtml(getDigimonSpecies(result.target.speciesId)?.name || result.target.nickname || result.target.speciesId)}. O turno foi consumido.</p>`;
        }
      } catch (error) {
        if (feedback) {
          feedback.innerHTML = `<p class="hunt-session__muted">${escapeHtml(error.message || "Nao foi possivel usar o item.")}</p>`;
        }
      }
    });
  });

  document.getElementById("btn-cancel-battle-item-target")?.addEventListener("click", () => {
    onCancelItemTargetSelection();
    const feedback = document.getElementById("battleItemFeedback");

    if (feedback) {
      feedback.innerHTML = '<p class="hunt-session__muted">Selecao de alvo cancelada.</p>';
    }
  });

  if (onUpdateAutoItemRule) {
    document.querySelectorAll(".js-auto-item-enabled").forEach((input) => {
      input.addEventListener("change", () => {
        onUpdateAutoItemRule(input.dataset.itemId, {
          enabled: input.checked
        });
      });
    });

    document.querySelectorAll(".js-auto-item-resource").forEach((select) => {
      select.addEventListener("change", () => {
        onUpdateAutoItemRule(select.dataset.itemId, {
          resource: select.value
        });
      });
    });

    document.querySelectorAll(".js-auto-item-threshold").forEach((input) => {
      const commit = () => {
        const nextValue = Math.max(1, Math.min(100, Number(input.value) || 1));
        input.value = String(nextValue);
        onUpdateAutoItemRule(input.dataset.itemId, {
          thresholdPercent: nextValue
        });
      };

      input.addEventListener("change", commit);
      input.addEventListener("blur", commit);
    });
  }
}
