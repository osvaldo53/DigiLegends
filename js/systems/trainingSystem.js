import { recalculatePlayerDigimon } from "../factories/digimonFactory.js";
import { consumeItem, getInventoryEntry } from "./itemSystem.js";
import { getTrainingCapForDigimon } from "./digimonProgressionSystem.js";

export const TRAINABLE_STATS = ["hp", "sp", "atk", "def", "int", "spd"];
export const TRAINING_ITEM_BY_STAT = {
  hp: "training_chip_hp",
  sp: "training_chip_sp",
  atk: "training_chip_atk",
  def: "training_chip_def",
  int: "training_chip_int",
  spd: "training_chip_spd"
};
export const TRAINING_GAIN_BY_STAT = {
  hp: 6,
  sp: 3,
  atk: 1,
  def: 1,
  int: 1,
  spd: 1
};
export const TRAINING_DURATION_PER_POINT_MS = 15 * 60 * 1000;

function ensureTrainingState(save) {
  if (!save.training || typeof save.training !== "object") {
    save.training = {
      jobs: []
    };
  }

  if (!Array.isArray(save.training.jobs)) {
    save.training.jobs = [];
  }

  return save.training;
}

function findOwnedDigimon(save, digimonUid) {
  return (
    save.party.find((digimon) => digimon.uid === digimonUid) ||
    save.storage.find((digimon) => digimon.uid === digimonUid) ||
    null
  );
}

function normalizeQuantity(quantity) {
  return Math.max(1, Math.floor(Number(quantity) || 1));
}

export function getTrainingItemIdForStat(statKey) {
  return TRAINING_ITEM_BY_STAT[statKey] || null;
}

export function getTrainingItemQuantity(save, statKey) {
  const itemId = getTrainingItemIdForStat(statKey);
  return getInventoryEntry(save, itemId)?.quantity ?? 0;
}

export function getUsedTrainingPoints(playerDigimon) {
  return TRAINABLE_STATS.reduce(
    (total, statKey) =>
      total +
      Math.floor(
        Number(playerDigimon?.bonusStats?.[statKey] ?? 0) /
          Number(TRAINING_GAIN_BY_STAT[statKey] ?? 1)
      ),
    0
  );
}

export function getTrainingJobForDigimon(save, digimonUid) {
  ensureTrainingState(save);
  return save.training.jobs.find((job) => job.digimonUid === digimonUid) || null;
}

export function isTrainingJobComplete(job, now = Date.now()) {
  return Boolean(job && Number(job.endsAt ?? 0) <= now);
}

export function getRemainingTrainingPoints(playerDigimon) {
  const trainingCap = getTrainingCapForDigimon(playerDigimon);
  return Math.max(0, trainingCap - getUsedTrainingPoints(playerDigimon));
}

export function getMaxTrainingQuantity(save, playerDigimon, statKey) {
  if (!playerDigimon || !TRAINABLE_STATS.includes(statKey)) {
    return 0;
  }

  if (getTrainingJobForDigimon(save, playerDigimon.uid)) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      getRemainingTrainingPoints(playerDigimon),
      getTrainingItemQuantity(save, statKey)
    )
  );
}

export function canTrainDigimonStat(save, playerDigimon, statKey, quantity = 1) {
  const normalizedQuantity = normalizeQuantity(quantity);

  return getMaxTrainingQuantity(save, playerDigimon, statKey) >= normalizedQuantity;
}

export function startTrainingJob(save, digimonUid, statKey, quantity = 1, now = Date.now()) {
  if (!TRAINABLE_STATS.includes(statKey)) {
    throw new Error("Atributo de treino invalido.");
  }

  const playerDigimon = findOwnedDigimon(save, digimonUid);

  if (!playerDigimon) {
    throw new Error("Digimon nao foi encontrado.");
  }

  const normalizedQuantity = normalizeQuantity(quantity);

  if (!canTrainDigimonStat(save, playerDigimon, statKey, normalizedQuantity)) {
    throw new Error("Nao e possivel iniciar este treino com a quantidade selecionada.");
  }

  const training = ensureTrainingState(save);
  const itemId = getTrainingItemIdForStat(statKey);

  consumeItem(save, itemId, normalizedQuantity);

  const job = {
    digimonUid,
    statKey,
    quantity: normalizedQuantity,
    gainPerPoint: TRAINING_GAIN_BY_STAT[statKey] ?? 1,
    itemId,
    startedAt: now,
    endsAt: now + normalizedQuantity * TRAINING_DURATION_PER_POINT_MS
  };

  training.jobs.push(job);
  return job;
}

export function claimTrainingJob(save, digimonUid, now = Date.now()) {
  const training = ensureTrainingState(save);
  const jobIndex = training.jobs.findIndex((job) => job.digimonUid === digimonUid);

  if (jobIndex === -1) {
    throw new Error("Nenhum treino foi encontrado para este Digimon.");
  }

  const job = training.jobs[jobIndex];

  if (!isTrainingJobComplete(job, now)) {
    throw new Error("O treino ainda nao foi concluido.");
  }

  const playerDigimon = findOwnedDigimon(save, digimonUid);

  if (!playerDigimon) {
    throw new Error("Digimon nao foi encontrado.");
  }

  const totalGain = Number(job.gainPerPoint ?? 1) * Number(job.quantity ?? 1);
  playerDigimon.bonusStats[job.statKey] =
    Number(playerDigimon.bonusStats?.[job.statKey] ?? 0) + totalGain;
  recalculatePlayerDigimon(playerDigimon);
  training.jobs.splice(jobIndex, 1);

  return {
    digimon: playerDigimon,
    statKey: job.statKey,
    quantity: job.quantity,
    totalGain
  };
}
