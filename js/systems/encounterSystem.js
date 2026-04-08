import { getHuntById } from "../data/encounters.js";
import { createEnemyDigimon } from "../factories/digimonFactory.js";

function randomInt(min, max) {
  const safeMin = Math.ceil(min);
  const safeMax = Math.floor(max);
  return Math.floor(Math.random() * (safeMax - safeMin + 1)) + safeMin;
}

const HUNT_LEVEL_RANGES = {
  "training-grounds": { min: 1, max: 3 },
  "rookie-forest": { min: 4, max: 8 },
  "champion-ridge": { min: 10, max: 16 },
  "ultimate-domain": { min: 18, max: 28 },
  "mega-sanctuary": { min: 32, max: 45 }
};

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

  return {
    hunt,
    enemy,
    rewards: enemyEntry.rewards || hunt.rewards
  };
}
