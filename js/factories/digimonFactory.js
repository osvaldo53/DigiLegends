import { getDigimonSpecies } from "../data/digimons.js";
import { clamp } from "../core/utils.js";

/**
 * Calcula os atributos finais do Digimon com base:
 * - nos atributos base da espécie
 * - no nível atual
 * - em bônus adicionais
 *
 * Observação:
 * esta fórmula continua simples de propósito,
 * para facilitar balanceamento posterior.
 *
 * @param {object} baseStats
 * @param {number} level
 * @param {object} bonusStats
 * @returns {object}
 */
function buildFinalStats(baseStats, level, bonusStats) {
  return {
    hp: baseStats.hp + (level - 1) * 6 + bonusStats.hp,
    sp: baseStats.sp + (level - 1) * 3 + bonusStats.sp,
    atk: baseStats.atk + (level - 1) * 2 + bonusStats.atk,
    def: baseStats.def + (level - 1) * 2 + bonusStats.def,
    int: baseStats.int + (level - 1) * 2 + bonusStats.int,
    spd: baseStats.spd + (level - 1) * 2 + bonusStats.spd
  };
}

/**
 * Recalcula os atributos finais de um Digimon já existente.
 *
 * Isso é útil quando:
 * - ele sobe de nível
 * - recebe bônus
 * - há rebalanceamento
 *
 * @param {object} playerDigimon
 * @returns {object}
 */
export function recalculatePlayerDigimon(playerDigimon) {
  const species = getDigimonSpecies(playerDigimon.speciesId);

  if (!species) {
    throw new Error(`Espécie inválida: ${playerDigimon.speciesId}`);
  }

  playerDigimon.finalStats = buildFinalStats(
    species.baseStats,
    playerDigimon.level,
    playerDigimon.bonusStats
  );

  playerDigimon.currentHP = clamp(
    playerDigimon.currentHP ?? playerDigimon.finalStats.hp,
    0,
    playerDigimon.finalStats.hp
  );

  playerDigimon.currentSP = clamp(
    playerDigimon.currentSP ?? playerDigimon.finalStats.sp,
    0,
    playerDigimon.finalStats.sp
  );

  /**
   * Garante que o vínculo exista e fique no intervalo válido.
   */
  playerDigimon.bond = clamp(playerDigimon.bond ?? 0, 0, 200);

  return playerDigimon;
}

/**
 * Cria uma instância de Digimon do jogador.
 *
 * Diferença importante:
 * - a espécie define dados fixos
 * - a instância define progresso individual
 *
 * Campos individuais relevantes:
 * - level
 * - exp
 * - bond
 * - currentHP/currentSP
 * - learnedSkills
 *
 * @param {string} speciesId
 * @param {object} options
 * @returns {object}
 */
export function createPlayerDigimon(speciesId, options = {}) {
  const species = getDigimonSpecies(speciesId);

  if (!species) {
    throw new Error(`Espécie inválida: ${speciesId}`);
  }

  const level = options.level ?? 1;

  const bonusStats = {
    hp: 0,
    sp: 0,
    atk: 0,
    def: 0,
    int: 0,
    spd: 0,
    ...(options.bonusStats || {})
  };

  const finalStats = buildFinalStats(species.baseStats, level, bonusStats);

  return {
    uid: crypto.randomUUID(),
    speciesId,
    nickname: options.nickname || "",
    level,
    exp: options.exp ?? 0,

    /**
     * Sistema de vínculo:
     * - varia de 0 a 200
     * - ganho futuro: +0,1 por batalha vencida
     */
    bond: clamp(options.bond ?? 0, 0, 200),

    bonusStats,
    finalStats,
    currentHP: finalStats.hp,
    currentSP: finalStats.sp,

    /**
     * Lista de skills aprendidas.
     * Ainda pode ser expandida depois para slots ativos.
     */
    learnedSkills: options.learnedSkills || [],

    personality: options.personality || "neutral",
    createdAt: Date.now()
  };
}

/**
 * Cria uma instância temporária de inimigo para batalha.
 *
 * Observações:
 * - inimigos não precisam de bond
 * - learnedSkills não é necessário nesta fase
 *
 * @param {string} speciesId
 * @param {number} level
 * @returns {object}
 */
export function createEnemyDigimon(speciesId, level = 1, bonusStats = {}) {
  const species = getDigimonSpecies(speciesId);

  if (!species) {
    throw new Error(`Espécie inimiga inválida: ${speciesId}`);
  }

  const scaledStats = buildFinalStats(species.baseStats, level, {
    hp: 0,
    sp: 0,
    atk: 0,
    def: 0,
    int: 0,
    spd: 0,
    ...bonusStats
  });

  return {
    uid: crypto.randomUUID(),
    speciesId,
    level,
    finalStats: scaledStats,
    currentHP: scaledStats.hp,
    currentSP: scaledStats.sp
  };
}
