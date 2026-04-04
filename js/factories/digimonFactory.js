import { getDigimonSpecies } from "../data/digimons.js";
import { clamp } from "../core/utils.js";

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

  return playerDigimon;
}

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
    bonusStats,
    finalStats,
    currentHP: finalStats.hp,
    currentSP: finalStats.sp,
    learnedSkills: [],
    personality: options.personality || "neutral",
    createdAt: Date.now()
  };
}

export function createEnemyDigimon(speciesId, level = 1) {
  const species = getDigimonSpecies(speciesId);

  if (!species) {
    throw new Error(`Espécie inimiga inválida: ${speciesId}`);
  }

  const scaledStats = buildFinalStats(species.baseStats, level, {
    hp: 0, sp: 0, atk: 0, def: 0, int: 0, spd: 0
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
