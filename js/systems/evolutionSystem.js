import { getDigimonSpecies } from "../data/digimons.js";
import { getEvolutionRule, getEvolutionRulesForSpecies } from "../data/evolutionRules.js";
import { recalculatePlayerDigimon } from "../factories/digimonFactory.js";
import { uniquePush } from "../core/utils.js";

/**
 * Verifica se uma instância de Digimon pode evoluir para a espécie alvo.
 *
 * Requisitos atuais:
 * - level mínimo
 * - bond mínimo
 *
 * @param {object} playerDigimon
 * @param {string} targetSpeciesId
 * @returns {boolean}
 */
export function canEvolveTo(playerDigimon, targetSpeciesId) {
  const currentSpeciesId = playerDigimon.speciesId;
  const rule = getEvolutionRule(currentSpeciesId, targetSpeciesId);

  if (!rule) {
    return false;
  }

  const level = Number(playerDigimon.level ?? 0);
  const bond = Number(playerDigimon.bond ?? 0);

  if (level < rule.minLevel) {
    return false;
  }

  if (bond < rule.minBond) {
    return false;
  }

  return true;
}

/**
 * Retorna todas as evoluções disponíveis para o Digimon informado.
 *
 * Cada entrada contém:
 * - targetSpeciesId
 * - targetSpecies
 * - requirements
 * - isAvailable
 *
 * @param {object} playerDigimon
 * @returns {object[]}
 */
export function getAvailableEvolutions(playerDigimon) {
  const currentSpeciesId = playerDigimon.speciesId;
  const rules = getEvolutionRulesForSpecies(currentSpeciesId);

  return Object.entries(rules)
    .map(([targetSpeciesId, requirements]) => {
      const targetSpecies = getDigimonSpecies(targetSpeciesId);

      if (!targetSpecies) {
        return null;
      }

      return {
        targetSpeciesId,
        targetSpecies,
        requirements,
        isAvailable: canEvolveTo(playerDigimon, targetSpeciesId)
      };
    })
    .filter(Boolean);
}

/**
 * Executa a evolução do Digimon.
 *
 * Regras da V1:
 * - troca speciesId
 * - mantém uid
 * - mantém nickname
 * - mantém level
 * - mantém exp
 * - mantém bond
 * - recalcula stats
 * - restaura HP/SP totalmente
 * - registra a nova forma na DigiDex, se o save for informado
 *
 * @param {object} playerDigimon
 * @param {string} targetSpeciesId
 * @param {object} [save]
 * @returns {object}
 */
export function evolveDigimon(playerDigimon, targetSpeciesId, save) {
  if (!canEvolveTo(playerDigimon, targetSpeciesId)) {
    throw new Error("Os requisitos de evolução não foram atendidos.");
  }

  const targetSpecies = getDigimonSpecies(targetSpeciesId);

  if (!targetSpecies) {
    throw new Error("Espécie de evolução inválida.");
  }

  // troca apenas a espécie
  playerDigimon.speciesId = targetSpeciesId;

  // recalcula os atributos com base na nova espécie
  recalculatePlayerDigimon(playerDigimon);

  // ao evoluir, restaura totalmente HP e SP
  playerDigimon.currentHP = playerDigimon.finalStats.hp;
  playerDigimon.currentSP = playerDigimon.finalStats.sp;

  // registra a nova forma na DigiDex
  if (save?.digidex) {
    uniquePush(save.digidex.seen, targetSpeciesId);
    uniquePush(save.digidex.owned, targetSpeciesId);
  }

  return playerDigimon;
}