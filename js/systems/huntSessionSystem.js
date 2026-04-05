import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { addItemToInventory } from "./itemSystem.js";
import {
  startBattleFromHunt,
  performPlayerAutoAttack,
  performEnemyAutoAttack,
  closeBattle
} from "./battleSystem.js";

/**
 * Delays da hunt AFK.
 *
 * FIRST_ENCOUNTER_DELAY_MS:
 * tempo para encontrar o primeiro inimigo
 *
 * TURN_CHARGE_DELAY_MS:
 * tempo para carregar antes da ação do jogador
 *
 * ENEMY_RESPONSE_DELAY_MS:
 * pausa entre a ação do jogador e a resposta do inimigo
 *
 * NEXT_TURN_DELAY_MS:
 * pausa até o próximo ciclo completo de turnos
 *
 * RESOLVE_DELAY_MS:
 * pausa após vitória para ler resultado
 */
const FIRST_ENCOUNTER_DELAY_MS = 1200;
const TURN_CHARGE_DELAY_MS = 1600;
const ENEMY_RESPONSE_DELAY_MS = 900;
const NEXT_TURN_DELAY_MS = 1300;
const NEXT_BATTLE_DELAY_MS = 2400;
const RESOLVE_DELAY_MS = 1400;

let huntTimer = null;
let uiRefreshInterval = null;

function rerender() {
  window.dispatchEvent(new Event("digilegends:rerender"));
}

function setPhase(label, durationMs) {
  state.huntSession.phaseLabel = label;
  state.huntSession.phaseDurationMs = durationMs;
  state.huntSession.phaseStartedAt = Date.now();
}

function startUiRefreshLoop() {
  stopUiRefreshLoop();

  uiRefreshInterval = setInterval(() => {
    if (!state.huntSession.active) return;
    rerender();
  }, 100);
}

function stopUiRefreshLoop() {
  if (uiRefreshInterval) {
    clearInterval(uiRefreshInterval);
    uiRefreshInterval = null;
  }
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

/**
 * Sistema simples de drop inicial.
 */
function rollDrops() {
  const roll = Math.random();

  if (roll < 0.40) {
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

export function startHuntSession(huntId) {
  const player = state.save.party[0];

  if (!player) {
    throw new Error("Não há Digimon no time.");
  }

  stopHuntSession(false);

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

  setPhase("Procurando inimigo", FIRST_ENCOUNTER_DELAY_MS);
  startUiRefreshLoop();
  rerender();

  scheduleNextStep(() => {
    beginNextBattle();
  }, FIRST_ENCOUNTER_DELAY_MS);
}

export function stopHuntSession(shouldRerender = true) {
  clearHuntTimer();
  stopUiRefreshLoop();

  state.huntSession.active = false;
  state.huntSession.huntId = null;
  state.huntSession.playerDigimonUid = null;
  state.huntSession.status = "stopped";
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;

  closeBattle();

  if (shouldRerender) {
    rerender();
  }
}

function beginNextBattle() {
  if (!state.huntSession.active) return;

  state.huntSession.status = "battling";
  state.huntSession.currentBattleNumber += 1;
  state.huntSession.totalBattles += 1;

  startBattleFromHunt(state.huntSession.huntId);

  setPhase("Carregando ação", TURN_CHARGE_DELAY_MS);
  rerender();

  scheduleNextStep(runPlayerAction, TURN_CHARGE_DELAY_MS);
}

/**
 * Executa a ação do jogador.
 * Depois, se a batalha continuar, agenda a resposta do inimigo.
 */
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
  scheduleNextStep(runEnemyAction, ENEMY_RESPONSE_DELAY_MS);
}

/**
 * Executa a ação do inimigo.
 * Depois, se a batalha continuar, agenda o próximo turno completo.
 */
function runEnemyAction() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;

  performEnemyAutoAttack();
  rerender();

  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  setPhase("Carregando ação", NEXT_TURN_DELAY_MS);
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
    saveGame(state.save);
    stopHuntSession();
    return;
  }

  setPhase("Preparando próxima batalha", RESOLVE_DELAY_MS);
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