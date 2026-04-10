import { getHuntById } from "../data/encounters.js";
import { createEnemyDigimon } from "../factories/digimonFactory.js";

function randomInt(min, max) {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

function normalizeEnemyEntry(entry) {
  if (typeof entry === "string") {
    return {
      speciesId: entry,
      weight: 1,
      rewards: null,
      levelRange: null
    };
  }

  return {
    speciesId: entry.speciesId,
    weight: Math.max(1, Number(entry.weight ?? 1)),
    rewards: entry.rewards || null,
    levelRange: entry.levelRange || null
  };
}

function getHuntLevelRange(hunt, enemyEntry = null) {
  if (enemyEntry?.levelRange) {
    return enemyEntry.levelRange;
  }

  if (hunt.levelRange) {
    return hunt.levelRange;
  }

  const fallbackLevel = Math.max(1, Number(hunt.minLevel ?? 1));

  return {
    min: fallbackLevel,
    max: fallbackLevel + 2
  };
}

function calculateHuntExp(hunt, enemyLevel) {
  const multiplier = Number(hunt.expFormula?.multiplier ?? 2);
  const base = Number(hunt.expFormula?.base ?? 0);

  return Math.max(1, Math.round(enemyLevel * multiplier + base));
}

function rollEnemyEntry(hunt) {
  const pool = (hunt.enemyPool || []).map(normalizeEnemyEntry);

  if (!pool.length) {
    throw new Error(`A hunt "${hunt.id}" não possui inimigos configurados.`);
  }

  const totalWeight = pool.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of pool) {
    roll -= entry.weight;

    if (roll < 0) {
      return entry;
    }
  }

  return pool[pool.length - 1];
}

export function createEncounterFromHunt(huntId) {
  const hunt = getHuntById(huntId);

  if (!hunt) {
    throw new Error("Hunt inválida.");
  }

  const enemyEntry = rollEnemyEntry(hunt);
  const levelRange = getHuntLevelRange(hunt, enemyEntry);
  const enemyLevel = randomInt(levelRange.min, levelRange.max);
  const enemy = createEnemyDigimon(enemyEntry.speciesId, enemyLevel);
  const defaultRewards = {
    bits: hunt.rewards?.bits || 0,
    exp: calculateHuntExp(hunt, enemyLevel)
  };

  return {
    hunt,
    enemy,
    rewards: enemyEntry.rewards || defaultRewards
  };
}
