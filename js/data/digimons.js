export const DIGIMONS = {
  koromon: {
    id: "koromon",
    name: "Koromon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: { hp: 24, sp: 10, atk: 5, def: 4, int: 4, spd: 5 },
    evolutions: ["agumon"],
    sprite: "./assets/sprites/koromon.png"
  },

  agumon: {
    id: "agumon",
    name: "Agumon",
    type: "Vaccine",
    element: "Fire",
    family: "Reptile",
    baseStats: { hp: 42, sp: 16, atk: 12, def: 8, int: 7, spd: 9 },
    evolutions: ["greymon"],
    sprite: "./assets/sprites/agumon.png"
  },

  agumon_black: {
    id: "agumon_black",
    name: "Agumon (Black)",
    type: "Virus",
    element: "Fire",
    family: "Reptile",
    baseStats: { hp: 43, sp: 15, atk: 13, def: 8, int: 7, spd: 8 },
    evolutions: ["greymon_blue"],
    sprite: "./assets/sprites/agumon_black.png"
  },

  tsunomon: {
    id: "tsunomon",
    name: "Tsunomon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: { hp: 24, sp: 11, atk: 4, def: 4, int: 5, spd: 5 },
    evolutions: ["gabumon"],
    sprite: "./assets/sprites/tsunomon.png"
  },

  tsumemon: {
    id: "tsumemon",
    name: "Tsumemon",
    type: "Free",
    element: "Dark",
    family: "Lesser",
    baseStats: { hp: 25, sp: 11, atk: 5, def: 4, int: 5, spd: 5 },
    evolutions: ["agumon_black", "keramon", "demidevimon"],
    sprite: "./assets/sprites/tsumemon.png"
  },

  gabumon: {
    id: "gabumon",
    name: "Gabumon",
    type: "Data",
    element: "Water",
    family: "Reptile",
    baseStats: { hp: 40, sp: 18, atk: 10, def: 8, int: 9, spd: 8 },
    evolutions: ["garurumon"],
    sprite: "./assets/sprites/gabumon.png"
  },

  keramon: {
    id: "keramon",
    name: "Keramon",
    type: "Virus",
    element: "Dark",
    family: "Nightmare Soldier",
    baseStats: { hp: 39, sp: 20, atk: 9, def: 7, int: 11, spd: 9 },
    evolutions: ["chrysalimon"],
    sprite: "./assets/sprites/keramon.png"
  },

  tokomon: {
    id: "tokomon",
    name: "Tokomon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: { hp: 22, sp: 12, atk: 4, def: 4, int: 6, spd: 5 },
    evolutions: ["patamon"],
    sprite: "./assets/sprites/tokomon.png"
  },

  patamon: {
    id: "patamon",
    name: "Patamon",
    type: "Data",
    element: "Wind",
    family: "Mammal",
    baseStats: { hp: 38, sp: 20, atk: 8, def: 8, int: 10, spd: 9 },
    evolutions: ["angemon"],
    sprite: "./assets/sprites/patamon.png"
  },

  demidevimon: {
    id: "demidevimon",
    name: "DemiDevimon",
    type: "Virus",
    element: "Dark",
    family: "Dark Animal",
    baseStats: { hp: 37, sp: 21, atk: 8, def: 7, int: 11, spd: 10 },
    evolutions: ["devimon"],
    sprite: "./assets/sprites/demidevimon.png"
  },

  tanemon: {
    id: "tanemon",
    name: "Tanemon",
    type: "Free",
    element: "Plant",
    family: "Lesser",
    baseStats: { hp: 23, sp: 11, atk: 4, def: 4, int: 5, spd: 5 },
    evolutions: ["palmon"],
    sprite: "./assets/sprites/tanemon.png"
  },

  palmon: {
    id: "palmon",
    name: "Palmon",
    type: "Data",
    element: "Plant",
    family: "Vegetation",
    baseStats: { hp: 39, sp: 19, atk: 8, def: 8, int: 11, spd: 8 },
    evolutions: ["togemon"],
    sprite: "./assets/sprites/palmon.png"
  },

  motimon: {
    id: "motimon",
    name: "Motimon",
    type: "Free",
    element: "Electric",
    family: "Lesser",
    baseStats: { hp: 23, sp: 12, atk: 4, def: 4, int: 5, spd: 5 },
    evolutions: ["tentomon"],
    sprite: "./assets/sprites/motimon.png"
  },

  tentomon: {
    id: "tentomon",
    name: "Tentomon",
    type: "Vaccine",
    element: "Electric",
    family: "Insect",
    baseStats: { hp: 40, sp: 18, atk: 9, def: 8, int: 10, spd: 9 },
    evolutions: ["kabuterimon"],
    sprite: "./assets/sprites/tentomon.png"
  },

  bukamon: {
    id: "bukamon",
    name: "Bukamon",
    type: "Free",
    element: "Water",
    family: "Lesser",
    baseStats: { hp: 24, sp: 11, atk: 4, def: 4, int: 5, spd: 5 },
    evolutions: ["gomamon"],
    sprite: "./assets/sprites/bukamon.png"
  },

  gomamon: {
    id: "gomamon",
    name: "Gomamon",
    type: "Vaccine",
    element: "Water",
    family: "Sea Beast",
    baseStats: { hp: 41, sp: 17, atk: 10, def: 8, int: 9, spd: 8 },
    evolutions: ["ikkakumon"],
    sprite: "./assets/sprites/gomamon.png"
  },

  yokomon: {
    id: "yokomon",
    name: "Yokomon",
    type: "Free",
    element: "Fire",
    family: "Lesser",
    baseStats: { hp: 23, sp: 11, atk: 4, def: 4, int: 5, spd: 6 },
    evolutions: ["biyomon"],
    sprite: "./assets/sprites/yokomon.png"
  },

  biyomon: {
    id: "biyomon",
    name: "Biyomon",
    type: "Vaccine",
    element: "Fire",
    family: "Bird",
    baseStats: { hp: 38, sp: 19, atk: 9, def: 7, int: 10, spd: 10 },
    evolutions: ["birdramon"],
    sprite: "./assets/sprites/biyomon.png"
  },

  demiveemon: {
    id: "demiveemon",
    name: "DemiVeemon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: { hp: 24, sp: 10, atk: 5, def: 4, int: 4, spd: 6 },
    evolutions: ["veemon"],
    sprite: "./assets/sprites/demiveemon.png"
  },

  veemon: {
    id: "veemon",
    name: "Veemon",
    type: "Free",
    element: "Neutral",
    family: "Dragon Man",
    baseStats: { hp: 43, sp: 15, atk: 12, def: 8, int: 7, spd: 10 },
    evolutions: ["exveemon"],
    sprite: "./assets/sprites/veemon.png"
  },

  greymon: {
    id: "greymon",
    name: "Greymon",
    type: "Vaccine",
    element: "Fire",
    family: "Dinosaur",
    baseStats: { hp: 68, sp: 24, atk: 20, def: 13, int: 10, spd: 10 },
    evolutions: ["metalgreymon"],
    sprite: "./assets/sprites/greymon.png"
  },

  greymon_blue: {
    id: "greymon_blue",
    name: "Greymon (Blue)",
    type: "Virus",
    element: "Fire",
    family: "Dinosaur",
    baseStats: { hp: 69, sp: 23, atk: 21, def: 13, int: 10, spd: 10 },
    evolutions: ["metalgreymon_blue"],
    sprite: "./assets/sprites/greymon_blue.png"
  },

  garurumon: {
    id: "garurumon",
    name: "Garurumon",
    type: "Data",
    element: "Water",
    family: "Beast",
    baseStats: { hp: 62, sp: 28, atk: 17, def: 12, int: 14, spd: 12 },
    evolutions: ["weregarurumon"],
    sprite: "./assets/sprites/garurumon.png"
  },

  angemon: {
    id: "angemon",
    name: "Angemon",
    type: "Vaccine",
    element: "Light",
    family: "Angel",
    baseStats: { hp: 58, sp: 30, atk: 15, def: 12, int: 16, spd: 11 },
    evolutions: ["holyangemon"],
    sprite: "./assets/sprites/angemon.png"
  },

  devimon: {
    id: "devimon",
    name: "Devimon",
    type: "Virus",
    element: "Dark",
    family: "Fallen Angel",
    baseStats: { hp: 56, sp: 30, atk: 16, def: 11, int: 17, spd: 11 },
    evolutions: ["myotismon"],
    sprite: "./assets/sprites/devimon.png"
  },

  togemon: {
    id: "togemon",
    name: "Togemon",
    type: "Data",
    element: "Plant",
    family: "Vegetation",
    baseStats: { hp: 63, sp: 26, atk: 16, def: 14, int: 13, spd: 9 },
    evolutions: ["lillymon"],
    sprite: "./assets/sprites/togemon.png"
  },

  kabuterimon: {
    id: "kabuterimon",
    name: "Kabuterimon",
    type: "Vaccine",
    element: "Electric",
    family: "Insect",
    baseStats: { hp: 64, sp: 28, atk: 15, def: 13, int: 16, spd: 10 },
    evolutions: ["megakabuterimon"],
    sprite: "./assets/sprites/kabuterimon.png"
  },

  ikkakumon: {
    id: "ikkakumon",
    name: "Ikkakumon",
    type: "Vaccine",
    element: "Water",
    family: "Sea Beast",
    baseStats: { hp: 67, sp: 24, atk: 18, def: 13, int: 11, spd: 9 },
    evolutions: ["zudomon"],
    sprite: "./assets/sprites/ikkakumon.png"
  },

  birdramon: {
    id: "birdramon",
    name: "Birdramon",
    type: "Vaccine",
    element: "Fire",
    family: "Bird",
    baseStats: { hp: 60, sp: 27, atk: 14, def: 11, int: 15, spd: 12 },
    evolutions: ["garudamon"],
    sprite: "./assets/sprites/birdramon.png"
  },

  exveemon: {
    id: "exveemon",
    name: "ExVeemon",
    type: "Free",
    element: "Neutral",
    family: "Dragon Man",
    baseStats: { hp: 69, sp: 23, atk: 20, def: 12, int: 10, spd: 12 },
    evolutions: ["aeroveedramon"],
    sprite: "./assets/sprites/exveemon.png"
  },

  chrysalimon: {
    id: "chrysalimon",
    name: "Chrysalimon",
    type: "Virus",
    element: "Dark",
    family: "Unidentified",
    baseStats: { hp: 66, sp: 27, atk: 18, def: 13, int: 14, spd: 10 },
    evolutions: ["infermon"],
    sprite: "./assets/sprites/chrysalimon.png"
  },

  metalgreymon: {
    id: "metalgreymon",
    name: "MetalGreymon",
    type: "Vaccine",
    element: "Fire",
    family: "Cyborg",
    baseStats: { hp: 94, sp: 36, atk: 28, def: 18, int: 16, spd: 13 },
    evolutions: ["wargreymon"],
    sprite: "./assets/sprites/metalgreymon.png"
  },

  metalgreymon_blue: {
    id: "metalgreymon_blue",
    name: "MetalGreymon (Blue)",
    type: "Virus",
    element: "Fire",
    family: "Cyborg",
    baseStats: { hp: 95, sp: 35, atk: 29, def: 18, int: 16, spd: 13 },
    evolutions: ["blackwargreymon"],
    sprite: "./assets/sprites/metalgreymon_blue.png"
  },

  weregarurumon: {
    id: "weregarurumon",
    name: "WereGarurumon",
    type: "Data",
    element: "Water",
    family: "Beast Man",
    baseStats: { hp: 88, sp: 36, atk: 26, def: 17, int: 17, spd: 15 },
    evolutions: ["metalgarurumon"],
    sprite: "./assets/sprites/weregarurumon.png"
  },

  holyangemon: {
    id: "holyangemon",
    name: "HolyAngemon",
    type: "Vaccine",
    element: "Light",
    family: "Archangel",
    baseStats: { hp: 84, sp: 40, atk: 22, def: 17, int: 20, spd: 14 },
    evolutions: ["seraphimon"],
    sprite: "./assets/sprites/holyangemon.png"
  },

  myotismon: {
    id: "myotismon",
    name: "Myotismon",
    type: "Virus",
    element: "Dark",
    family: "Dark Animal",
    baseStats: { hp: 82, sp: 39, atk: 21, def: 16, int: 23, spd: 14 },
    evolutions: ["venommyotismon"],
    sprite: "./assets/sprites/myotismon.png"
  },

  lillymon: {
    id: "lillymon",
    name: "Lillymon",
    type: "Data",
    element: "Plant",
    family: "Fairy",
    baseStats: { hp: 86, sp: 38, atk: 16, def: 17, int: 24, spd: 15 },
    evolutions: ["rosemon"],
    sprite: "./assets/sprites/lillymon.png"
  },

  megakabuterimon: {
    id: "megakabuterimon",
    name: "MegaKabuterimon",
    type: "Vaccine",
    element: "Electric",
    family: "Insect",
    baseStats: { hp: 90, sp: 38, atk: 20, def: 18, int: 24, spd: 13 },
    evolutions: ["herculeskabuterimon"],
    sprite: "./assets/sprites/megakabuterimon.png"
  },

  zudomon: {
    id: "zudomon",
    name: "Zudomon",
    type: "Vaccine",
    element: "Water",
    family: "Sea Beast",
    baseStats: { hp: 96, sp: 30, atk: 27, def: 20, int: 15, spd: 11 },
    evolutions: ["vikemon"],
    sprite: "./assets/sprites/zudomon.png"
  },

  garudamon: {
    id: "garudamon",
    name: "Garudamon",
    type: "Vaccine",
    element: "Fire",
    family: "Bird",
    baseStats: { hp: 84, sp: 36, atk: 20, def: 16, int: 22, spd: 15 },
    evolutions: ["phoenixmon"],
    sprite: "./assets/sprites/garudamon.png"
  },

  aeroveedramon: {
    id: "aeroveedramon",
    name: "AeroVeedramon",
    type: "Free",
    element: "Wind",
    family: "Dragon Man",
    baseStats: { hp: 88, sp: 30, atk: 26, def: 16, int: 18, spd: 17 },
    evolutions: ["ulforceveedramon"],
    sprite: "./assets/sprites/aeroveedramon.png"
  },

  infermon: {
    id: "infermon",
    name: "Infermon",
    type: "Virus",
    element: "Dark",
    family: "Unidentified",
    baseStats: { hp: 92, sp: 35, atk: 25, def: 17, int: 19, spd: 15 },
    evolutions: ["diaboromon"],
    sprite: "./assets/sprites/infermon.png"
  },

  wargreymon: {
    id: "wargreymon",
    name: "WarGreymon",
    type: "Vaccine",
    element: "Fire",
    family: "Dragon Man",
    baseStats: { hp: 122, sp: 46, atk: 36, def: 25, int: 24, spd: 18 },
    evolutions: ["omnimon"],
    sprite: "./assets/sprites/wargreymon.png"
  },

  blackwargreymon: {
    id: "blackwargreymon",
    name: "BlackWarGreymon",
    type: "Virus",
    element: "Fire",
    family: "Dragon Man",
    baseStats: { hp: 124, sp: 44, atk: 38, def: 25, int: 23, spd: 18 },
    evolutions: [],
    sprite: "./assets/sprites/blackwargreymon.png"
  },

  metalgarurumon: {
    id: "metalgarurumon",
    name: "MetalGarurumon",
    type: "Data",
    element: "Water",
    family: "Machine",
    baseStats: { hp: 118, sp: 48, atk: 32, def: 24, int: 30, spd: 20 },
    evolutions: ["omnimon"],
    sprite: "./assets/sprites/metalgarurumon.png"
  },

  omnimon: {
    id: "omnimon",
    name: "Omnimon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Warrior",
    baseStats: { hp: 138, sp: 56, atk: 40, def: 30, int: 34, spd: 24 },
    evolutions: [],
    sprite: "./assets/sprites/omnimon.png"
  },

  diaboromon: {
    id: "diaboromon",
    name: "Diaboromon",
    type: "Virus",
    element: "Dark",
    family: "Unidentified",
    baseStats: { hp: 120, sp: 50, atk: 30, def: 23, int: 36, spd: 21 },
    evolutions: [],
    sprite: "./assets/sprites/diaboromon.png"
  },

  seraphimon: {
    id: "seraphimon",
    name: "Seraphimon",
    type: "Vaccine",
    element: "Light",
    family: "Angel",
    baseStats: { hp: 116, sp: 52, atk: 30, def: 24, int: 34, spd: 18 },
    evolutions: [],
    sprite: "./assets/sprites/seraphimon.png"
  },

  venommyotismon: {
    id: "venommyotismon",
    name: "VenomMyotismon",
    type: "Virus",
    element: "Dark",
    family: "Dark Animal",
    baseStats: { hp: 132, sp: 44, atk: 37, def: 27, int: 26, spd: 16 },
    evolutions: [],
    sprite: "./assets/sprites/venommyotismon.png"
  },

  rosemon: {
    id: "rosemon",
    name: "Rosemon",
    type: "Data",
    element: "Plant",
    family: "Fairy",
    baseStats: { hp: 112, sp: 50, atk: 24, def: 24, int: 35, spd: 19 },
    evolutions: [],
    sprite: "./assets/sprites/rosemon.png"
  },

  herculeskabuterimon: {
    id: "herculeskabuterimon",
    name: "HerculesKabuterimon",
    type: "Vaccine",
    element: "Electric",
    family: "Insect",
    baseStats: { hp: 120, sp: 48, atk: 28, def: 26, int: 35, spd: 17 },
    evolutions: [],
    sprite: "./assets/sprites/herculeskabuterimon.png"
  },

  vikemon: {
    id: "vikemon",
    name: "Vikemon",
    type: "Vaccine",
    element: "Water",
    family: "Beast Man",
    baseStats: { hp: 126, sp: 42, atk: 35, def: 28, int: 22, spd: 16 },
    evolutions: [],
    sprite: "./assets/sprites/vikemon.png"
  },

  phoenixmon: {
    id: "phoenixmon",
    name: "Phoenixmon",
    type: "Vaccine",
    element: "Fire",
    family: "Holy Beast",
    baseStats: { hp: 114, sp: 50, atk: 28, def: 23, int: 35, spd: 20 },
    evolutions: [],
    sprite: "./assets/sprites/phoenixmon.png"
  },

  ulforceveedramon: {
    id: "ulforceveedramon",
    name: "UlforceVeedramon",
    type: "Free",
    element: "Wind",
    family: "Holy Warrior",
    baseStats: { hp: 116, sp: 46, atk: 34, def: 24, int: 27, spd: 24 },
    evolutions: [],
    sprite: "./assets/sprites/ulforceveedramon.png"
  }
};

export const STARTER_IDS = ["agumon", "gabumon", "patamon"];

export function getDigimonSpecies(speciesId) {
  return DIGIMONS[speciesId] || null;
}

export function getAllDigimonSpecies() {
  return Object.values(DIGIMONS);
}
