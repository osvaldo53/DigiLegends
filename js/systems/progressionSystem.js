import { MAX_LEVEL } from "../config/constants.js";
import { recalculatePlayerDigimon } from "../factories/digimonFactory.js";

/**
 * Retorna a EXP necessária para o próximo nível.
 *
 * Fórmula atual:
 * - progressão linear simples
 * - fácil de balancear depois
 *
 * @param {number} level
 * @returns {number}
 */
export function getExpToNextLevel(level) {
  return 20 + (level - 1) * 15;
}

/**
 * Aplica o ganho de vínculo ao Digimon.
 *
 * Regras:
 * - +0,1 por batalha vencida
 * - limite máximo de 200
 *
 * Observação:
 * usamos arredondamento para evitar ruído de ponto flutuante
 * acumulando valores como 0.30000000004
 *
 * @param {object} playerDigimon
 */
function applyBondGain(playerDigimon) {
  const currentBond = Number(playerDigimon.bond ?? 0);
  const nextBond = Math.min(200, currentBond + 0.1);

  // arredonda para 1 casa decimal
  playerDigimon.bond = Math.round(nextBond * 10) / 10;
}

/**
 * Aplica recompensas de batalha ao Digimon do jogador e ao save.
 *
 * Inclui:
 * - bits
 * - exp
 * - level up
 * - bond
 *
 * Regras:
 * - bond só é ganho em vitória
 * - derrotas não passam por aqui
 *
 * @param {object} playerDigimon
 * @param {object} rewards
 * @param {object} save
 * @returns {object}
 */
export function applyBattleRewards(playerDigimon, rewards, save) {
  if (!playerDigimon) {
    return {
      leveledUp: false,
      gainedLevels: 0,
      bondGained: 0
    };
  }

  save.bits += rewards.bits || 0;

  let gainedLevels = 0;

  playerDigimon.exp += rewards.exp || 0;

  while (playerDigimon.level < MAX_LEVEL) {
    const needed = getExpToNextLevel(playerDigimon.level);

    if (playerDigimon.exp < needed) {
      break;
    }

    playerDigimon.exp -= needed;
    playerDigimon.level += 1;
    gainedLevels += 1;
  }

  // ganho de vínculo por vitória
  const previousBond = Number(playerDigimon.bond ?? 0);
  applyBondGain(playerDigimon);
  const bondGained = Number(
    (playerDigimon.bond - previousBond).toFixed(1)
  );

  recalculatePlayerDigimon(playerDigimon);

  // quando sobe de nível, restaura HP/SP
  if (gainedLevels > 0) {
    playerDigimon.currentHP = playerDigimon.finalStats.hp;
    playerDigimon.currentSP = playerDigimon.finalStats.sp;
  }

  return {
    leveledUp: gainedLevels > 0,
    gainedLevels,
    bondGained
  };
}