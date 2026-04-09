import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getBossById, rollBossRewardDrops } from "../data/bosses.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getItemById } from "../data/items.js";
import { createEnemyDigimon } from "../factories/digimonFactory.js";
import { addItemToInventory, getInventoryEntry, useItemOnDigimon } from "./itemSystem.js";
import {
  closeBattle,
  performEnemyAutoAttack,
  performPlayerAutoAttack,
  performPlayerBattleAction,
  performPlayerDigimonSwitch,
  registerPlayerItemUse,
  startBattleFromScenario
} from "./battleSystem.js";
import { showEvolutionAnimation } from "./evolutionAnimationSystem.js";

const FIRST_STAGE_DELAY_MS = 900;
const TURN_CHARGE_DELAY_MS = 1600;
const ENEMY_RESPONSE_DELAY_MS = 900;
const NEXT_STAGE_DELAY_MS = 1800;
const RESOLVE_DELAY_MS = 1300;
const DNA_TRANSITION_DELAY_MS = 5600;
const AUTO_ITEM_ORDER = ["small_recovery", "bandage", "small_sp_disk"];

let bossTimer = null;

function rerender() {
  window.dispatchEvent(new Event("digilegends:rerender"));
}

function clearBossTimer() {
  if (bossTimer) {
    clearTimeout(bossTimer);
    bossTimer = null;
  }
}

function scheduleNextStep(callback, delay) {
  clearBossTimer();
  bossTimer = setTimeout(() => {
    callback();
  }, delay);
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
  state.bossSession.phaseLabel = label;
  state.bossSession.phaseDurationMs = durationMs;
  state.bossSession.phaseStartedAt = durationMs > 0 ? Date.now() : 0;
}

function clearPendingBattleItemSelection() {
  state.bossSession.pendingBattleItem = null;
}

function resetBossSessionState() {
  state.bossSession.active = false;
  state.bossSession.bossId = null;
  state.bossSession.playerDigimonUid = null;
  state.bossSession.stageIndex = 0;
  state.bossSession.totalBattles = 0;
  state.bossSession.totalWins = 0;
  state.bossSession.totalDefeats = 0;
  state.bossSession.totalBitsEarned = 0;
  state.bossSession.totalExpEarned = 0;
  state.bossSession.turnOwner = null;
  state.bossSession.status = "stopped";
  state.bossSession.drops = [];
  state.bossSession.phaseLabel = "";
  state.bossSession.phaseDurationMs = 0;
  state.bossSession.phaseStartedAt = 0;
  state.bossSession.pendingBattleItem = null;
}

function buildDropSummary() {
  return state.bossSession.drops.map((drop) => ({ ...drop }));
}

function registerDrop(drop) {
  if (!drop) {
    return;
  }

  const existing = state.bossSession.drops.find((item) => item.id === drop.id);

  if (existing) {
    existing.quantity += drop.quantity;
  } else {
    state.bossSession.drops.push({ ...drop });
  }

  addItemToInventory(state.save, drop.id, drop.quantity);
}

function restorePartyAfterBossEnd() {
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

function finalizeBossSummary(reason, options = {}) {
  const boss = getBossById(state.bossSession.bossId);

  state.bossSession.summary = {
    bossId: state.bossSession.bossId,
    bossName: boss?.name || "Boss",
    reason,
    totalBattles: state.bossSession.totalBattles,
    totalWins: state.bossSession.totalWins,
    totalDefeats: state.bossSession.totalDefeats,
    totalBitsEarned: state.bossSession.totalBitsEarned,
    totalExpEarned: state.bossSession.totalExpEarned,
    drops: buildDropSummary(),
    healedDigimons: options.healedDigimons || [],
    message: options.message || "",
    completed: Boolean(options.completed)
  };
}

function endBossSession(reason, options = {}) {
  clearBossTimer();

  if (!state.bossSession.active && !state.bossSession.bossId) {
    return;
  }

  finalizeBossSummary(reason, options);
  resetBossSessionState();
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
  state.bossSession.turnOwner = "player";
  clearPendingBattleItemSelection();

  if (!state.battle.active || state.battle.result) {
    return;
  }

  if (isAutoBattleEnabled()) {
    setPhase("Carregando acao", TURN_CHARGE_DELAY_MS);
    rerender();
    scheduleNextStep(runAutoPlayerTurn, TURN_CHARGE_DELAY_MS);
    return;
  }

  clearBossTimer();
  setPhase("Aguardando comando", 0);
  saveGame(state.save);
  rerender();
}

function scheduleEnemyTurn() {
  state.bossSession.turnOwner = "enemy";
  clearPendingBattleItemSelection();
  setPhase("Resposta inimiga", ENEMY_RESPONSE_DELAY_MS);
  saveGame(state.save);
  rerender();
  scheduleNextStep(runEnemyAction, ENEMY_RESPONSE_DELAY_MS);
}

function handlePostPlayerAction() {
  if (state.battle.result) {
    finishBossBattleCycle();
    return;
  }

  scheduleEnemyTurn();
}

function getTargetDigimonForBattleItem(item, targetDigimonUid = null) {
  const isReviveItem = Boolean(item?.effect?.revivePercent);

  if (isReviveItem) {
    if (targetDigimonUid) {
      const selectedDigimon = state.save.party.find((digimon) => digimon.uid === targetDigimonUid) || null;

      if (!selectedDigimon) {
        throw new Error("Digimon selecionado nao foi encontrado.");
      }

      if ((selectedDigimon.currentHP ?? 0) > 0) {
        throw new Error("Selecione um Digimon derrotado para usar o revive.");
      }

      return selectedDigimon;
    }

    return state.save.party.find((digimon) => (digimon.currentHP ?? 0) <= 0) || null;
  }

  if (targetDigimonUid) {
    const selectedDigimon = state.save.party.find((digimon) => digimon.uid === targetDigimonUid) || null;

    if (!selectedDigimon) {
      throw new Error("Digimon selecionado nao foi encontrado.");
    }

    return selectedDigimon;
  }

  return getActiveBattlePlayerDigimon();
}

function useBattleItemCore(itemId, targetDigimonUid = null) {
  const item = getItemById(itemId);
  const targetDigimon = getTargetDigimonForBattleItem(item, targetDigimonUid);

  if (!targetDigimon) {
    throw new Error(
      item?.effect?.revivePercent
        ? "Nao ha Digimon derrotado para reviver."
        : "Nao ha Digimon valido para usar o item."
    );
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

function getCurrentBoss() {
  return getBossById(state.bossSession.bossId);
}

function getCurrentBossStage() {
  const boss = getCurrentBoss();
  return boss?.stages?.[state.bossSession.stageIndex] || null;
}

function beginCurrentBossStage() {
  const boss = getCurrentBoss();
  const stage = getCurrentBossStage();

  if (!boss || !stage) {
    throw new Error("Nao foi possivel localizar a fase do boss.");
  }

  const enemy = createEnemyDigimon(stage.speciesId, stage.level, stage.bonusStats);

  state.bossSession.status = "battling";
  state.bossSession.totalBattles += 1;

  startBattleFromScenario({
    battleId: stage.id,
    battleName: `${boss.name} - ${stage.name}`,
    enemy,
    rewards: stage.rewards,
    context: "boss"
  });

  setPlayerTurnReady();
}

function queueNextBossStage() {
  const nextStage = getCurrentBossStage();

  if (!state.bossSession.active || !nextStage) {
    return;
  }

  closeBattle();
  state.bossSession.status = "transitioning";
  state.bossSession.turnOwner = null;
  setPhase(`Preparando ${nextStage.name}`, NEXT_STAGE_DELAY_MS);
  rerender();
  scheduleNextStep(beginCurrentBossStage, NEXT_STAGE_DELAY_MS);
}

function finishBossBattleCycle() {
  if (!state.bossSession.active) {
    return;
  }

  const boss = getCurrentBoss();
  const currentStage = getCurrentBossStage();

  state.bossSession.turnOwner = null;
  state.bossSession.status = "resolving";

  if (state.battle.result === "victory") {
    state.bossSession.totalWins += 1;
    state.bossSession.totalBitsEarned += state.battle.rewards?.bits || 0;
    state.bossSession.totalExpEarned += state.battle.rewards?.exp || 0;

    const isLastStage = state.bossSession.stageIndex >= (boss?.stages.length || 0) - 1;

    if (isLastStage) {
      const healedDigimons = restorePartyAfterBossEnd();
      const rewardDrops = rollBossRewardDrops(boss.id);

      rewardDrops.forEach((drop) => registerDrop(drop));
      state.save.progress.bossesCompleted += 1;

      endBossSession("victory", {
        completed: true,
        healedDigimons,
        message: "Desafio concluido. Seu time foi recuperado apos a vitoria."
      });
      return;
    }

    state.bossSession.stageIndex += 1;
    setPhase("Boss derrotado", RESOLVE_DELAY_MS);
    saveGame(state.save);
    rerender();

    scheduleNextStep(() => {
      if (!state.bossSession.active) {
        return;
      }

      if (currentStage?.transitionAnimation) {
        state.bossSession.status = "transitioning";
        setPhase("DNA Digivolution em andamento", DNA_TRANSITION_DELAY_MS);
        showEvolutionAnimation(currentStage.transitionAnimation, DNA_TRANSITION_DELAY_MS - 100);
        scheduleNextStep(queueNextBossStage, DNA_TRANSITION_DELAY_MS);
        return;
      }

      queueNextBossStage();
    }, RESOLVE_DELAY_MS);
    return;
  }

  if (state.battle.result === "defeat") {
    state.bossSession.totalDefeats += 1;
    const healedDigimons = restorePartyAfterBossEnd();

    endBossSession("defeat", {
      healedDigimons,
      message: "Seu time foi derrotado, mas se recuperou totalmente para uma nova tentativa."
    });
  }
}

function runAutoPlayerTurn() {
  if (!state.bossSession.active) return;
  if (!state.battle.active || state.battle.result) return;
  if (state.bossSession.turnOwner !== "player") return;

  const itemResult = tryUseConfiguredAutoItem();

  if (!itemResult) {
    performPlayerAutoAttack();
  }

  rerender();
  handlePostPlayerAction();
}

function runEnemyAction() {
  if (!state.bossSession.active) return;
  if (!state.battle.active || state.battle.result) return;
  if (state.bossSession.turnOwner !== "enemy") return;

  performEnemyAutoAttack();
  rerender();

  if (state.battle.result) {
    finishBossBattleCycle();
    return;
  }

  setPlayerTurnReady();
}

export function clearBossSummary() {
  state.bossSession.summary = null;
  rerender();
}

export function startBossSession(bossId) {
  const boss = getBossById(bossId);
  const player = state.save.party.find((digimon) => (digimon.currentHP ?? 0) > 0);

  if (!boss) {
    throw new Error("Boss invalido.");
  }

  if (!player) {
    throw new Error("Nao ha Digimon com HP suficiente no time.");
  }

  clearBossTimer();
  state.bossSession.summary = null;
  state.bossSession.active = true;
  state.bossSession.bossId = bossId;
  state.bossSession.playerDigimonUid = player.uid;
  state.bossSession.stageIndex = 0;
  state.bossSession.totalBattles = 0;
  state.bossSession.totalWins = 0;
  state.bossSession.totalDefeats = 0;
  state.bossSession.totalBitsEarned = 0;
  state.bossSession.totalExpEarned = 0;
  state.bossSession.turnOwner = null;
  state.bossSession.status = "preparing";
  state.bossSession.drops = [];
  state.bossSession.phaseLabel = "";
  state.bossSession.phaseDurationMs = 0;
  state.bossSession.phaseStartedAt = 0;
  state.bossSession.pendingBattleItem = null;

  setPhase(`Entrando em ${boss.name}`, FIRST_STAGE_DELAY_MS);
  rerender();
  scheduleNextStep(beginCurrentBossStage, FIRST_STAGE_DELAY_MS);
}

export function stopBossSession() {
  const healedDigimons = restorePartyAfterBossEnd();

  endBossSession("manual", {
    healedDigimons,
    message: "Desafio encerrado manualmente. Seu time foi recuperado."
  });
}

export function toggleBossAutoBattleMode() {
  state.save.combat.autoBattleEnabled = !isAutoBattleEnabled();
  saveGame(state.save);

  if (state.bossSession.active && state.battle.active && !state.battle.result) {
    if (state.bossSession.turnOwner === "player") {
      setPlayerTurnReady();
    } else {
      rerender();
    }
    return;
  }

  rerender();
}

export function updateBossAutoItemRule(itemId, patch = {}) {
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

export function performManualBossAction(skillId = null) {
  if (!state.bossSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha de boss ativa.");
  }

  if (state.bossSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearBossTimer();
  performPlayerBattleAction(skillId);
  rerender();
  handlePostPlayerAction();
}

export function getBossItemEligibleTargets(itemId) {
  const item = getItemById(itemId);

  if (!item?.usableInBattle) {
    return [];
  }

  if (item.effect?.revivePercent) {
    return state.save.party.filter((digimon) => (digimon.currentHP ?? 0) <= 0);
  }

  const activeDigimon = getActiveBattlePlayerDigimon();
  return activeDigimon ? [activeDigimon] : [];
}

export function beginBossItemTargetSelection(itemId) {
  const item = getItemById(itemId);

  if (!item?.usableInBattle) {
    throw new Error("Item nao pode ser usado em batalha.");
  }

  const targets = getBossItemEligibleTargets(itemId);

  if (!targets.length) {
    throw new Error(
      item.effect?.revivePercent
        ? "Nao ha Digimon derrotado para reviver."
        : "Nao ha Digimon valido para usar o item."
    );
  }

  state.bossSession.pendingBattleItem = { itemId };
  rerender();

  return { item, targets };
}

export function cancelBossItemTargetSelection() {
  if (!state.bossSession.pendingBattleItem) {
    return;
  }

  clearPendingBattleItemSelection();
  rerender();
}

export function useBossItemTurn(itemId, targetDigimonUid = null) {
  if (!state.bossSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha de boss ativa.");
  }

  if (state.bossSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearBossTimer();
  const result = useBattleItemCore(itemId, targetDigimonUid);
  clearPendingBattleItemSelection();
  rerender();
  handlePostPlayerAction();
  return result;
}

export function switchBossDigimonTurn(nextDigimonUid) {
  if (!state.bossSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha de boss ativa.");
  }

  if (state.bossSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearBossTimer();
  performPlayerDigimonSwitch(nextDigimonUid);
  rerender();
  handlePostPlayerAction();
}
