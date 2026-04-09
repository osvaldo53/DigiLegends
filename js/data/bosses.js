import { getItemById } from "./items.js";

export const BOSSES = [
  {
    id: "omnimon",
    name: "Desafio de Omnimon",
    description:
      "Enfrente MetalGarurumon e WarGreymon em sequencia antes da fusao final que desperta Omnimon.",
    recommendedLevel: 50,
    rewardLabel: "Cura alta, revives e itens raros",
    stages: [
      {
        id: "omnimon-metalgarurumon",
        name: "MetalGarurumon",
        speciesId: "metalgarurumon",
        level: 52,
        bonusStats: {
          hp: 242,
          atk: 4,
          def: 3,
          int: 4,
          spd: 3
        },
        rewards: {
          bits: 110,
          exp: 130
        }
      },
      {
        id: "omnimon-wargreymon",
        name: "WarGreymon",
        speciesId: "wargreymon",
        level: 52,
        bonusStats: {
          hp: 250,
          atk: 5,
          def: 4,
          int: 3,
          spd: 2
        },
        rewards: {
          bits: 120,
          exp: 140
        },
        transitionAnimation: {
          heading: "DNA Digivolution",
          subheading: "MetalGarurumon e WarGreymon liberaram Omnimon.",
          from: {
            name: "WarGreymon",
            sprite: "./assets/sprites/wargreymon.png"
          },
          to: {
            name: "Omnimon",
            sprite: "./assets/sprites/omnimon.png"
          },
          sources: [
            {
              label: "Base 1",
              name: "MetalGarurumon",
              sprite: "./assets/sprites/metalgarurumon.png"
            },
            {
              label: "Base 2",
              name: "WarGreymon",
              sprite: "./assets/sprites/wargreymon.png"
            }
          ]
        }
      },
      {
        id: "omnimon-final",
        name: "Omnimon",
        speciesId: "omnimon",
        level: 55,
        bonusStats: {
          hp: 395,
          atk: 8,
          def: 6,
          int: 7,
          spd: 4
        },
        rewards: {
          bits: 180,
          exp: 220
        }
      }
    ],
    rewardDrops: [
      { itemId: "high_recovery", quantity: 2, chance: 1 },
      { itemId: "high_sp_disk", quantity: 2, chance: 0.85 },
      { itemId: "revive", quantity: 2, chance: 0.8 },
      { itemId: "revive_max", quantity: 1, chance: 0.35 },
      { itemId: "omni_sword", quantity: 1, chance: 0.1 }
    ]
  },
  {
    id: "alphamon-ouryuken",
    name: "Desafio de Alphamon Ouryuken",
    description:
      "Enfrente Ouryumon e Alphamon em sequencia antes da fusao final que desperta Alphamon Ouryuken.",
    recommendedLevel: 100,
    rewardLabel: "High Recovery, Revive Max e muito cash",
    stages: [
      {
        id: "alphamon-ouryuken-ouryumon",
        name: "Ouryumon",
        speciesId: "ouryumon",
        level: 100,
        bonusStats: {
          hp: 920,
          atk: 18,
          def: 16,
          int: 14,
          spd: 10
        },
        rewards: {
          bits: 420,
          exp: 320
        }
      },
      {
        id: "alphamon-ouryuken-alphamon",
        name: "Alphamon",
        speciesId: "alphamon",
        level: 100,
        bonusStats: {
          hp: 900,
          atk: 16,
          def: 16,
          int: 18,
          spd: 12
        },
        rewards: {
          bits: 460,
          exp: 340
        },
        transitionAnimation: {
          heading: "DNA Digivolution",
          subheading: "Ouryumon e Alphamon liberaram Alphamon Ouryuken.",
          from: {
            name: "Alphamon",
            sprite: "./assets/sprites/alphamon.png"
          },
          to: {
            name: "Alphamon Ouryuken",
            sprite: "./assets/sprites/alphamon_ouryuken.png"
          },
          sources: [
            {
              label: "Base 1",
              name: "Ouryumon",
              sprite: "./assets/sprites/ouryumon.png"
            },
            {
              label: "Base 2",
              name: "Alphamon",
              sprite: "./assets/sprites/alphamon.png"
            }
          ]
        }
      },
      {
        id: "alphamon-ouryuken-final",
        name: "Alphamon Ouryuken",
        speciesId: "alphamon_ouryuken",
        level: 100,
        bonusStats: {
          hp: 1480,
          atk: 24,
          def: 22,
          int: 22,
          spd: 14
        },
        rewards: {
          bits: 680,
          exp: 520
        }
      }
    ],
    rewardDrops: [
      { itemId: "high_recovery", quantity: 4, chance: 1 },
      { itemId: "revive_max", quantity: 2, chance: 0.85 },
      { itemId: "revive", quantity: 2, chance: 0.65 }
    ]
  }
];

export function getBossById(bossId) {
  return BOSSES.find((boss) => boss.id === bossId) || null;
}

export function rollBossRewardDrops(bossId, randomFn = Math.random) {
  const boss = getBossById(bossId);

  if (!boss) {
    throw new Error("Boss invalido.");
  }

  return boss.rewardDrops
    .filter((drop) => randomFn() < Number(drop.chance ?? 0))
    .map((drop) => ({
      id: drop.itemId,
      itemId: drop.itemId,
      name: getItemById(drop.itemId)?.name || drop.itemId,
      quantity: Number(drop.quantity ?? 1)
    }));
}
