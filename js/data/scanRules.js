/**
 * Regras de scan por espécie.
 *
 * Mantemos isso separado de digimons.js para:
 * - não inflar a estrutura base da espécie
 * - facilitar balanceamento
 * - permitir ajustes de scan sem mexer nos dados centrais
 *
 * stage:
 * - apenas metadado de progressão/captura
 *
 * scanPercentOnDefeat:
 * - percentual ganho ao derrotar a espécie
 */
export const SCAN_RULES = {
  koromon: {
    stage: "Baby",
    scanPercentOnDefeat: 5
  },
  tsunomon: {
    stage: "Baby",
    scanPercentOnDefeat: 5
  },
  tokomon: {
    stage: "Baby",
    scanPercentOnDefeat: 5
  },

  agumon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  gabumon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  patamon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  palmon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  tentomon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  gomamon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  biyomon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },
  veemon: {
    stage: "Rookie",
    scanPercentOnDefeat: 4
  },

  greymon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  garurumon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  angemon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  togemon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  kabuterimon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  ikkakumon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  birdramon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },
  exveemon: {
    stage: "Champion",
    scanPercentOnDefeat: 2
  },

  metalgreymon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  weregarurumon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  holyangemon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  lillymon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  megakabuterimon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  zudomon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  garudamon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  },
  aeroveedramon: {
    stage: "Ultimate",
    scanPercentOnDefeat: 1
  }
};

/**
 * Retorna as regras de scan de uma espécie.
 *
 * @param {string} speciesId
 * @returns {{stage: string, scanPercentOnDefeat: number}}
 */
export function getScanRule(speciesId) {
  return SCAN_RULES[speciesId] || {
    stage: "Unknown",
    scanPercentOnDefeat: 1
  };
}