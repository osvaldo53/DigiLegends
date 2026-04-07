import { MAX_PARTY_SIZE } from "../config/constants.js";

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
