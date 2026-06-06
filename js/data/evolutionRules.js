export const EVOLUTION_RULES = {
  koromon: {
    agumon: { minLevel: 3 },
    dracomon: { minLevel: 3 },
    guilmon: { minLevel: 3 }
  },
  tsunomon: {
    gabumon: { minLevel: 3 }
  },
  tsumemon: {
    agumon_black: { minLevel: 3 },
    keramon: { minLevel: 3 },
    demidevimon: { minLevel: 3 }
  },
  tokomon: {
    patamon: { minLevel: 3 }
  },
  tanemon: {
    palmon: { minLevel: 3 }
  },
  motimon: {
    tentomon: { minLevel: 3 }
  },
  kapurimon: {
    hagurumon: { minLevel: 3 }
  },
  bukamon: {
    gomamon: { minLevel: 3 }
  },
  yokomon: {
    biyomon: { minLevel: 3 },
    wormmon: { minLevel: 3 },
    elecmon: { minLevel: 3 }
  },
  demiveemon: {
    veemon: { minLevel: 3 }
  },
  wanyamon: {
    dorumon: { minLevel: 3 },
    gaomon: { minLevel: 3 },
    kudamon: { minLevel: 3 }
  },
  nyaromon: {
    terriermon: { minLevel: 3 },
    salamon: { minLevel: 3 }
  },
  pagumon: {
    impmon: { minLevel: 3 }
  },

  agumon: {
    greymon: { minLevel: 10 },
    geogreymon: { minLevel: 10 }
  },
  agumon_black: {
    greymon_blue: { minLevel: 10 }
  },
  gabumon: {
    garurumon: { minLevel: 10 }
  },
  keramon: {
    chrysalimon: { minLevel: 10 }
  },
  patamon: {
    angemon: { minLevel: 10 },
    pegasusmon: {
      type: "armor",
      minLevel: 10,
      requiredItemId: "digi_egg_hope"
    }
  },
  demidevimon: {
    devimon: { minLevel: 10 }
  },
  palmon: {
    togemon: { minLevel: 10 }
  },
  tentomon: {
    kabuterimon: { minLevel: 10 }
  },
  gomamon: {
    ikkakumon: { minLevel: 10 }
  },
  biyomon: {
    birdramon: { minLevel: 10 }
  },
  veemon: {
    exveemon: { minLevel: 10 },
    flamedramon: {
      type: "armor",
      minLevel: 10,
      requiredItemId: "digi_egg_courage"
    },
    lighdramon: {
      type: "armor",
      minLevel: 10,
      requiredItemId: "digi_egg_friendship"
    }
  },
  hagurumon: {
    guardromon: { minLevel: 10 }
  },
  wormmon: {
    stingmon: { minLevel: 10 }
  },
  guilmon: {
    growlmon: { minLevel: 10 },
    tyrannomon: { minLevel: 10 }
  },
  kudamon: {
    reppamon: { minLevel: 10 }
  },
  dorumon: {
    raptordramon: { minLevel: 10 }
  },
  dracomon: {
    ginryumon: { minLevel: 10 },
    coredramon_blue: { minLevel: 10 },
    coredramon_green: { minLevel: 10 }
  },
  gaomon: {
    gaogamon: { minLevel: 10 }
  },
  terriermon: {
    gargomon: { minLevel: 10 }
  },
  salamon: {
    gatomon: { minLevel: 10 }
  },
  elecmon: {
    leomon: { minLevel: 10 }
  },
  impmon: {
    icedevimon: { minLevel: 10 },
    blackgatomon: { minLevel: 10 }
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
    aeroveedramon: { minLevel: 22, minBond: 18 },
    paildramon: {
      type: "dna",
      minLevel: 24,
      minBond: 24,
      partnerSpeciesId: "stingmon",
      partnerMinLevel: 24,
      partnerMinBond: 24
    }
  },
  guardromon: {
    andromon: { minLevel: 22, minBond: 18 }
  },
  stingmon: {
    paildramon: {
      type: "dna",
      minLevel: 24,
      minBond: 24,
      partnerSpeciesId: "exveemon",
      partnerMinLevel: 24,
      partnerMinBond: 24
    }
  },
  raptordramon: {
    grademon: { minLevel: 22, minBond: 18 }
  },
  ginryumon: {
    hisyaryumon: { minLevel: 22, minBond: 18 }
  },
  growlmon: {
    wargrowlmon: { minLevel: 22, minBond: 20 },
    gigadramon: { minLevel: 22, minBond: 20 }
  },
  tyrannomon: {
    metaltyrannomon: { minLevel: 22, minBond: 18 }
  },
  geogreymon: {
    rizegreymon: { minLevel: 22, minBond: 20 }
  },
  gaogamon: {
    machgaogamon: { minLevel: 22, minBond: 18 }
  },
  reppamon: {
    chirinmon: { minLevel: 24, minBond: 22 }
  },
  coredramon_blue: {
    wingdramon: { minLevel: 22, minBond: 18 }
  },
  coredramon_green: {
    groundramon: { minLevel: 22, minBond: 18 }
  },
  gargomon: {
    rapidmon: { minLevel: 22, minBond: 18 }
  },
  gatomon: {
    angewomon: { minLevel: 24, minBond: 24 }
  },
  leomon: {
    grapleomon: { minLevel: 22, minBond: 18 }
  },
  icedevimon: {
    skullsatamon: { minLevel: 24, minBond: 22 }
  },
  blackgatomon: {
    ladydevimon: { minLevel: 24, minBond: 22 }
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
  andromon: {
    craniamon: { minLevel: 36, minBond: 34 }
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
  paildramon: {
    imperialdramon_dm: { minLevel: 34, minBond: 32 }
  },
  aeroveedramon: {
    ulforceveedramon: { minLevel: 36, minBond: 34 }
  },
  grademon: {
    alphamon: { minLevel: 36, minBond: 34 }
  },
  hisyaryumon: {
    ouryumon: { minLevel: 36, minBond: 34 }
  },
  wargrowlmon: {
    gallantmon: { minLevel: 36, minBond: 36 }
  },
  metaltyrannomon: {
    rusttyrannomon: { minLevel: 34, minBond: 32 }
  },
  rizegreymon: {
    shinegreymon: { minLevel: 36, minBond: 36 }
  },
  machgaogamon: {
    miragegaogamon: { minLevel: 34, minBond: 32 }
  },
  wingdramon: {
    slayerdramon: { minLevel: 36, minBond: 34 }
  },
  groundramon: {
    brakedramon: { minLevel: 34, minBond: 32 }
  },
  rapidmon: {
    megagargomon: { minLevel: 34, minBond: 32 }
  },
  angewomon: {
    ophanimon: { minLevel: 36, minBond: 40 },
    magnadramon: { minLevel: 36, minBond: 38 },
    mastemon: {
      type: "dna",
      minLevel: 40,
      minBond: 40,
      partnerSpeciesId: "ladydevimon",
      partnerMinLevel: 40,
      partnerMinBond: 40
    }
  },
  grapleomon: {
    saberleomon: { minLevel: 34, minBond: 32 },
    bancholeomon: { minLevel: 36, minBond: 36 }
  },
  gigadramon: {
    machinedramon: { minLevel: 36, minBond: 34 }
  },
  skullsatamon: {
    beelzemon: { minLevel: 36, minBond: 38 }
  },
  ladydevimon: {
    lilithmon: { minLevel: 36, minBond: 38 },
    mastemon: {
      type: "dna",
      minLevel: 40,
      minBond: 40,
      partnerSpeciesId: "angewomon",
      partnerMinLevel: 40,
      partnerMinBond: 40
    }
  },
  imperialdramon_dm: {
    imperialdramon_fm: { minLevel: 40, minBond: 40 }
  },
  imperialdramon_fm: {
    imperialdramon_pm: {
      type: "armor",
      minLevel: 45,
      minBond: 55,
      requiredItemId: "omni_sword"
    }
  },
  machinedramon: {
    chaosdramon: {
      type: "armor",
      minLevel: 45,
      minBond: 45,
      requiredItemId: "chaos_digicore"
    }
  },
  beelzemon: {
    beelzemon_bm: {
      type: "armor",
      minLevel: 45,
      minBond: 45,
      requiredItemId: "toy_gun"
    }
  },
  chirinmon: {
    sleipmon: { minLevel: 36, minBond: 38 }
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
  alphamon: {
    alphamon_ouryuken: {
      type: "dna",
      minLevel: 45,
      minBond: 45,
      partnerSpeciesId: "ouryumon",
      partnerMinLevel: 45,
      partnerMinBond: 45
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
  },
  ouryumon: {
    alphamon_ouryuken: {
      type: "dna",
      minLevel: 45,
      minBond: 45,
      partnerSpeciesId: "alphamon",
      partnerMinLevel: 45,
      partnerMinBond: 45
    }
  }
};

export function getEvolutionRulesForSpecies(speciesId) {
  return EVOLUTION_RULES[speciesId] || {};
}

export function getEvolutionRule(speciesId, targetSpeciesId) {
  return EVOLUTION_RULES[speciesId]?.[targetSpeciesId] || null;
}
