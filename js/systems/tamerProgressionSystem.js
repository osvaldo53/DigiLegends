export const TAMER_MAX_LEVEL = 100;

export function getTamerExpToNextLevel(level) {
  const safeLevel = Math.max(1, Math.floor(Number(level) || 1));
  return 75 + safeLevel * 25 + (safeLevel - 1) * (safeLevel - 1) * 5;
}

export function normalizeTamerProgression(tamer = {}) {
  const level = Math.max(
    1,
    Math.min(TAMER_MAX_LEVEL, Math.floor(Number(tamer?.level) || 1))
  );
  const expToNextLevel = getTamerExpToNextLevel(level);
  const exp =
    level >= TAMER_MAX_LEVEL
      ? 0
      : Math.max(0, Math.min(expToNextLevel - 1, Math.floor(Number(tamer?.exp) || 0)));

  return {
    level,
    exp
  };
}

export function getTamerProgress(save) {
  if (!save.tamer || typeof save.tamer !== "object") {
    save.tamer = normalizeTamerProgression();
  } else {
    save.tamer = normalizeTamerProgression(save.tamer);
  }

  return save.tamer;
}

export function addTamerExp(save, expAmount = 0) {
  const tamer = getTamerProgress(save);
  let remainingExp = Math.max(0, Math.floor(Number(expAmount) || 0));
  let gainedLevels = 0;

  if (remainingExp <= 0 || tamer.level >= TAMER_MAX_LEVEL) {
    return {
      level: tamer.level,
      exp: tamer.exp,
      gainedLevels,
      expGained: 0
    };
  }

  const expGained = remainingExp;

  while (remainingExp > 0 && tamer.level < TAMER_MAX_LEVEL) {
    const expToNextLevel = getTamerExpToNextLevel(tamer.level);
    const neededExp = expToNextLevel - tamer.exp;

    if (remainingExp < neededExp) {
      tamer.exp += remainingExp;
      remainingExp = 0;
      break;
    }

    remainingExp -= neededExp;
    tamer.level += 1;
    tamer.exp = 0;
    gainedLevels += 1;
  }

  if (tamer.level >= TAMER_MAX_LEVEL) {
    tamer.level = TAMER_MAX_LEVEL;
    tamer.exp = 0;
  }

  return {
    level: tamer.level,
    exp: tamer.exp,
    gainedLevels,
    expGained
  };
}

export function getTamerExpFromBattleRewards(rewards, context = "hunt") {
  const battleExp = Math.max(0, Math.floor(Number(rewards?.exp) || 0));

  if (battleExp <= 0) {
    return 0;
  }

  const multiplier = context === "boss" ? 0.35 : 0.2;
  const minimum = context === "boss" ? 12 : 4;
  return Math.max(minimum, Math.floor(battleExp * multiplier));
}

export function getTamerBossCompletionBonus(boss) {
  const recommendedLevel = Math.max(1, Math.floor(Number(boss?.recommendedLevel) || 1));
  return 50 + recommendedLevel;
}
