import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { addItemToInventory, getInventoryEntry, useItemOnDigimon } from "./itemSystem.js";
import {
  startBattleFromHunt,
  performPlayerAutoAttack,
  performPlayerBattleAction,
  performPlayerDigimonSwitch,
  performEnemyAutoAttack,
  closeBattle,
  registerPlayerItemUse
} from "./battleSystem.js";

const FIRST_ENCOUNTER_DELAY_MS = 1200;
const TURN_CHARGE_DELAY_MS = 1600;
const ENEMY_RESPONSE_DELAY_MS = 900;
const NEXT_BATTLE_DELAY_MS = 2400;
const RESOLVE_DELAY_MS = 1400;
const AUTO_ITEM_ORDER = ["small_recovery", "bandage", "small_sp_disk"];

let huntTimer = null;

function rerender() {
  window.dispatchEvent(new Event("digilegends:rerender"));
}

function getActiveBattlePlayerDigimon() {
  const activeUid = state.battle.playerDigimonUid;

  return (
    state.save.party.find(
      (digimon) => digimon.uid === activeUid && (digimon.currentHP ?? 0) > 0
    ) || null
  );
}

function isAutoBattleEnabled() {
  return state.save.combat?.autoBattleEnabled !== false;
}

function setPhase(label, durationMs = 0) {
  state.huntSession.phaseLabel = label;
  state.huntSession.phaseDurationMs = durationMs;
  state.huntSession.phaseStartedAt = durationMs > 0 ? Date.now() : 0;
}

function clearHuntTimer() {
  if (huntTimer) {
    clearTimeout(huntTimer);
    huntTimer = null;
  }
}

function scheduleNextStep(callback, delay) {
  clearHuntTimer();
  huntTimer = setTimeout(() => {
    callback();
  }, delay);
}

function rollDrops() {
  const roll = Math.random();

  if (roll < 0.4) {
    return { id: "small_recovery", name: "Small Recovery", quantity: 1 };
  }

  if (roll < 0.65) {
    return { id: "bandage", name: "Bandage", quantity: 1 };
  }

  if (roll < 0.78) {
    return { id: "small_sp_disk", name: "Small SP Disk", quantity: 1 };
  }

  return null;
}

function registerDrop(drop) {
  if (!drop) return;

  const existing = state.huntSession.drops.find((item) => item.id === drop.id);

  if (existing) {
    existing.quantity += drop.quantity;
  } else {
    state.huntSession.drops.push({ ...drop });
  }

  addItemToInventory(state.save, drop.id, drop.quantity);
}

function resetActiveHuntSession() {
  state.huntSession.active = false;
  state.huntSession.huntId = null;
  state.huntSession.playerDigimonUid = null;
  state.huntSession.totalBattles = 0;
  state.huntSession.totalWins = 0;
  state.huntSession.totalDefeats = 0;
  state.huntSession.totalBitsEarned = 0;
  state.huntSession.totalExpEarned = 0;
  state.huntSession.currentBattleNumber = 0;
  state.huntSession.turnOwner = null;
  state.huntSession.status = "stopped";
  state.huntSession.drops = [];
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;
}

function buildDropSummary() {
  return state.huntSession.drops.map((drop) => ({ ...drop }));
}

function restorePartyAfterHuntEnd() {
  const healedDigimons = [];

  for (const digimon of state.save.party) {
    const hpBefore = digimon.currentHP ?? 0;
    const spBefore = digimon.currentSP ?? 0;

    digimon.currentHP = digimon.finalStats.hp;
    digimon.currentSP = digimon.finalStats.sp;

    if (hpBefore < digimon.finalStats.hp || spBefore < digimon.finalStats.sp) {
      healedDigimons.push(
        getDigimonSpecies(digimon.speciesId)?.name || digimon.nickname || digimon.speciesId
      );
    }
  }

  return healedDigimons;
}

function finalizeHuntSummary(reason, options = {}) {
  const activeHuntId = state.huntSession.huntId;

  state.huntSession.summary = {
    huntId: activeHuntId,
    reason,
    totalBattles: state.huntSession.totalBattles,
    totalWins: state.huntSession.totalWins,
    totalDefeats: state.huntSession.totalDefeats,
    totalBitsEarned: state.huntSession.totalBitsEarned,
    totalExpEarned: state.huntSession.totalExpEarned,
    drops: buildDropSummary(),
    penaltyBits: options.penaltyBits || 0,
    healedDigimons: options.healedDigimons || [],
    message: options.message || ""
  };
}

function endHuntSession(reason, options = {}) {
  clearHuntTimer();

  if (!state.huntSession.active && !state.huntSession.huntId) {
    return;
  }

  finalizeHuntSummary(reason, options);
  resetActiveHuntSession();
  closeBattle();
  saveGame(state.save);
  rerender();
}

function getCombatRule(itemId) {
  return state.save.combat?.autoItemRules?.[itemId] || null;
}

function shouldTriggerAutoItem(playerDigimon, rule) {
  if (!playerDigimon || !rule?.enabled) {
    return false;
  }

  const resource = rule.resource === "sp" ? "sp" : "hp";
  const currentValue =
    resource === "sp" ? playerDigimon.currentSP ?? 0 : playerDigimon.currentHP ?? 0;
  const maxValue =
    resource === "sp" ? playerDigimon.finalStats.sp || 1 : playerDigimon.finalStats.hp || 1;
  const currentPercent = (currentValue / maxValue) * 100;

  return currentPercent <= Number(rule.thresholdPercent ?? 0);
}

function setPlayerTurnReady() {
  state.huntSession.turnOwner = "player";

  if (!state.battle.active || state.battle.result) {
    return;
  }

  if (isAutoBattleEnabled()) {
    setPhase("Carregando acao", TURN_CHARGE_DELAY_MS);
    rerender();
    scheduleNextStep(runAutoPlayerTurn, TURN_CHARGE_DELAY_MS);
    return;
  }

  clearHuntTimer();
  setPhase("Aguardando comando", 0);
  saveGame(state.save);
  rerender();
}

function scheduleEnemyTurn() {
  state.huntSession.turnOwner = "enemy";
  setPhase("Resposta inimiga", ENEMY_RESPONSE_DELAY_MS);
  saveGame(state.save);
  rerender();
  scheduleNextStep(runEnemyAction, ENEMY_RESPONSE_DELAY_MS);
}

function handlePostPlayerAction() {
  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  scheduleEnemyTurn();
}

function useBattleItemCore(itemId) {
  const targetDigimon = getActiveBattlePlayerDigimon();

  if (!targetDigimon) {
    throw new Error("Nao ha Digimon valido para usar o item.");
  }

  const previousStats = {
    hp: targetDigimon.currentHP ?? 0,
    sp: targetDigimon.currentSP ?? 0
  };

  const result = useItemOnDigimon({
    save: state.save,
    itemId,
    targetDigimon,
    context: "battle"
  });

  registerPlayerItemUse(result.item, result.target, previousStats);
  return result;
}

function tryUseConfiguredAutoItem() {
  const player = getActiveBattlePlayerDigimon();

  if (!player) {
    return null;
  }

  for (const itemId of AUTO_ITEM_ORDER) {
    const inventoryEntry = getInventoryEntry(state.save, itemId);
    const rule = getCombatRule(itemId);

    if (!inventoryEntry || inventoryEntry.quantity <= 0 || !shouldTriggerAutoItem(player, rule)) {
      continue;
    }

    try {
      return useBattleItemCore(itemId);
    } catch {
      continue;
    }
  }

  return null;
}

function runAutoPlayerTurn() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;
  if (state.huntSession.turnOwner !== "player") return;

  const itemResult = tryUseConfiguredAutoItem();

  if (!itemResult) {
    performPlayerAutoAttack();
  }

  rerender();
  handlePostPlayerAction();
}

function runEnemyAction() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;
  if (state.huntSession.turnOwner !== "enemy") return;

  performEnemyAutoAttack();
  rerender();

  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  setPlayerTurnReady();
}

function beginNextBattle() {
  if (!state.huntSession.active) return;

  state.huntSession.status = "battling";
  state.huntSession.currentBattleNumber += 1;
  state.huntSession.totalBattles += 1;

  startBattleFromHunt(state.huntSession.huntId);
  setPlayerTurnReady();
}

function finishBattleCycle() {
  if (!state.huntSession.active) return;

  state.huntSession.turnOwner = null;
  state.huntSession.status = "resolving";

  if (state.battle.result === "victory") {
    state.huntSession.totalWins += 1;
    state.huntSession.totalBitsEarned += state.battle.rewards?.bits || 0;
    state.huntSession.totalExpEarned += state.battle.rewards?.exp || 0;

    const drop = rollDrops();
    registerDrop(drop);
  }

  if (state.battle.result === "defeat") {
    state.huntSession.totalDefeats += 1;

    const healedDigimons = restorePartyAfterHuntEnd();
    const penaltyBits = state.battle.rewards?.bitsLost || 0;

    endHuntSession("defeat", {
      penaltyBits,
      healedDigimons,
      message: "Seu time foi derrotado e recebeu recuperacao completa para a proxima hunt."
    });
    return;
  }

  setPhase("Preparando proxima batalha", RESOLVE_DELAY_MS);
  saveGame(state.save);
  rerender();

  scheduleNextStep(() => {
    closeBattle();

    if (!state.huntSession.active) return;

    state.huntSession.status = "searching";
    state.huntSession.turnOwner = null;
    setPhase("Procurando inimigo", NEXT_BATTLE_DELAY_MS);
    rerender();

    scheduleNextStep(beginNextBattle, NEXT_BATTLE_DELAY_MS);
  }, RESOLVE_DELAY_MS);
}

export function clearHuntSummary() {
  state.huntSession.summary = null;
  rerender();
}

export function startHuntSession(huntId) {
  const player = state.save.party.find((digimon) => (digimon.currentHP ?? 0) > 0);

  if (!player) {
    throw new Error("Nao ha Digimon com HP suficiente no time.");
  }

  clearHuntTimer();
  state.huntSession.summary = null;

  state.huntSession.active = true;
  state.huntSession.huntId = huntId;
  state.huntSession.playerDigimonUid = player.uid;
  state.huntSession.totalBattles = 0;
  state.huntSession.totalWins = 0;
  state.huntSession.totalDefeats = 0;
  state.huntSession.totalBitsEarned = 0;
  state.huntSession.totalExpEarned = 0;
  state.huntSession.currentBattleNumber = 0;
  state.huntSession.turnOwner = null;
  state.huntSession.status = "searching";
  state.huntSession.drops = [];
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;

  setPhase("Procurando inimigo", FIRST_ENCOUNTER_DELAY_MS);
  rerender();
  scheduleNextStep(beginNextBattle, FIRST_ENCOUNTER_DELAY_MS);
}

export function stopHuntSession() {
  const healedDigimons = restorePartyAfterHuntEnd();

  endHuntSession("manual", {
    healedDigimons,
    message: "Hunt encerrada pelo jogador. Seu time foi totalmente recuperado."
  });
}

export function toggleAutoBattleMode() {
  state.save.combat.autoBattleEnabled = !isAutoBattleEnabled();
  saveGame(state.save);

  if (state.huntSession.active && state.battle.active && !state.battle.result) {
    if (state.huntSession.turnOwner === "player") {
      setPlayerTurnReady();
    } else {
      rerender();
    }
    return;
  }

  rerender();
}

export function updateAutoItemRule(itemId, patch = {}) {
  const existingRule = getCombatRule(itemId);

  if (!existingRule) {
    return;
  }

  state.save.combat.autoItemRules[itemId] = {
    ...existingRule,
    ...patch,
    resource: patch.resource === "sp" ? "sp" : patch.resource === "hp" ? "hp" : existingRule.resource,
    thresholdPercent: Math.max(
      1,
      Math.min(
        100,
        Math.floor(
          Number.isFinite(Number(patch.thresholdPercent))
            ? Number(patch.thresholdPercent)
            : existingRule.thresholdPercent
        )
      )
    )
  };

  saveGame(state.save);
  rerender();
}

export function performManualBattleAction(skillId = null) {
  if (!state.huntSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  if (state.huntSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearHuntTimer();
  performPlayerBattleAction(skillId);
  rerender();
  handlePostPlayerAction();
}

export function useBattleItemTurn(itemId) {
  if (!state.huntSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  if (state.huntSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearHuntTimer();
  const result = useBattleItemCore(itemId);
  rerender();
  handlePostPlayerAction();
  return result;
}

export function switchBattleDigimonTurn(nextDigimonUid) {
  if (!state.huntSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  if (state.huntSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearHuntTimer();
  performPlayerDigimonSwitch(nextDigimonUid);
  rerender();
  handlePostPlayerAction();
}
