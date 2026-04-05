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
    baseStats: {
      hp: 24,
      sp: 10,
      atk: 5,
      def: 4,
      int: 4,
      spd: 5
    },
    evolutions: ["agumon"],
    sprite: "./assets/sprites/koromon.png"
  },

  agumon: {
    id: "agumon",
    name: "Agumon",
    type: "Vaccine",
    element: "Fire",
    family: "Reptile",
    baseStats: {
      hp: 42,
      sp: 16,
      atk: 12,
      def: 8,
      int: 7,
      spd: 9
    },
    evolutions: ["greymon"],
    sprite: "./assets/sprites/agumon.png"
  },

  tsunomon: {
    id: "tsunomon",
    name: "Tsunomon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: {
      hp: 24,
      sp: 11,
      atk: 4,
      def: 4,
      int: 5,
      spd: 5
    },
    evolutions: ["gabumon"],
    sprite: "./assets/sprites/tsunomon.png"
  },

  gabumon: {
    id: "gabumon",
    name: "Gabumon",
    type: "Data",
    element: "Water",
    family: "Reptile",
    baseStats: {
      hp: 40,
      sp: 18,
      atk: 10,
      def: 8,
      int: 9,
      spd: 8
    },
    evolutions: ["garurumon"],
    sprite: "./assets/sprites/gabumon.png"
  },

  tokomon: {
    id: "tokomon",
    name: "Tokomon",
    type: "Free",
    element: "Neutral",
    family: "Lesser",
    baseStats: {
      hp: 22,
      sp: 12,
      atk: 4,
      def: 4,
      int: 6,
      spd: 5
    },
    evolutions: ["patamon"],
    sprite: "./assets/sprites/tokomon.png"
  },

  patamon: {
    id: "patamon",
    name: "Patamon",
    type: "Data",
    element: "Wind",
    family: "Mammal",
    baseStats: {
      hp: 38,
      sp: 20,
      atk: 8,
      def: 8,
      int: 10,
      spd: 9
    },
    evolutions: ["angemon"],
    sprite: "./assets/sprites/patamon.png"
  },

  greymon: {
    id: "greymon",
    name: "Greymon",
    type: "Vaccine",
    element: "Fire",
    family: "Dinosaur",
    baseStats: {
      hp: 68,
      sp: 24,
      atk: 20,
      def: 13,
      int: 10,
      spd: 10
    },
    evolutions: ["metalgreymon"],
    sprite: "./assets/sprites/greymon.png"
  },

  garurumon: {
    id: "garurumon",
    name: "Garurumon",
    type: "Data",
    element: "Water",
    family: "Beast",
    baseStats: {
      hp: 62,
      sp: 28,
      atk: 17,
      def: 12,
      int: 14,
      spd: 12
    },
    evolutions: ["weregarurumon"],
    sprite: "./assets/sprites/garurumon.png"
  },

  angemon: {
    id: "angemon",
    name: "Angemon",
    type: "Vaccine",
    element: "Light",
    family: "Angel",
    baseStats: {
      hp: 58,
      sp: 30,
      atk: 15,
      def: 12,
      int: 16,
      spd: 11
    },
    evolutions: ["holyangemon"],
    sprite: "./assets/sprites/angemon.png"
  },

  metalgreymon: {
    id: "metalgreymon",
    name: "MetalGreymon",
    type: "Vaccine",
    element: "Fire",
    family: "Cyborg",
    baseStats: {
      hp: 94,
      sp: 36,
      atk: 28,
      def: 18,
      int: 16,
      spd: 13
    },
    evolutions: [],
    sprite: "./assets/sprites/metalgreymon.png"
  },

  weregarurumon: {
    id: "weregarurumon",
    name: "WereGarurumon",
    type: "Data",
    element: "Water",
    family: "Beast Man",
    baseStats: {
      hp: 88,
      sp: 36,
      atk: 26,
      def: 17,
      int: 17,
      spd: 15
    },
    evolutions: [],
    sprite: "./assets/sprites/weregarurumon.png"
  },

  holyangemon: {
    id: "holyangemon",
    name: "HolyAngemon",
    type: "Vaccine",
    element: "Light",
    family: "Archangel",
    baseStats: {
      hp: 84,
      sp: 40,
      atk: 22,
      def: 17,
      int: 20,
      spd: 14
    },
    evolutions: [],
    sprite: "./assets/sprites/holyangemon.png"
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