import { MAX_LEVEL } from "../config/constants.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getScanRule } from "../data/scanRules.js";

export const LEVEL_CAPS_BY_STAGE = {
  "In-Training": 10,
  Rookie: 20,
  Champion: 35,
  Armor: 35,
  Ultimate: 50,
  Mega: 65,
  Ultra: 80
};

export const TRAINING_CAPS_BY_STAGE = {
  "In-Training": 0,
  Rookie: 4,
  Champion: 8,
  Armor: 8,
  Ultimate: 16,
  Mega: 32,
  Ultra: 64
};

export function getDigimonStage(speciesId) {
  return getScanRule(speciesId)?.stage || "Unknown";
}

export function getLevelCapForStage(stage) {
  return LEVEL_CAPS_BY_STAGE[stage] || MAX_LEVEL;
}

export function getTrainingCapForStage(stage) {
  return TRAINING_CAPS_BY_STAGE[stage] || 0;
}

export function getLevelCapForSpecies(speciesId) {
  const stage = getDigimonStage(speciesId);

  if (["Armor", "Mega", "Ultra"].includes(stage)) {
    return MAX_LEVEL;
  }

  const species = getDigimonSpecies(speciesId);
  const hasFurtherEvolution = Array.isArray(species?.evolutions) && species.evolutions.length > 0;

  if (!hasFurtherEvolution) {
    return MAX_LEVEL;
  }

  return getLevelCapForStage(stage);
}

export function getTrainingCapForSpecies(speciesId) {
  return getTrainingCapForStage(getDigimonStage(speciesId));
}

export function getLevelCapForDigimon(playerDigimon) {
  return getLevelCapForSpecies(playerDigimon?.speciesId);
}

export function getTrainingCapForDigimon(playerDigimon) {
  return getTrainingCapForSpecies(playerDigimon?.speciesId);
}
