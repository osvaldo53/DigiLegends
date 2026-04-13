import { getDigimonSpecies } from "../data/digimons.js";
import {
  getEvolutionRule,
  getEvolutionRulesForSpecies
} from "../data/evolutionRules.js";
import { recalculatePlayerDigimon } from "../factories/digimonFactory.js";
import { uniquePush } from "../core/utils.js";
import { consumeItem, getInventoryEntry } from "./itemSystem.js";
import { getLevelCapForDigimon } from "./digimonProgressionSystem.js";

export const EVOLUTION_STAT_LABELS = {
  atk: "ATK",
  def: "DEF",
  int: "INT",
  spd: "SPD"
};

function isDnaEvolutionRule(rule) {
  return rule?.type === "dna";
}

function isArmorEvolutionRule(rule) {
  return rule?.type === "armor";
}

function getAllOwnedDigimons(save) {
  if (!save) {
    return [];
  }

  return [...(save.party || []), ...(save.storage || [])];
}

function isEligibleDnaPartner(playerDigimon, candidate, rule) {
  if (!candidate || candidate.uid === playerDigimon.uid) {
    return false;
  }

  if (candidate.speciesId !== rule.partnerSpeciesId) {
    return false;
  }

  const partnerLevel = Number(candidate.level ?? 0);
  const partnerBond = Number(candidate.bond ?? 0);

  return (
    partnerLevel >= Number(rule.partnerMinLevel ?? rule.minLevel ?? 0) &&
    partnerBond >= Number(rule.partnerMinBond ?? rule.minBond ?? 0)
  );
}

function getDnaPartners(playerDigimon, rule, save) {
  if (!isDnaEvolutionRule(rule)) {
    return [];
  }

  return getAllOwnedDigimons(save).filter((candidate) =>
    isEligibleDnaPartner(playerDigimon, candidate, rule)
  );
}

function findDigimonByUid(save, digimonUid) {
  return getAllOwnedDigimons(save).find((digimon) => digimon.uid === digimonUid) || null;
}

function findSelectedDnaPartner(playerDigimon, rule, save, partnerUid) {
  const eligiblePartners = getDnaPartners(playerDigimon, rule, save);

  if (!eligiblePartners.length) {
    return null;
  }

  if (partnerUid) {
    return eligiblePartners.find((candidate) => candidate.uid === partnerUid) || null;
  }

  return eligiblePartners[0];
}

function removeDigimonFromSave(save, digimonUid) {
  for (const collectionName of ["party", "storage"]) {
    const collection = save?.[collectionName];

    if (!Array.isArray(collection)) {
      continue;
    }

    const index = collection.findIndex((digimon) => digimon.uid === digimonUid);

    if (index !== -1) {
      const [removedDigimon] = collection.splice(index, 1);
      return removedDigimon;
    }
  }

  return null;
}

function hasRequiredEvolutionItem(save, itemId) {
  if (!save || !itemId) {
    return false;
  }

  const inventoryEntry = getInventoryEntry(save, itemId);
  return Boolean(inventoryEntry && inventoryEntry.quantity > 0);
}

function getRuleMinStats(rule) {
  return rule?.minStats && typeof rule.minStats === "object" ? rule.minStats : {};
}

function getMissingEvolutionRequirements(playerDigimon, rule, save, options = {}) {
  const missing = [];
  const level = Number(playerDigimon.level ?? 0);
  const bond = Number(playerDigimon.bond ?? 0);

  if (level < Number(rule.minLevel ?? 0)) {
    missing.push(`Lv. ${rule.minLevel}`);
  }

  if (bond < Number(rule.minBond ?? 0)) {
    missing.push(`Bond ${rule.minBond}`);
  }

  Object.entries(getRuleMinStats(rule)).forEach(([statKey, minValue]) => {
    const currentValue = Number(playerDigimon.finalStats?.[statKey] ?? 0);

    if (currentValue < Number(minValue ?? 0)) {
      missing.push(`${EVOLUTION_STAT_LABELS[statKey] || statKey.toUpperCase()} ${minValue}`);
    }
  });

  if (isArmorEvolutionRule(rule) && !hasRequiredEvolutionItem(save, rule.requiredItemId)) {
    missing.push("Item de Armor");
  }

  if (isDnaEvolutionRule(rule) && !findSelectedDnaPartner(playerDigimon, rule, save, options.partnerUid)) {
    missing.push("Parceiro DNA");
  }

  return missing;
}

/**
 * Verifica se uma instância de Digimon pode evoluir para a espécie alvo.
 *
 * Requisitos atuais:
 * - level mínimo
 * - bond mínimo
 * - parceiro elegível em DNA evolution
 *
 * @param {object} playerDigimon
 * @param {string} targetSpeciesId
 * @param {object} [save]
 * @param {object} [options]
 * @returns {boolean}
 */
export function canEvolveTo(playerDigimon, targetSpeciesId, save, options = {}) {
  const currentSpeciesId = playerDigimon.speciesId;
  const rule = getEvolutionRule(currentSpeciesId, targetSpeciesId);

  if (!rule) {
    return false;
  }

  return getMissingEvolutionRequirements(playerDigimon, rule, save, options).length === 0;
}

/**
 * Retorna todas as evoluções disponíveis para o Digimon informado.
 *
 * Cada entrada contém:
 * - targetSpeciesId
 * - targetSpecies
 * - requirements
 * - dnaPartners
 * - dnaPartner
 * - isAvailable
 *
 * @param {object} playerDigimon
 * @param {object} [save]
 * @returns {object[]}
 */
export function getAvailableEvolutions(playerDigimon, save) {
  const currentSpeciesId = playerDigimon.speciesId;
  const rules = getEvolutionRulesForSpecies(currentSpeciesId);

  return Object.entries(rules)
    .map(([targetSpeciesId, requirements]) => {
      const targetSpecies = getDigimonSpecies(targetSpeciesId);

      if (!targetSpecies) {
        return null;
      }

      const dnaPartners = isDnaEvolutionRule(requirements)
        ? getDnaPartners(playerDigimon, requirements, save)
        : [];
      const hasRequiredItem = isArmorEvolutionRule(requirements)
        ? hasRequiredEvolutionItem(save, requirements.requiredItemId)
        : false;
      const missingRequirements = getMissingEvolutionRequirements(
        playerDigimon,
        requirements,
        save
      );

      return {
        targetSpeciesId,
        targetSpecies,
        requirements,
        dnaPartners,
        dnaPartner: dnaPartners[0] || null,
        hasRequiredItem,
        levelCap: getLevelCapForDigimon(playerDigimon),
        missingRequirements,
        isAvailable: missingRequirements.length === 0
      };
    })
    .filter(Boolean);
}

/**
 * Executa a evolução do Digimon.
 *
 * Regras da V1:
 * - troca speciesId
 * - mantém uid
 * - mantém nickname
 * - mantém level
 * - mantém exp
 * - mantém bond
 * - recalcula stats
 * - restaura HP/SP totalmente
 * - registra a nova forma na DigiDex, se o save for informado
 * - consome o parceiro em DNA evolution
 *
 * @param {object} playerDigimon
 * @param {string} targetSpeciesId
 * @param {object} [save]
 * @param {object} [options]
 * @returns {object}
 */
export function evolveDigimon(playerDigimon, targetSpeciesId, save, options = {}) {
  if (!canEvolveTo(playerDigimon, targetSpeciesId, save, options)) {
    throw new Error("Os requisitos de evolução não foram atendidos.");
  }

  const targetSpecies = getDigimonSpecies(targetSpeciesId);
  const rule = getEvolutionRule(playerDigimon.speciesId, targetSpeciesId);

  if (!targetSpecies) {
    throw new Error("Espécie de evolução inválida.");
  }

  if (!rule) {
    throw new Error("Regra de evolução inválida.");
  }

  if (isArmorEvolutionRule(rule)) {
    if (!hasRequiredEvolutionItem(save, rule.requiredItemId)) {
      throw new Error("O Digi-Ovo necessario para esta evolucao nao foi encontrado.");
    }

    consumeItem(save, rule.requiredItemId, 1);
  }

  if (isDnaEvolutionRule(rule)) {
    if (options.partnerUid && !findDigimonByUid(save, options.partnerUid)) {
      throw new Error("O parceiro selecionado não foi encontrado.");
    }

    const dnaPartner = findSelectedDnaPartner(
      playerDigimon,
      rule,
      save,
      options.partnerUid
    );

    if (!dnaPartner) {
      throw new Error("O parceiro necessário para a DNA Evolution não foi encontrado.");
    }

    removeDigimonFromSave(save, dnaPartner.uid);
  }

  playerDigimon.speciesId = targetSpeciesId;
  recalculatePlayerDigimon(playerDigimon);
  playerDigimon.currentHP = playerDigimon.finalStats.hp;
  playerDigimon.currentSP = playerDigimon.finalStats.sp;

  if (save?.digidex) {
    uniquePush(save.digidex.seen, targetSpeciesId);
    uniquePush(save.digidex.owned, targetSpeciesId);
  }

  return playerDigimon;
}
