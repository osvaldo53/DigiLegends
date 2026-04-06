import { getHuntById } from "../data/encounters.js";
import { createEnemyDigimon } from "../factories/digimonFactory.js";

/**
 * Sorteia um valor inteiro entre min e max, inclusive.
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function randomInt(min, max) {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

/**
 * Regras de faixa de nível por hunt.
 *
 * Importante:
 * - os inimigos NÃO escalam com o nível do jogador
 * - cada área possui sua própria faixa fixa
 */
const HUNT_LEVEL_RANGES = {
  "training-grounds": { min: 1, max: 3 },
  "rookie-forest": { min: 4, max: 8 },
  "champion-ridge": { min: 10, max: 16 },
  "ultimate-domain": { min: 18, max: 28 }
};

/**
 * Retorna a faixa de nível da hunt.
 *
 * Fallback:
 * - caso a hunt não esteja mapeada, usa minLevel da própria hunt
 *
 * @param {object} hunt
 * @returns {{min:number, max:number}}
 */
function getHuntLevelRange(hunt) {
  const predefinedRange = HUNT_LEVEL_RANGES[hunt.id];

  if (predefinedRange) {
    return predefinedRange;
  }

  const fallbackLevel = Math.max(1, Number(hunt.minLevel ?? 1));

  return {
    min: fallbackLevel,
    max: fallbackLevel + 2
  };
}

/**
 * Sorteia uma espécie inimiga dentro da pool da hunt.
 *
 * @param {object} hunt
 * @returns {string}
 */
function rollEnemySpeciesId(hunt) {
  const pool = hunt.enemyPool || [];

  if (!pool.length) {
    throw new Error(`A hunt "${hunt.id}" não possui inimigos configurados.`);
  }

  const index = randomInt(0, pool.length - 1);
  return pool[index];
}

/**
 * Cria um encontro com base na hunt selecionada.
 *
 * Regra:
 * - a espécie vem da enemyPool da hunt
 * - o nível vem da faixa fixa da hunt
 *
 * @param {string} huntId
 * @returns {{hunt: object, enemy: object}}
 */
export function createEncounterFromHunt(huntId) {
  const hunt = getHuntById(huntId);

  if (!hunt) {
    throw new Error("Hunt inválida.");
  }

  const enemySpeciesId = rollEnemySpeciesId(hunt);
  const levelRange = getHuntLevelRange(hunt);
  const enemyLevel = randomInt(levelRange.min, levelRange.max);

  const enemy = createEnemyDigimon(enemySpeciesId, enemyLevel);

  return {
    hunt,
    enemy
  };
}