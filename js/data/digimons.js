export const DIGIMONS = {
  koromon: {
    id: "koromon",
    name: "Koromon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: { hp: 24, sp: 10, atk: 5, def: 4, int: 4, spd: 5 },
    evolutions: ["agumon", "dracomon", "guilmon"],
    sprite: "./assets/sprites/koromon.png"
  },

  agumon: {
    id: "agumon",
    name: "Agumon",
    type: "Vaccine",
    element: "Fire",
    family: "Reptile",
    baseStats: { hp: 42, sp: 16, atk: 12, def: 8, int: 7, spd: 9 },
    evolutions: ["greymon", "geogreymon"],
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
    evolutions: ["angemon", "pegasusmon"],
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

  kapurimon: {
    id: "kapurimon",
    name: "Kapurimon",
    type: "Free",
    element: "Electric",
    family: "Lesser",
    baseStats: { hp: 23, sp: 12, atk: 4, def: 5, int: 5, spd: 5 },
    evolutions: ["hagurumon"],
    sprite: "./assets/sprites/kapurimon.png"
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
    evolutions: ["biyomon", "wormmon", "elecmon"],
    sprite: "./assets/sprites/yokomon.png"
  },

  wormmon: {
    id: "wormmon",
    name: "Wormmon",
    type: "Free",
    element: "Plant",
    family: "Insect",
    baseStats: { hp: 39, sp: 18, atk: 8, def: 8, int: 10, spd: 9 },
    evolutions: ["stingmon"],
    sprite: "./assets/sprites/wormmon.png"
  },

  dorumon: {
    id: "dorumon",
    name: "Dorumon",
    type: "Data",
    element: "Dark",
    family: "Dragonkin",
    baseStats: { hp: 41, sp: 18, atk: 11, def: 8, int: 8, spd: 10 },
    evolutions: ["raptordramon"],
    sprite: "./assets/sprites/dorumon.png"
  },

  dracomon: {
    id: "dracomon",
    name: "Dracomon",
    type: "Data",
    element: "Neutral",
    family: "Dragon",
    baseStats: { hp: 43, sp: 16, atk: 12, def: 8, int: 7, spd: 9 },
    evolutions: ["ginryumon", "coredramon_blue", "coredramon_green"],
    sprite: "./assets/sprites/dracomon.png"
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

  wanyamon: {
    id: "wanyamon",
    name: "Wanyamon",
    type: "Free",
    element: "Dark",
    family: "Lesser",
    baseStats: { hp: 23, sp: 12, atk: 4, def: 4, int: 5, spd: 6 },
    evolutions: ["dorumon", "gaomon"],
    sprite: "./assets/sprites/wanyamon.png"
  },

  veemon: {
    id: "veemon",
    name: "Veemon",
    type: "Free",
    element: "Neutral",
    family: "Dragon Man",
    baseStats: { hp: 43, sp: 15, atk: 12, def: 8, int: 7, spd: 10 },
    evolutions: ["exveemon", "flamedramon", "lighdramon"],
    sprite: "./assets/sprites/veemon.png"
  },

  hagurumon: {
    id: "hagurumon",
    name: "Hagurumon",
    type: "Virus",
    element: "Electric",
    family: "Machine",
    baseStats: { hp: 41, sp: 18, atk: 9, def: 10, int: 9, spd: 7 },
    evolutions: ["guardromon"],
    sprite: "./assets/sprites/hagurumon.png"
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
    evolutions: ["aeroveedramon", "paildramon"],
    sprite: "./assets/sprites/exveemon.png"
  },

  stingmon: {
    id: "stingmon",
    name: "Stingmon",
    type: "Free",
    element: "Plant",
    family: "Insect",
    baseStats: { hp: 64, sp: 26, atk: 18, def: 12, int: 14, spd: 12 },
    evolutions: ["paildramon"],
    sprite: "./assets/sprites/stingmon.png"
  },

  guardromon: {
    id: "guardromon",
    name: "Guardromon",
    type: "Virus",
    element: "Electric",
    family: "Machine",
    baseStats: { hp: 68, sp: 24, atk: 16, def: 17, int: 14, spd: 8 },
    evolutions: ["andromon"],
    sprite: "./assets/sprites/guardromon.png"
  },

  raptordramon: {
    id: "raptordramon",
    name: "Raptordramon",
    type: "Data",
    element: "Dark",
    family: "Dragonkin",
    baseStats: { hp: 66, sp: 26, atk: 18, def: 12, int: 13, spd: 12 },
    evolutions: ["grademon"],
    sprite: "./assets/sprites/raptordramon.png"
  },

  ginryumon: {
    id: "ginryumon",
    name: "Ginryumon",
    type: "Data",
    element: "Neutral",
    family: "Dragonkin",
    baseStats: { hp: 68, sp: 24, atk: 19, def: 13, int: 11, spd: 11 },
    evolutions: ["hisyaryumon"],
    sprite: "./assets/sprites/ginryumon.png"
  },

  flamedramon: {
    id: "flamedramon",
    name: "Flamedramon",
    type: "Free",
    element: "Fire",
    family: "Dragonkin",
    baseStats: { hp: 66, sp: 24, atk: 19, def: 12, int: 13, spd: 12 },
    evolutions: [],
    sprite: "./assets/sprites/flamedramon.png"
  },

  lighdramon: {
    id: "lighdramon",
    name: "Lighdramon",
    type: "Free",
    element: "Electric",
    family: "Holy Beast",
    baseStats: { hp: 65, sp: 25, atk: 18, def: 12, int: 14, spd: 13 },
    evolutions: [],
    sprite: "./assets/sprites/lighdramon.png"
  },

  pegasusmon: {
    id: "pegasusmon",
    name: "Pegasusmon",
    type: "Free",
    element: "Light",
    family: "Holy Beast",
    baseStats: { hp: 62, sp: 28, atk: 15, def: 12, int: 17, spd: 12 },
    evolutions: [],
    sprite: "./assets/sprites/pegasusmon.png"
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

  paildramon: {
    id: "paildramon",
    name: "Paildramon",
    type: "Free",
    element: "Neutral",
    family: "Dragonkin",
    baseStats: { hp: 92, sp: 35, atk: 27, def: 17, int: 18, spd: 16 },
    evolutions: ["imperialdramon_dm"],
    sprite: "./assets/sprites/paildramon.png"
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

  grademon: {
    id: "grademon",
    name: "Grademon",
    type: "Data",
    element: "Light",
    family: "Holy Warrior",
    baseStats: { hp: 90, sp: 34, atk: 27, def: 18, int: 18, spd: 15 },
    evolutions: ["alphamon"],
    sprite: "./assets/sprites/grademon.png"
  },

  hisyaryumon: {
    id: "hisyaryumon",
    name: "Hisyaryumon",
    type: "Data",
    element: "Neutral",
    family: "Holy Dragon",
    baseStats: { hp: 92, sp: 32, atk: 28, def: 18, int: 16, spd: 14 },
    evolutions: ["ouryumon"],
    sprite: "./assets/sprites/hisyaryumon.png"
  },

  andromon: {
    id: "andromon",
    name: "Andromon",
    type: "Vaccine",
    element: "Electric",
    family: "Cyborg",
    baseStats: { hp: 92, sp: 34, atk: 24, def: 22, int: 20, spd: 12 },
    evolutions: ["craniamon"],
    sprite: "./assets/sprites/andromon.png"
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
  },

  imperialdramon_dm: {
    id: "imperialdramon_dm",
    name: "Imperialdramon DM",
    type: "Free",
    element: "Neutral",
    family: "Ancient Dragon",
    baseStats: { hp: 126, sp: 48, atk: 36, def: 24, int: 26, spd: 20 },
    evolutions: ["imperialdramon_fm"],
    sprite: "./assets/sprites/imperialdramon_dm.png"
  },

  imperialdramon_fm: {
    id: "imperialdramon_fm",
    name: "Imperialdramon FM",
    type: "Free",
    element: "Light",
    family: "Ancient Dragon",
    baseStats: { hp: 132, sp: 52, atk: 40, def: 27, int: 30, spd: 22 },
    evolutions: ["imperialdramon_pm"],
    sprite: "./assets/sprites/imperialdramon_fm.png"
  },

  imperialdramon_pm: {
    id: "imperialdramon_pm",
    name: "Imperialdramon PM",
    type: "Free",
    element: "Light",
    family: "Holy Knight",
    baseStats: { hp: 142, sp: 58, atk: 46, def: 30, int: 34, spd: 24 },
    evolutions: [],
    sprite: "./assets/sprites/imperialdramon_pm.png"
  },

  craniamon: {
    id: "craniamon",
    name: "Craniamon",
    type: "Vaccine",
    element: "Dark",
    family: "Holy Warrior",
    baseStats: { hp: 136, sp: 48, atk: 34, def: 32, int: 28, spd: 18 },
    evolutions: [],
    sprite: "./assets/sprites/craniamon.png"
  },

  alphamon: {
    id: "alphamon",
    name: "Alphamon",
    type: "Vaccine",
    element: "Dark",
    family: "Holy Warrior",
    baseStats: { hp: 130, sp: 50, atk: 38, def: 29, int: 31, spd: 20 },
    evolutions: ["alphamon_ouryuken"],
    sprite: "./assets/sprites/alphamon.png"
  },

  ouryumon: {
    id: "ouryumon",
    name: "Ouryumon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Dragon",
    baseStats: { hp: 132, sp: 46, atk: 40, def: 28, int: 27, spd: 18 },
    evolutions: ["alphamon_ouryuken"],
    sprite: "./assets/sprites/ouryumon.png"
  },

  alphamon_ouryuken: {
    id: "alphamon_ouryuken",
    name: "Alphamon Ouryuken",
    type: "Vaccine",
    element: "Light",
    family: "Holy Warrior",
    baseStats: { hp: 148, sp: 58, atk: 48, def: 34, int: 36, spd: 22 },
    evolutions: [],
    sprite: "./assets/sprites/alphamon_ouryuken.png"
  },

  nyaromon: {
    id: "nyaromon",
    name: "Nyaromon",
    type: "Free",
    element: "Light",
    family: "Lesser",
    baseStats: { hp: 23, sp: 12, atk: 4, def: 4, int: 5, spd: 6 },
    evolutions: ["terriermon", "salamon"],
    sprite: "./assets/sprites/nyaromon.png"
  },

  pagumon: {
    id: "pagumon",
    name: "Pagumon",
    type: "Free",
    element: "Dark",
    family: "Lesser",
    baseStats: { hp: 24, sp: 11, atk: 4, def: 4, int: 5, spd: 5 },
    evolutions: ["impmon"],
    sprite: "./assets/sprites/pagumon.png"
  },

  guilmon: {
    id: "guilmon",
    name: "Guilmon",
    type: "Virus",
    element: "Fire",
    family: "Dragon",
    baseStats: { hp: 43, sp: 16, atk: 12, def: 8, int: 7, spd: 9 },
    evolutions: ["growlmon", "tyrannomon"],
    sprite: "./assets/sprites/guilmon.png"
  },

  gaomon: {
    id: "gaomon",
    name: "Gaomon",
    type: "Data",
    element: "Wind",
    family: "Beast",
    baseStats: { hp: 40, sp: 18, atk: 10, def: 8, int: 8, spd: 10 },
    evolutions: ["gaogamon"],
    sprite: "./assets/sprites/gaomon.png"
  },

  terriermon: {
    id: "terriermon",
    name: "Terriermon",
    type: "Vaccine",
    element: "Wind",
    family: "Mammal",
    baseStats: { hp: 39, sp: 19, atk: 8, def: 8, int: 10, spd: 9 },
    evolutions: ["gargomon"],
    sprite: "./assets/sprites/terriermon.png"
  },

  salamon: {
    id: "salamon",
    name: "Salamon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Beast",
    baseStats: { hp: 38, sp: 20, atk: 8, def: 8, int: 10, spd: 9 },
    evolutions: ["gatomon"],
    sprite: "./assets/sprites/salamon.png"
  },

  elecmon: {
    id: "elecmon",
    name: "Elecmon",
    type: "Data",
    element: "Electric",
    family: "Mammal",
    baseStats: { hp: 40, sp: 18, atk: 9, def: 8, int: 9, spd: 9 },
    evolutions: ["leomon"],
    sprite: "./assets/sprites/elecmon.png"
  },

  impmon: {
    id: "impmon",
    name: "Impmon",
    type: "Virus",
    element: "Dark",
    family: "Nightmare Soldier",
    baseStats: { hp: 38, sp: 21, atk: 8, def: 7, int: 11, spd: 10 },
    evolutions: ["icedevimon", "blackgatomon"],
    sprite: "./assets/sprites/impmon.png"
  },

  growlmon: {
    id: "growlmon",
    name: "Growlmon",
    type: "Virus",
    element: "Fire",
    family: "Dragon",
    baseStats: { hp: 69, sp: 24, atk: 20, def: 13, int: 10, spd: 10 },
    evolutions: ["wargrowlmon", "gigadramon"],
    sprite: "./assets/sprites/growlmon.png"
  },

  tyrannomon: {
    id: "tyrannomon",
    name: "Tyrannomon",
    type: "Data",
    element: "Fire",
    family: "Dinosaur",
    baseStats: { hp: 70, sp: 23, atk: 19, def: 13, int: 10, spd: 9 },
    evolutions: ["metaltyrannomon"],
    sprite: "./assets/sprites/tyrannomon.png"
  },

  geogreymon: {
    id: "geogreymon",
    name: "GeoGreymon",
    type: "Vaccine",
    element: "Fire",
    family: "Dinosaur",
    baseStats: { hp: 70, sp: 23, atk: 20, def: 13, int: 10, spd: 10 },
    evolutions: ["rizegreymon"],
    sprite: "./assets/sprites/geogreymon.png"
  },

  gaogamon: {
    id: "gaogamon",
    name: "GaoGamon",
    type: "Data",
    element: "Wind",
    family: "Beast",
    baseStats: { hp: 63, sp: 27, atk: 16, def: 12, int: 14, spd: 12 },
    evolutions: ["machgaogamon"],
    sprite: "./assets/sprites/gaogamon.png"
  },

  coredramon_blue: {
    id: "coredramon_blue",
    name: "Coredramon (Blue)",
    type: "Vaccine",
    element: "Water",
    family: "Dragon",
    baseStats: { hp: 66, sp: 25, atk: 18, def: 12, int: 12, spd: 11 },
    evolutions: ["wingdramon"],
    sprite: "./assets/sprites/coredramon_blue.png"
  },

  coredramon_green: {
    id: "coredramon_green",
    name: "Coredramon (Green)",
    type: "Virus",
    element: "Plant",
    family: "Dragon",
    baseStats: { hp: 68, sp: 24, atk: 19, def: 13, int: 10, spd: 10 },
    evolutions: ["groundramon"],
    sprite: "./assets/sprites/coredramon_green.png"
  },

  gargomon: {
    id: "gargomon",
    name: "Gargomon",
    type: "Vaccine",
    element: "Wind",
    family: "Mammal",
    baseStats: { hp: 62, sp: 27, atk: 15, def: 12, int: 14, spd: 11 },
    evolutions: ["rapidmon"],
    sprite: "./assets/sprites/gargomon.png"
  },

  gatomon: {
    id: "gatomon",
    name: "Gatomon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Beast",
    baseStats: { hp: 58, sp: 29, atk: 14, def: 11, int: 16, spd: 13 },
    evolutions: ["angewomon"],
    sprite: "./assets/sprites/gatomon.png"
  },

  leomon: {
    id: "leomon",
    name: "Leomon",
    type: "Vaccine",
    element: "Neutral",
    family: "Beast Man",
    baseStats: { hp: 64, sp: 25, atk: 17, def: 12, int: 12, spd: 11 },
    evolutions: ["grapleomon"],
    sprite: "./assets/sprites/leomon.png"
  },

  icedevimon: {
    id: "icedevimon",
    name: "IceDevimon",
    type: "Virus",
    element: "Water",
    family: "Fallen Angel",
    baseStats: { hp: 57, sp: 30, atk: 15, def: 11, int: 16, spd: 11 },
    evolutions: ["skullsatamon"],
    sprite: "./assets/sprites/icedevimon.png"
  },

  blackgatomon: {
    id: "blackgatomon",
    name: "BlackGatomon",
    type: "Virus",
    element: "Dark",
    family: "Dark Animal",
    baseStats: { hp: 58, sp: 29, atk: 14, def: 11, int: 16, spd: 13 },
    evolutions: ["ladydevimon"],
    sprite: "./assets/sprites/blackgatomon.png"
  },

  wargrowlmon: {
    id: "wargrowlmon",
    name: "WarGrowlmon",
    type: "Virus",
    element: "Fire",
    family: "Cyborg",
    baseStats: { hp: 95, sp: 34, atk: 29, def: 18, int: 15, spd: 13 },
    evolutions: ["gallantmon"],
    sprite: "./assets/sprites/wargrowlmon.png"
  },

  metaltyrannomon: {
    id: "metaltyrannomon",
    name: "MetalTyrannomon",
    type: "Virus",
    element: "Electric",
    family: "Cyborg",
    baseStats: { hp: 96, sp: 32, atk: 28, def: 19, int: 15, spd: 12 },
    evolutions: ["rusttyrannomon"],
    sprite: "./assets/sprites/metaltyrannomon.png"
  },

  rizegreymon: {
    id: "rizegreymon",
    name: "RizeGreymon",
    type: "Vaccine",
    element: "Fire",
    family: "Cyborg",
    baseStats: { hp: 92, sp: 35, atk: 28, def: 18, int: 17, spd: 14 },
    evolutions: ["shinegreymon"],
    sprite: "./assets/sprites/rizegreymon.png"
  },

  machgaogamon: {
    id: "machgaogamon",
    name: "MachGaogamon",
    type: "Data",
    element: "Wind",
    family: "Beast Man",
    baseStats: { hp: 86, sp: 38, atk: 23, def: 17, int: 20, spd: 16 },
    evolutions: ["miragegaogamon"],
    sprite: "./assets/sprites/machgaogamon.png"
  },

  wingdramon: {
    id: "wingdramon",
    name: "Wingdramon",
    type: "Vaccine",
    element: "Wind",
    family: "Dragon",
    baseStats: { hp: 88, sp: 34, atk: 24, def: 17, int: 18, spd: 16 },
    evolutions: ["slayerdramon"],
    sprite: "./assets/sprites/wingdramon.png"
  },

  groundramon: {
    id: "groundramon",
    name: "Groundramon",
    type: "Virus",
    element: "Plant",
    family: "Dragon",
    baseStats: { hp: 94, sp: 30, atk: 27, def: 19, int: 15, spd: 13 },
    evolutions: ["brakedramon"],
    sprite: "./assets/sprites/groundramon.png"
  },

  rapidmon: {
    id: "rapidmon",
    name: "Rapidmon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Beast",
    baseStats: { hp: 84, sp: 38, atk: 21, def: 17, int: 22, spd: 16 },
    evolutions: ["megagargomon"],
    sprite: "./assets/sprites/rapidmon.png"
  },

  angewomon: {
    id: "angewomon",
    name: "Angewomon",
    type: "Vaccine",
    element: "Light",
    family: "Angel",
    baseStats: { hp: 82, sp: 40, atk: 20, def: 16, int: 24, spd: 15 },
    evolutions: ["ophanimon", "magnadramon"],
    sprite: "./assets/sprites/angewomon.png"
  },

  grapleomon: {
    id: "grapleomon",
    name: "GrapLeomon",
    type: "Vaccine",
    element: "Electric",
    family: "Beast Man",
    baseStats: { hp: 89, sp: 34, atk: 26, def: 18, int: 17, spd: 14 },
    evolutions: ["saberleomon", "bancholeomon"],
    sprite: "./assets/sprites/grapleomon.png"
  },

  gigadramon: {
    id: "gigadramon",
    name: "Gigadramon",
    type: "Virus",
    element: "Fire",
    family: "Machine",
    baseStats: { hp: 94, sp: 35, atk: 27, def: 18, int: 17, spd: 13 },
    evolutions: ["machinedramon"],
    sprite: "./assets/sprites/gigadramon.png"
  },

  skullsatamon: {
    id: "skullsatamon",
    name: "SkullSatamon",
    type: "Virus",
    element: "Dark",
    family: "Dark Animal",
    baseStats: { hp: 84, sp: 40, atk: 20, def: 16, int: 24, spd: 15 },
    evolutions: ["beelzemon"],
    sprite: "./assets/sprites/skullsatamon.png"
  },

  ladydevimon: {
    id: "ladydevimon",
    name: "LadyDevimon",
    type: "Virus",
    element: "Dark",
    family: "Fallen Angel",
    baseStats: { hp: 82, sp: 41, atk: 19, def: 16, int: 25, spd: 15 },
    evolutions: ["lilithmon"],
    sprite: "./assets/sprites/ladydevimon.png"
  },

  gallantmon: {
    id: "gallantmon",
    name: "Gallantmon",
    type: "Virus",
    element: "Light",
    family: "Holy Warrior",
    baseStats: { hp: 124, sp: 48, atk: 38, def: 27, int: 28, spd: 20 },
    evolutions: [],
    sprite: "./assets/sprites/gallantmon.png"
  },

  rusttyrannomon: {
    id: "rusttyrannomon",
    name: "RustTyrannomon",
    type: "Virus",
    element: "Electric",
    family: "Machine",
    baseStats: { hp: 128, sp: 42, atk: 39, def: 28, int: 22, spd: 17 },
    evolutions: [],
    sprite: "./assets/sprites/rusttyrannomon.png"
  },

  shinegreymon: {
    id: "shinegreymon",
    name: "ShineGreymon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Warrior",
    baseStats: { hp: 120, sp: 50, atk: 34, def: 25, int: 33, spd: 20 },
    evolutions: [],
    sprite: "./assets/sprites/shinegreymon.png"
  },

  miragegaogamon: {
    id: "miragegaogamon",
    name: "MirageGaogamon",
    type: "Data",
    element: "Wind",
    family: "Beast Knight",
    baseStats: { hp: 116, sp: 48, atk: 31, def: 24, int: 32, spd: 22 },
    evolutions: [],
    sprite: "./assets/sprites/miragegaogamon.png"
  },

  slayerdramon: {
    id: "slayerdramon",
    name: "Slayerdramon",
    type: "Vaccine",
    element: "Wind",
    family: "Holy Dragon",
    baseStats: { hp: 118, sp: 46, atk: 35, def: 24, int: 29, spd: 21 },
    evolutions: [],
    sprite: "./assets/sprites/slayerdramon.png"
  },

  brakedramon: {
    id: "brakedramon",
    name: "Brakedramon",
    type: "Virus",
    element: "Plant",
    family: "Machine Dragon",
    baseStats: { hp: 130, sp: 40, atk: 39, def: 28, int: 21, spd: 16 },
    evolutions: [],
    sprite: "./assets/sprites/brakedramon.png"
  },

  megagargomon: {
    id: "megagargomon",
    name: "MegaGargomon",
    type: "Vaccine",
    element: "Wind",
    family: "Machine",
    baseStats: { hp: 122, sp: 48, atk: 31, def: 26, int: 32, spd: 19 },
    evolutions: [],
    sprite: "./assets/sprites/megagargomon.png"
  },

  ophanimon: {
    id: "ophanimon",
    name: "Ophanimon",
    type: "Vaccine",
    element: "Light",
    family: "Angel",
    baseStats: { hp: 114, sp: 54, atk: 28, def: 24, int: 36, spd: 19 },
    evolutions: [],
    sprite: "./assets/sprites/ophanimon.png"
  },

  magnadramon: {
    id: "magnadramon",
    name: "Magnadramon",
    type: "Vaccine",
    element: "Light",
    family: "Holy Dragon",
    baseStats: { hp: 120, sp: 50, atk: 27, def: 24, int: 35, spd: 18 },
    evolutions: [],
    sprite: "./assets/sprites/magnadramon.png"
  },

  saberleomon: {
    id: "saberleomon",
    name: "SaberLeomon",
    type: "Vaccine",
    element: "Neutral",
    family: "Beast King",
    baseStats: { hp: 122, sp: 42, atk: 37, def: 26, int: 23, spd: 19 },
    evolutions: [],
    sprite: "./assets/sprites/saberleomon.png"
  },

  bancholeomon: {
    id: "bancholeomon",
    name: "BanchoLeomon",
    type: "Vaccine",
    element: "Light",
    family: "Beast Man",
    baseStats: { hp: 118, sp: 44, atk: 38, def: 25, int: 24, spd: 20 },
    evolutions: [],
    sprite: "./assets/sprites/bancholeomon.png"
  },

  machinedramon: {
    id: "machinedramon",
    name: "Machinedramon",
    type: "Virus",
    element: "Electric",
    family: "Machine",
    baseStats: { hp: 132, sp: 42, atk: 40, def: 29, int: 22, spd: 16 },
    evolutions: ["chaosdramon"],
    sprite: "./assets/sprites/machinedramon.png"
  },

  beelzemon: {
    id: "beelzemon",
    name: "Beelzemon",
    type: "Virus",
    element: "Dark",
    family: "Demon Lord",
    baseStats: { hp: 118, sp: 48, atk: 34, def: 23, int: 32, spd: 21 },
    evolutions: ["beelzemon_bm"],
    sprite: "./assets/sprites/beelzemon.png"
  },

  lilithmon: {
    id: "lilithmon",
    name: "Lilithmon",
    type: "Virus",
    element: "Dark",
    family: "Demon Lord",
    baseStats: { hp: 112, sp: 54, atk: 26, def: 22, int: 38, spd: 19 },
    evolutions: [],
    sprite: "./assets/sprites/lilithmon.png"
  },

  chaosdramon: {
    id: "chaosdramon",
    name: "Chaosdramon",
    type: "Virus",
    element: "Dark",
    family: "Machine",
    baseStats: { hp: 148, sp: 48, atk: 46, def: 33, int: 24, spd: 18 },
    evolutions: [],
    sprite: "./assets/sprites/chaosdramon.png"
  },

  beelzemon_bm: {
    id: "beelzemon_bm",
    name: "Beelzemon BM",
    type: "Virus",
    element: "Dark",
    family: "Demon Lord",
    baseStats: { hp: 138, sp: 56, atk: 42, def: 26, int: 36, spd: 23 },
    evolutions: [],
    sprite: "./assets/sprites/beelzemon_bm.png"
  }
};

export const STARTER_IDS = ["agumon", "gabumon", "patamon"];

export function getDigimonSpecies(speciesId) {
  return DIGIMONS[speciesId] || null;
}

export function getAllDigimonSpecies() {
  return Object.values(DIGIMONS);
}
