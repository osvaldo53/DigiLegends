import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { addItemToInventory } from "./itemSystem.js";
import {
  startBattleFromHunt,
  performPlayerAutoAttack,
  performEnemyAutoAttack,
  closeBattle
} from "./battleSystem.js";

const FIRST_ENCOUNTER_DELAY_MS = 1200;
const TURN_CHARGE_DELAY_MS = 1600;
const ENEMY_RESPONSE_DELAY_MS = 900;
const NEXT_TURN_DELAY_MS = 1300;
const NEXT_BATTLE_DELAY_MS = 2400;
const RESOLVE_DELAY_MS = 1400;

let huntTimer = null;

function rerender() {
  window.dispatchEvent(new Event("digilegends:rerender"));
}

function setPhase(label, durationMs) {
  state.huntSession.phaseLabel = label;
  state.huntSession.phaseDurationMs = durationMs;
  state.huntSession.phaseStartedAt = Date.now();
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
  state.huntSession.status = "stopped";
  state.huntSession.drops = [];
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;
}

function buildDropSummary() {
  return state.huntSession.drops.map((drop) => ({ ...drop }));
}

function restorePartyAfterDefeat() {
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
  state.huntSession.status = "searching";
  state.huntSession.drops = [];
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;

  setPhase("Procurando inimigo", FIRST_ENCOUNTER_DELAY_MS);
  rerender();

  scheduleNextStep(() => {
    beginNextBattle();
  }, FIRST_ENCOUNTER_DELAY_MS);
}

export function stopHuntSession() {
  endHuntSession("manual", {
    message: "Hunt encerrada pelo jogador."
  });
}

function beginNextBattle() {
  if (!state.huntSession.active) return;

  state.huntSession.status = "battling";
  state.huntSession.currentBattleNumber += 1;
  state.huntSession.totalBattles += 1;

  startBattleFromHunt(state.huntSession.huntId);

  setPhase("Carregando acao", TURN_CHARGE_DELAY_MS);
  rerender();

  scheduleNextStep(runPlayerAction, TURN_CHARGE_DELAY_MS);
}

function runPlayerAction() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;

  performPlayerAutoAttack();
  rerender();

  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  setPhase("Resposta inimiga", ENEMY_RESPONSE_DELAY_MS);
  rerender();

  scheduleNextStep(runEnemyAction, ENEMY_RESPONSE_DELAY_MS);
}

function runEnemyAction() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;

  performEnemyAutoAttack();
  rerender();

  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  setPhase("Carregando acao", NEXT_TURN_DELAY_MS);
  rerender();

  scheduleNextStep(runPlayerAction, NEXT_TURN_DELAY_MS);
}

function finishBattleCycle() {
  if (!state.huntSession.active) return;

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

    const healedDigimons = restorePartyAfterDefeat();
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
    setPhase("Procurando inimigo", NEXT_BATTLE_DELAY_MS);
    rerender();

    scheduleNextStep(() => {
      beginNextBattle();
    }, NEXT_BATTLE_DELAY_MS);
  }, RESOLVE_DELAY_MS);
}
