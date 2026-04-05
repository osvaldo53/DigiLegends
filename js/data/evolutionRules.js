/**
 * Regras de evolução por espécie.
 *
 * Estrutura:
 * EVOLUTION_RULES[speciesId][targetSpeciesId] = {
 *   minLevel: number,
 *   minBond: number
 * }
 *
 * Observações:
 * - esta camada é separada de digimons.js para facilitar balanceamento
 * - species.evolutions continua sendo útil como referência de rota
 * - aqui ficam apenas os requisitos
 */

export const EVOLUTION_RULES = {
  agumon: {
    greymon: {
      minLevel: 10,
      minBond: 5
    }
  },

  gabumon: {
    garurumon: {
      minLevel: 10,
      minBond: 5
    }
  },

  patamon: {
    angemon: {
      minLevel: 10,
      minBond: 8
    }
  },

  greymon: {
    metalgreymon: {
      minLevel: 22,
      minBond: 20
    }
  },

  garurumon: {
    weregarurumon: {
      minLevel: 22,
      minBond: 20
    }
  },

  angemon: {
    holyangemon: {
      minLevel: 24,
      minBond: 25
    }
  }
};

/**
 * Retorna todas as regras de evolução de uma espécie.
 *
 * @param {string} speciesId
 * @returns {object}
 */
export function getEvolutionRulesForSpecies(speciesId) {
  return EVOLUTION_RULES[speciesId] || {};
}

/**
 * Retorna a regra específica de evolução para um alvo.
 *
 * @param {string} speciesId
 * @param {string} targetSpeciesId
 * @returns {object|null}
 */
export function getEvolutionRule(speciesId, targetSpeciesId) {
  return EVOLUTION_RULES[speciesId]?.[targetSpeciesId] || null;
}