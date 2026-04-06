import { state } from "../core/state.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getScanRule } from "../data/scanRules.js";
import { createPlayerDigimon } from "../factories/digimonFactory.js";

/**
 * Percentual mínimo necessário para conversão.
 */
export const SCAN_CONVERSION_THRESHOLD = 100;

/**
 * Retorna o scan atual de uma espécie.
 *
 * @param {object} save
 * @param {string} speciesId
 * @returns {number}
 */
export function getScanPercent(save, speciesId) {
  return Number(save.scanData?.[speciesId] ?? 0);
}

/**
 * Define o scan atual de uma espécie.
 *
 * @param {object} save
 * @param {string} speciesId
 * @param {number} value
 */
export function setScanPercent(save, speciesId, value) {
  if (!save.scanData || typeof save.scanData !== "object") {
    save.scanData = {};
  }

  save.scanData[speciesId] = Math.max(0, Math.floor(value));
}

/**
 * Adiciona scan ao derrotar uma espécie.
 *
 * Regras:
 * - usa a tabela de scan por espécie
 * - acumula até no máximo 999
 *
 * @param {object} save
 * @param {string} speciesId
 * @returns {{ speciesId: string, gained: number, total: number }}
 */
export function addScanOnDefeat(save, speciesId) {
  const species = getDigimonSpecies(speciesId);

  if (!species) {
    throw new Error(`Espécie inválida para scan: ${speciesId}`);
  }

  const rule = getScanRule(speciesId);
  const gained = Number(rule.scanPercentOnDefeat ?? 0);
  const current = getScanPercent(save, speciesId);
  const nextValue = Math.min(999, current + gained);

  setScanPercent(save, speciesId, nextValue);

  return {
    speciesId,
    gained,
    total: nextValue
  };
}

/**
 * Verifica se a espécie já possui scan suficiente para conversão.
 *
 * @param {object} save
 * @param {string} speciesId
 * @returns {boolean}
 */
export function canConvertScan(save, speciesId) {
  return getScanPercent(save, speciesId) >= SCAN_CONVERSION_THRESHOLD;
}

/**
 * Retorna todas as espécies que possuem algum scan acumulado.
 *
 * @param {object} save
 * @returns {Array<{speciesId: string, percent: number, stage: string}>}
 */
export function getAllScannedSpecies(save) {
  const scanData = save.scanData || {};

  return Object.entries(scanData)
    .map(([speciesId, percent]) => {
      const species = getDigimonSpecies(speciesId);
      const rule = getScanRule(speciesId);

      if (!species) {
        return null;
      }

      return {
        speciesId,
        percent: Number(percent ?? 0),
        stage: rule.stage,
        species
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.percent - a.percent || a.species.name.localeCompare(b.species.name));
}

/**
 * Converte 100% de scan em um novo Digimon.
 *
 * Regras:
 * - consome 100% do scan
 * - cria uma nova instância do Digimon no level 1
 * - adiciona ao time se houver espaço
 * - senão, envia para o storage
 * - registra a espécie como seen/owned na DigiDex
 *
 * @param {object} save
 * @param {string} speciesId
 * @returns {{ digimon: object, destination: "party" | "storage" }}
 */
export function convertScanToDigimon(save, speciesId) {
  const species = getDigimonSpecies(speciesId);

  if (!species) {
    throw new Error("Espécie inválida para conversão.");
  }

  if (!canConvertScan(save, speciesId)) {
    throw new Error("Scan insuficiente para conversão.");
  }

  const current = getScanPercent(save, speciesId);
  setScanPercent(save, speciesId, current - SCAN_CONVERSION_THRESHOLD);

  const newDigimon = createPlayerDigimon(speciesId, {
    level: 1,
    exp: 0,
    bond: 0
  });

  let destination = "storage";

  // Limite inicial simples de time
  if ((save.party?.length ?? 0) < 3) {
    save.party.push(newDigimon);
    destination = "party";
  } else {
    save.storage.push(newDigimon);
  }

  if (!save.digidex.seen.includes(speciesId)) {
    save.digidex.seen.push(speciesId);
  }

  if (!save.digidex.owned.includes(speciesId)) {
    save.digidex.owned.push(speciesId);
  }

  return {
    digimon: newDigimon,
    destination
  };
}

/**
 * Função utilitária para uso direto na sessão atual.
 *
 * @param {string} speciesId
 * @returns {{ speciesId: string, gained: number, total: number }}
 */
export function addScanOnDefeatToCurrentSave(speciesId) {
  return addScanOnDefeat(state.save, speciesId);
}