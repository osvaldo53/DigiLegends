/**
 * Banco de espécies de Digimon.
 *
 * Estrutura padronizada:
 * - id
 * - name
 * - type
 * - element
 * - family
 * - baseStats
 * - evolutions
 * - sprite
 *
 * Regras:
 * - family é apenas visual/lore
 * - type influencia combate
 * - element influencia combate
 */

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

  metalgreymon: {
    id: "metalgreymon",
    name: "MetalGreymon",
    type: "Vaccine",
    element: "Fire",
    family: "Cyborg",
    baseStats: { hp: 94, sp: 36, atk: 28, def: 18, int: 16, spd: 13 },
    evolutions: [],
    sprite: "./assets/sprites/metalgreymon.png"
  },

  weregarurumon: {
    id: "weregarurumon",
    name: "WereGarurumon",
    type: "Data",
    element: "Water",
    family: "Beast Man",
    baseStats: { hp: 88, sp: 36, atk: 26, def: 17, int: 17, spd: 15 },
    evolutions: [],
    sprite: "./assets/sprites/weregarurumon.png"
  },

  holyangemon: {
    id: "holyangemon",
    name: "HolyAngemon",
    type: "Vaccine",
    element: "Light",
    family: "Archangel",
    baseStats: { hp: 84, sp: 40, atk: 22, def: 17, int: 20, spd: 14 },
    evolutions: [],
    sprite: "./assets/sprites/holyangemon.png"
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

  lillymon: {
    id: "lillymon",
    name: "Lillymon",
    type: "Data",
    element: "Plant",
    family: "Fairy",
    baseStats: { hp: 86, sp: 38, atk: 16, def: 17, int: 24, spd: 15 },
    evolutions: [],
    sprite: "./assets/sprites/lillymon.png"
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

  megakabuterimon: {
    id: "megakabuterimon",
    name: "MegaKabuterimon",
    type: "Vaccine",
    element: "Electric",
    family: "Insect",
    baseStats: { hp: 90, sp: 38, atk: 20, def: 18, int: 24, spd: 13 },
    evolutions: [],
    sprite: "./assets/sprites/megakabuterimon.png"
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

  zudomon: {
    id: "zudomon",
    name: "Zudomon",
    type: "Vaccine",
    element: "Water",
    family: "Sea Beast",
    baseStats: { hp: 96, sp: 30, atk: 27, def: 20, int: 15, spd: 11 },
    evolutions: [],
    sprite: "./assets/sprites/zudomon.png"
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

  garudamon: {
    id: "garudamon",
    name: "Garudamon",
    type: "Vaccine",
    element: "Fire",
    family: "Bird",
    baseStats: { hp: 84, sp: 36, atk: 20, def: 16, int: 22, spd: 15 },
    evolutions: [],
    sprite: "./assets/sprites/garudamon.png"
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

  aeroveedramon: {
    id: "aeroveedramon",
    name: "AeroVeedramon",
    type: "Free",
    element: "Wind",
    family: "Dragon Man",
    baseStats: { hp: 88, sp: 30, atk: 26, def: 16, int: 18, spd: 17 },
    evolutions: [],
    sprite: "./assets/sprites/aeroveedramon.png"
  }
};

export const STARTER_IDS = ["agumon", "gabumon", "patamon"];

/**
 * Retorna a espécie pelo ID.
 *
 * @param {string} speciesId
 * @returns {object|null}
 */
export function getDigimonSpecies(speciesId) {
  return DIGIMONS[speciesId] || null;
}

/**
 * Retorna todas as espécies cadastradas.
 *
 * @returns {object[]}
 */
export function getAllDigimonSpecies() {
  return Object.values(DIGIMONS);
}