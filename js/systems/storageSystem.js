import { MAX_PARTY_SIZE } from "../config/constants.js";
import { getScanRule } from "../data/scanRules.js";
import { addItemToInventory } from "./itemSystem.js";

/**
 * Sistema de gerenciamento entre Party e Storage.
 *
 * Regras:
 * - Party máxima: 3 Digimons
 * - Party não pode ficar vazia
 * - Storage não possui limite nesta fase
 *
 * Convenção importante:
 * - o líder é sempre o primeiro elemento da party
 */

export const PARTY_LIMIT = MAX_PARTY_SIZE;

const XP_CHIP_REWARDS_BY_STAGE = {
  "In-Training": "xp_chip_tiny",
  Rookie: "xp_chip_small",
  Champion: "xp_chip_medium",
  Armor: "xp_chip_medium",
  Ultimate: "xp_chip_large",
  Mega: "xp_chip_mega",
  Ultra: "xp_chip_mega"
};

export function getXpChipRewardForSpecies(speciesId) {
  const stage = getScanRule(speciesId)?.stage || "Unknown";
  return XP_CHIP_REWARDS_BY_STAGE[stage] || "xp_chip_tiny";
}

/**
 * Verifica se a party está cheia.
 *
 * @param {object} save
 * @returns {boolean}
 */
export function isPartyFull(save) {
  return (save.party?.length ?? 0) >= PARTY_LIMIT;
}

/**
 * Verifica se a party ficaria vazia.
 *
 * @param {object} save
 * @returns {boolean}
 */
export function wouldPartyBecomeEmpty(save) {
  return (save.party?.length ?? 0) <= 1;
}

/**
 * Move um Digimon da party para o storage.
 *
 * Regra:
 * - não permite deixar a party vazia
 *
 * @param {object} save
 * @param {string} digimonUid
 * @returns {object}
 */
export function moveDigimonToStorage(save, digimonUid) {
  const index = save.party.findIndex((digimon) => digimon.uid === digimonUid);

  if (index === -1) {
    throw new Error("Digimon não encontrado na party.");
  }

  if (wouldPartyBecomeEmpty(save)) {
    throw new Error("A party não pode ficar vazia.");
  }

  const [digimon] = save.party.splice(index, 1);
  save.storage.push(digimon);

  return digimon;
}

/**
 * Move um Digimon do storage para a party.
 *
 * Regra:
 * - não permite ultrapassar o limite da party
 *
 * @param {object} save
 * @param {string} digimonUid
 * @returns {object}
 */
export function moveDigimonToParty(save, digimonUid) {
  if (isPartyFull(save)) {
    throw new Error("A party já está cheia.");
  }

  const index = save.storage.findIndex((digimon) => digimon.uid === digimonUid);

  if (index === -1) {
    throw new Error("Digimon não encontrado no storage.");
  }

  const [digimon] = save.storage.splice(index, 1);
  save.party.push(digimon);

  return digimon;
}

export function tradeStorageDigimonForXpChip(save, digimonUid) {
  const index = save.storage.findIndex((digimon) => digimon.uid === digimonUid);

  if (index === -1) {
    throw new Error("Digimon nÃ£o encontrado no storage.");
  }

  const [digimon] = save.storage.splice(index, 1);
  const rewardItemId = getXpChipRewardForSpecies(digimon.speciesId);

  addItemToInventory(save, rewardItemId, 1);

  return {
    digimon,
    rewardItemId
  };
}

export function tradeMultipleStorageDigimonsForXpChips(save, digimonUids = []) {
  const normalizedUids = Array.from(
    new Set(
      (Array.isArray(digimonUids) ? digimonUids : []).filter(
        (digimonUid) => typeof digimonUid === "string" && digimonUid.trim()
      )
    )
  );

  if (!normalizedUids.length) {
    throw new Error("Nenhum Digimon foi selecionado para troca.");
  }

  const tradedDigimons = [];
  const rewardSummary = new Map();

  normalizedUids.forEach((digimonUid) => {
    const result = tradeStorageDigimonForXpChip(save, digimonUid);
    tradedDigimons.push(result.digimon);
    rewardSummary.set(
      result.rewardItemId,
      (rewardSummary.get(result.rewardItemId) || 0) + 1
    );
  });

  return {
    tradedDigimons,
    rewards: Array.from(rewardSummary.entries()).map(([itemId, quantity]) => ({
      itemId,
      quantity
    }))
  };
}

/**
 * Define um Digimon da party como líder.
 *
 * Regra:
 * - o líder é sempre o primeiro elemento do array party
 * - se o Digimon já for o líder, nada muda
 *
 * @param {object} save
 * @param {string} digimonUid
 * @returns {object}
 */
export function setPartyLeader(save, digimonUid) {
  const index = save.party.findIndex((digimon) => digimon.uid === digimonUid);

  if (index === -1) {
    throw new Error("Digimon não encontrado na party.");
  }

  if (index === 0) {
    return save.party[0];
  }

  const [digimon] = save.party.splice(index, 1);
  save.party.unshift(digimon);

  return digimon;
}
