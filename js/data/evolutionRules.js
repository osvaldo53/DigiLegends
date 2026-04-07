export const EVOLUTION_RULES = {
  koromon: {
    agumon: { minLevel: 3, minBond: 1 }
  },
  tsunomon: {
    gabumon: { minLevel: 3, minBond: 1 }
  },
  tokomon: {
    patamon: { minLevel: 3, minBond: 1 }
  },
  tanemon: {
    palmon: { minLevel: 3, minBond: 1 }
  },
  motimon: {
    tentomon: { minLevel: 3, minBond: 1 }
  },
  bukamon: {
    gomamon: { minLevel: 3, minBond: 1 }
  },
  yokomon: {
    biyomon: { minLevel: 3, minBond: 1 }
  },
  demiveemon: {
    veemon: { minLevel: 3, minBond: 1 }
  },

  agumon: {
    greymon: { minLevel: 10, minBond: 5 }
  },
  gabumon: {
    garurumon: { minLevel: 10, minBond: 5 }
  },
  patamon: {
    angemon: { minLevel: 10, minBond: 8 }
  },
  palmon: {
    togemon: { minLevel: 10, minBond: 5 }
  },
  tentomon: {
    kabuterimon: { minLevel: 10, minBond: 5 }
  },
  gomamon: {
    ikkakumon: { minLevel: 10, minBond: 5 }
  },
  biyomon: {
    birdramon: { minLevel: 10, minBond: 5 }
  },
  veemon: {
    exveemon: { minLevel: 10, minBond: 6 }
  },

  greymon: {
    metalgreymon: { minLevel: 22, minBond: 20 }
  },
  garurumon: {
    weregarurumon: { minLevel: 22, minBond: 20 }
  },
  angemon: {
    holyangemon: { minLevel: 24, minBond: 25 }
  },
  togemon: {
    lillymon: { minLevel: 22, minBond: 18 }
  },
  kabuterimon: {
    megakabuterimon: { minLevel: 22, minBond: 18 }
  },
  ikkakumon: {
    zudomon: { minLevel: 22, minBond: 18 }
  },
  birdramon: {
    garudamon: { minLevel: 22, minBond: 18 }
  },
  exveemon: {
    aeroveedramon: { minLevel: 22, minBond: 18 }
  },

  metalgreymon: {
    wargreymon: { minLevel: 34, minBond: 35 }
  },
  weregarurumon: {
    metalgarurumon: { minLevel: 34, minBond: 35 }
  },
  holyangemon: {
    seraphimon: { minLevel: 36, minBond: 40 }
  },
  lillymon: {
    rosemon: { minLevel: 34, minBond: 32 }
  },
  megakabuterimon: {
    herculeskabuterimon: { minLevel: 34, minBond: 32 }
  },
  zudomon: {
    vikemon: { minLevel: 34, minBond: 32 }
  },
  garudamon: {
    phoenixmon: { minLevel: 34, minBond: 32 }
  },
  aeroveedramon: {
    ulforceveedramon: { minLevel: 36, minBond: 34 }
  },

  wargreymon: {
    omnimon: {
      type: "dna",
      minLevel: 40,
      minBond: 60,
      partnerSpeciesId: "metalgarurumon",
      partnerMinLevel: 40,
      partnerMinBond: 60
    }
  },
  metalgarurumon: {
    omnimon: {
      type: "dna",
      minLevel: 40,
      minBond: 60,
      partnerSpeciesId: "wargreymon",
      partnerMinLevel: 40,
      partnerMinBond: 60
    }
  }
};

export function getEvolutionRulesForSpecies(speciesId) {
  return EVOLUTION_RULES[speciesId] || {};
}

export function getEvolutionRule(speciesId, targetSpeciesId) {
  return EVOLUTION_RULES[speciesId]?.[targetSpeciesId] || null;
}
