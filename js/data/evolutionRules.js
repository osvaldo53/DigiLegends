export const EVOLUTION_RULES = {
  koromon: {
    agumon: { minLevel: 3, minBond: 1 }
  },
  tsunomon: {
    gabumon: { minLevel: 3, minBond: 1 }
  },
  tsumemon: {
    agumon_black: { minLevel: 3, minBond: 1 },
    keramon: { minLevel: 3, minBond: 1 },
    demidevimon: { minLevel: 3, minBond: 1 }
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
  agumon_black: {
    greymon_blue: { minLevel: 10, minBond: 5 }
  },
  gabumon: {
    garurumon: { minLevel: 10, minBond: 5 }
  },
  keramon: {
    chrysalimon: { minLevel: 10, minBond: 5 }
  },
  patamon: {
    angemon: { minLevel: 10, minBond: 8 }
  },
  demidevimon: {
    devimon: { minLevel: 10, minBond: 6 }
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
  greymon_blue: {
    metalgreymon_blue: { minLevel: 22, minBond: 20 }
  },
  garurumon: {
    weregarurumon: { minLevel: 22, minBond: 20 }
  },
  devimon: {
    myotismon: { minLevel: 24, minBond: 22 }
  },
  angemon: {
    holyangemon: { minLevel: 24, minBond: 25 }
  },
  chrysalimon: {
    infermon: { minLevel: 22, minBond: 18 }
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
  metalgreymon_blue: {
    blackwargreymon: { minLevel: 34, minBond: 35 }
  },
  weregarurumon: {
    metalgarurumon: { minLevel: 34, minBond: 35 }
  },
  myotismon: {
    venommyotismon: { minLevel: 36, minBond: 38 }
  },
  holyangemon: {
    seraphimon: { minLevel: 36, minBond: 40 }
  },
  infermon: {
    diaboromon: { minLevel: 36, minBond: 34 }
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
