import { getHuntById } from "../data/encounters.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { choice, randomInt } from "../core/utils.js";
import { createEnemyDigimon } from "../factories/digimonFactory.js";

export function createEncounterFromHunt(huntId, playerLevel = 1) {
  const hunt = getHuntById(huntId);

  if (!hunt) {
    throw new Error("Hunt inválida.");
  }

  const enemySpeciesId = choice(hunt.enemyPool);
  const enemySpecies = getDigimonSpecies(enemySpeciesId);

  const minLevel = Math.max(1, hunt.minLevel);
  const maxLevel = Math.max(minLevel, playerLevel + 1);
  const enemyLevel = randomInt(minLevel, maxLevel);

  const enemy = createEnemyDigimon(enemySpeciesId, enemyLevel);

  return {
    hunt,
    enemy,
    enemySpecies
  };
}
