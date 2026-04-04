import { MAX_LEVEL } from "../config/constants.js";
import { recalculatePlayerDigimon } from "../factories/digimonFactory.js";

export function getExpToNextLevel(level) {
  return 20 + (level - 1) * 15;
}

export function applyBattleRewards(playerDigimon, rewards, save) {
  if (!playerDigimon) return { leveledUp: false, gainedLevels: 0 };

  save.bits += rewards.bits || 0;

  let gainedLevels = 0;
  playerDigimon.exp += rewards.exp || 0;

  while (playerDigimon.level < MAX_LEVEL) {
    const needed = getExpToNextLevel(playerDigimon.level);
    if (playerDigimon.exp < needed) break;

    playerDigimon.exp -= needed;
    playerDigimon.level += 1;
    gainedLevels += 1;
  }

  recalculatePlayerDigimon(playerDigimon);

  if (gainedLevels > 0) {
    playerDigimon.currentHP = playerDigimon.finalStats.hp;
    playerDigimon.currentSP = playerDigimon.finalStats.sp;
  }

  return {
    leveledUp: gainedLevels > 0,
    gainedLevels
  };
}
