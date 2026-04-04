import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getHuntById } from "../data/encounters.js";
import { createEncounterFromHunt } from "./encounterSystem.js";
import { uniquePush, clamp, randomInt } from "../core/utils.js";
import { applyBattleRewards } from "./progressionSystem.js";

function getActivePlayerDigimon() {
  const uid = state.battle.playerDigimonUid;
  return state.save.party.find((digimon) => digimon.uid === uid) || null;
}

function calculateAttackDamage(attacker, defender) {
  const raw = attacker.finalStats.atk - Math.floor(defender.finalStats.def / 2);
  const variance = randomInt(0, 2);
  return Math.max(1, raw + variance);
}

function pushLog(message) {
  state.battle.log.unshift(message);
  state.battle.log = state.battle.log.slice(0, 16);
}

function finalizeVictory() {
  const player = getActivePlayerDigimon();
  const hunt = getHuntById(state.battle.huntId);

  if (!player || !hunt) return;

  state.save.progress.huntsCompleted += 1;

  const progression = applyBattleRewards(player, hunt.rewards, state.save);

  state.battle.result = "victory";
  state.battle.rewards = {
    ...hunt.rewards,
    gainedLevels: progression.gainedLevels
  };

  pushLog(`Vitória. Recompensas: +${hunt.rewards.bits} Bits, +${hunt.rewards.exp} EXP.`);
  if (progression.gainedLevels > 0) {
    pushLog(`${getDigimonSpecies(player.speciesId)?.name || "Seu Digimon"} subiu ${progression.gainedLevels} nível(is).`);
  }

  saveGame(state.save);
}

function finalizeDefeat() {
  const player = getActivePlayerDigimon();
  const penalty = 8;

  if (player) {
    player.currentHP = 1;
  }

  state.save.bits = Math.max(0, state.save.bits - penalty);
  state.battle.result = "defeat";
  state.battle.rewards = {
    bitsLost: penalty
  };

  pushLog(`Derrota. Penalidade: -${penalty} Bits.`);
  saveGame(state.save);
}

export function startBattleFromHunt(huntId) {
  const player = state.save.party[0];
  if (!player) {
    throw new Error("Não há Digimon no time.");
  }

  const { hunt, enemy } = createEncounterFromHunt(huntId, player.level);

  uniquePush(state.save.digidex.seen, enemy.speciesId);

  state.battle = {
    active: true,
    huntId: hunt.id,
    playerDigimonUid: player.uid,
    enemy,
    log: [],
    result: null,
    rewards: null
  };

  pushLog(`Encontro iniciado em ${hunt.name}.`);
  pushLog(`Inimigo: ${getDigimonSpecies(enemy.speciesId)?.name || enemy.speciesId} Lv. ${enemy.level}.`);

  saveGame(state.save);
}

export function performPlayerAttack() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) return;

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const enemySpecies = getDigimonSpecies(enemy.speciesId);

  const damageToEnemy = calculateAttackDamage(player, enemy);
  enemy.currentHP = clamp(enemy.currentHP - damageToEnemy, 0, enemy.finalStats.hp);
  pushLog(`${playerSpecies?.name || "Seu Digimon"} causou ${damageToEnemy} de dano.`);

  if (enemy.currentHP <= 0) {
    finalizeVictory();
    return;
  }

  const damageToPlayer = calculateAttackDamage(enemy, player);
  player.currentHP = clamp(player.currentHP - damageToPlayer, 0, player.finalStats.hp);
  pushLog(`${enemySpecies?.name || "Inimigo"} causou ${damageToPlayer} de dano.`);

  if (player.currentHP <= 0) {
    finalizeDefeat();
    return;
  }

  saveGame(state.save);
}

export function fleeBattle() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  if (player) {
    player.currentHP = Math.max(1, player.currentHP - 2);
  }

  state.battle.result = "fled";
  state.battle.rewards = null;
  pushLog("Você fugiu da batalha. Penalidade leve de HP.");
  saveGame(state.save);
}

export function closeBattle() {
  state.battle = {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    enemy: null,
    log: [],
    result: null,
    rewards: null
  };
}
