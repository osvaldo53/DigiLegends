import { MAX_LEVEL, SAVE_KEY, SAVE_VERSION } from "../config/constants.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getItemById } from "../data/items.js";
import { createEmptySave } from "../factories/saveFactory.js";
import { recalculatePlayerDigimon } from "../factories/digimonFactory.js";
import { uniquePush } from "./utils.js";

function toSafeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeBonusStats(bonusStats) {
  return {
    hp: toSafeNumber(bonusStats?.hp),
    sp: toSafeNumber(bonusStats?.sp),
    atk: toSafeNumber(bonusStats?.atk),
    def: toSafeNumber(bonusStats?.def),
    int: toSafeNumber(bonusStats?.int),
    spd: toSafeNumber(bonusStats?.spd)
  };
}

function normalizeOwnedDigimon(rawDigimon, usedUids) {
  if (!rawDigimon || typeof rawDigimon !== "object") {
    return null;
  }

  const speciesId = String(rawDigimon.speciesId || "").trim();

  if (!getDigimonSpecies(speciesId)) {
    return null;
  }

  const preferredUid = String(rawDigimon.uid || "").trim();
  const uid =
    preferredUid && !usedUids.has(preferredUid)
      ? preferredUid
      : crypto.randomUUID();

  usedUids.add(uid);

  const digimon = {
    uid,
    speciesId,
    nickname: String(rawDigimon.nickname || ""),
    level: Math.max(1, Math.min(MAX_LEVEL, Math.floor(toSafeNumber(rawDigimon.level, 1)))),
    exp: Math.max(0, Math.floor(toSafeNumber(rawDigimon.exp, 0))),
    bond: Math.max(0, toSafeNumber(rawDigimon.bond, 0)),
    bonusStats: normalizeBonusStats(rawDigimon.bonusStats),
    learnedSkills: Array.isArray(rawDigimon.learnedSkills)
      ? rawDigimon.learnedSkills.filter((skillId) => typeof skillId === "string")
      : [],
    personality: String(rawDigimon.personality || "neutral"),
    createdAt: toSafeNumber(rawDigimon.createdAt, Date.now()),
    currentHP: toSafeNumber(rawDigimon.currentHP),
    currentSP: toSafeNumber(rawDigimon.currentSP)
  };

  recalculatePlayerDigimon(digimon);
  return digimon;
}

function normalizeDigimonCollection(collection, usedUids) {
  if (!Array.isArray(collection)) {
    return [];
  }

  return collection
    .map((digimon) => normalizeOwnedDigimon(digimon, usedUids))
    .filter(Boolean);
}

function normalizeInventory(inventory) {
  if (!Array.isArray(inventory)) {
    return [];
  }

  const mergedEntries = new Map();

  for (const entry of inventory) {
    const itemId = String(entry?.itemId || "").trim();
    const quantity = Math.floor(toSafeNumber(entry?.quantity, 0));

    if (!getItemById(itemId) || quantity <= 0) {
      continue;
    }

    mergedEntries.set(itemId, (mergedEntries.get(itemId) || 0) + quantity);
  }

  return Array.from(mergedEntries.entries()).map(([itemId, quantity]) => ({
    itemId,
    quantity
  }));
}

function normalizeScanData(scanData) {
  if (!scanData || typeof scanData !== "object") {
    return {};
  }

  const normalized = {};

  for (const [speciesId, percent] of Object.entries(scanData)) {
    if (!getDigimonSpecies(speciesId)) {
      continue;
    }

    normalized[speciesId] = Math.max(0, Math.min(999, Math.floor(toSafeNumber(percent, 0))));
  }

  return normalized;
}

function normalizeDigidexEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  const normalized = [];

  for (const speciesId of entries) {
    if (typeof speciesId !== "string" || !getDigimonSpecies(speciesId)) {
      continue;
    }

    uniquePush(normalized, speciesId);
  }

  return normalized;
}

/**
 * Salva os dados do jogo no localStorage.
 *
 * @param {object} saveData
 */
export function saveGame(saveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

/**
 * Carrega o save bruto do localStorage.
 *
 * Retorna:
 * - objeto do save, se existir e estiver válido
 * - null, se não houver save ou se o JSON estiver corrompido
 */
export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Falha ao ler save:", error);
    return null;
  }
}

/**
 * Informa se já existe save salvo.
 */
export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

/**
 * Remove o save atual.
 */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Migra saves antigos para a estrutura mais atual.
 *
 * @param {object} saveData
 * @returns {object}
 */
export function migrateSaveIfNeeded(saveData) {
  const base = createEmptySave();

  if (!saveData || typeof saveData !== "object") {
    return base;
  }

  const usedUids = new Set();
  const normalizedParty = normalizeDigimonCollection(saveData.party, usedUids);
  const normalizedStorage = normalizeDigimonCollection(saveData.storage, usedUids);
  const normalizedInventory = normalizeInventory(saveData.inventory);
  const normalizedScanData = normalizeScanData(saveData.scanData);
  const normalizedSeen = normalizeDigidexEntries(saveData.digidex?.seen);
  const normalizedOwned = normalizeDigidexEntries(saveData.digidex?.owned);

  for (const digimon of [...normalizedParty, ...normalizedStorage]) {
    uniquePush(normalizedSeen, digimon.speciesId);
    uniquePush(normalizedOwned, digimon.speciesId);
  }

  for (const speciesId of normalizedOwned) {
    uniquePush(normalizedSeen, speciesId);
  }

  for (const speciesId of Object.keys(normalizedScanData)) {
    uniquePush(normalizedSeen, speciesId);
  }

  const migrated = {
    ...base,
    ...saveData,
    playerName: String(saveData.playerName || "").trim(),
    bits: Math.max(0, Math.floor(toSafeNumber(saveData.bits, base.bits))),
    party: normalizedParty,
    storage: normalizedStorage,

    digidex: {
      ...base.digidex,
      ...(saveData.digidex || {}),
      seen: normalizedSeen,
      owned: normalizedOwned
    },

    progress: {
      ...base.progress,
      ...(saveData.progress || {}),
      huntsCompleted: Math.max(
        0,
        Math.floor(toSafeNumber(saveData.progress?.huntsCompleted, base.progress.huntsCompleted))
      )
    },

    inventory: normalizedInventory,
    scanData: normalizedScanData
  };

  migrated.version = SAVE_VERSION;

  return migrated;
}
