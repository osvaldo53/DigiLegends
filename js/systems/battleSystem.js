import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getHuntById } from "../data/encounters.js";
import { createEncounterFromHunt } from "./encounterSystem.js";
import { uniquePush, clamp, randomInt } from "../core/utils.js";
import { applyBattleRewards } from "./progressionSystem.js";

/**
 * Retorna o Digimon ativo do jogador na batalha atual.
 */
function getActivePlayerDigimon() {
  const uid = state.battle.playerDigimonUid;
  return state.save.party.find((digimon) => digimon.uid === uid) || null;
}

/**
 * Fórmula simples de dano.
 * Mantida propositalmente enxuta para facilitar balanceamento posterior.
 */
function calculateAttackDamage(attacker, defender) {
  const raw = attacker.finalStats.atk - Math.floor(defender.finalStats.def / 2);
  const variance = randomInt(0, 2);
  return Math.max(1, raw + variance);
}

/**
 * Define o último evento visual da batalha.
 * A UI usa isso para animar ataque e impacto.
 */
function setLastAction(actor, target, moveName) {
  state.battle.lastAction = {
    actor,
    target,
    moveName,
    timestamp: Date.now()
  };
}

/**
 * Retorna um nome simples de golpe automático.
 * Por enquanto é só feedback visual.
 */
function getAutoMoveName(species, actorType) {
  const fallbackPlayerMoves = ["Auto Attack", "Claw Swipe", "Data Burst"];
  const fallbackEnemyMoves = ["Wild Strike", "Charge", "Bite"];

  if (!species) {
    return actorType === "player" ? "Auto Attack" : "Wild Strike";
  }

  const moveMap = {
    agumon: ["Pepper Breath", "Claw Attack", "Baby Flame"],
    gabumon: ["Blue Blaster", "Horn Attack", "Body Slam"],
    patamon: ["Air Shot", "Wing Hit", "Holy Tackle"],
    koromon: ["Bubble Pop"],
    tsunomon: ["Headbutt"],
    tokomon: ["Petit Bite"],
    greymon: ["Mega Flame", "Great Horn Attack"],
    garurumon: ["Fox Fire", "Sharp Fang"],
    angemon: ["Hand of Fate", "Heaven Knuckle"]
  };

  const moves = moveMap[species.id] || (actorType === "player" ? fallbackPlayerMoves : fallbackEnemyMoves);
  return moves[randomInt(0, moves.length - 1)];
}

/**
 * Adiciona uma linha ao log da batalha.
 */
function pushLog(message) {
  state.battle.log.unshift(message);
  state.battle.log = state.battle.log.slice(0, 16);
}

/**
 * Finaliza a batalha com vitória.
 */
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

/**
 * Finaliza a batalha com derrota.
 */
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

/**
 * Prepara uma nova batalha.
 * Não troca de tela.
 */
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
    rewards: null,
    lastAction: null
  };

  pushLog(`Encontro iniciado em ${hunt.name}.`);
  pushLog(`Inimigo: ${getDigimonSpecies(enemy.speciesId)?.name || enemy.speciesId} Lv. ${enemy.level}.`);

  saveGame(state.save);
}

/**
 * Executa SOMENTE a ação ofensiva do jogador.
 * Esta separação permite uma sequência visual mais clara:
 * 1. jogador anima e aplica dano
 * 2. espera
 * 3. inimigo anima e aplica dano
 */
export function performPlayerAutoAttack() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) return;

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const playerMove = getAutoMoveName(playerSpecies, "player");
  const damageToEnemy = calculateAttackDamage(player, enemy);

  setLastAction("player", "enemy", playerMove);

  enemy.currentHP = clamp(enemy.currentHP - damageToEnemy, 0, enemy.finalStats.hp);
  enemy.currentSP = clamp(enemy.currentSP - 3, 0, enemy.finalStats.sp);

  pushLog(`${playerSpecies?.name || "Seu Digimon"} usou ${playerMove} e causou ${damageToEnemy} de dano.`);

  if (enemy.currentHP <= 0) {
    finalizeVictory();
    return;
  }

  saveGame(state.save);
}

/**
 * Executa SOMENTE a ação ofensiva do inimigo.
 */
export function performEnemyAutoAttack() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) return;

  const enemySpecies = getDigimonSpecies(enemy.speciesId);
  const enemyMove = getAutoMoveName(enemySpecies, "enemy");
  const damageToPlayer = calculateAttackDamage(enemy, player);

  setLastAction("enemy", "player", enemyMove);

  player.currentHP = clamp(player.currentHP - damageToPlayer, 0, player.finalStats.hp);
  player.currentSP = clamp(player.currentSP - 3, 0, player.finalStats.sp);

  pushLog(`${enemySpecies?.name || "Inimigo"} usou ${enemyMove} e causou ${damageToPlayer} de dano.`);

  if (player.currentHP <= 0) {
    finalizeDefeat();
    return;
  }

  saveGame(state.save);
}

/**
 * Compatibilidade com fluxo antigo.
 * Agora executa a dupla de ações em sequência imediata.
 * Mantido apenas para evitar quebra em chamadas antigas.
 */
export function performAutoBattleTurn() {
  performPlayerAutoAttack();

  if (state.battle.result) return;

  performEnemyAutoAttack();
}

/**
 * Compatibilidade com o fluxo anterior.
 */
export function performPlayerAttack() {
  performAutoBattleTurn();
}

/**
 * Fuga manual.
 */
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

/**
 * Limpa completamente o estado da batalha.
 */
export function closeBattle() {
  state.battle = {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    enemy: null,
    log: [],
    result: null,
    rewards: null,
    lastAction: null
  };
}