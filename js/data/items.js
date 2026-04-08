/**
 * Banco de dados de itens do jogo.
 * Estrutura preparada para expansão futura (buffs, revive, etc).
 */

export const ITEMS = {
  bandage: {
    id: "bandage",
    name: "Bandage",
    description: "Recupera 12 de HP.",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 12,
      spRestore: 0
    },
    usableInMenu: true,
    usableInBattle: true
  },

  small_recovery: {
    id: "small_recovery",
    name: "Small Recovery",
    description: "Recupera 30 de HP.",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 30,
      spRestore: 0
    },
    usableInMenu: true,
    usableInBattle: true
  },

  small_sp_disk: {
    id: "small_sp_disk",
    name: "Small SP Disk",
    description: "Recupera 15 de SP.",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 15
    },
    usableInMenu: true,
    usableInBattle: true
  },

  digi_egg_courage: {
    id: "digi_egg_courage",
    name: "Digi-Egg of Courage",
    description: "Permite a Armor Evolution para Flamedramon.",
    sprite: "./assets/items/digi_egg_courage.png",
    category: "evolution",
    target: "none",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  digi_egg_friendship: {
    id: "digi_egg_friendship",
    name: "Digi-Egg of Friendship",
    description: "Permite a Armor Evolution para Lighdramon.",
    sprite: "./assets/items/digi_egg_friendship.png",
    category: "evolution",
    target: "none",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  digi_egg_hope: {
    id: "digi_egg_hope",
    name: "Digi-Egg of Hope",
    description: "Permite a Armor Evolution para Pegasusmon.",
    sprite: "./assets/items/digi_egg_hope.png",
    category: "evolution",
    target: "none",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  }
};

/**
 * Retorna um item pelo ID
 */
export function getItemById(id) {
  return ITEMS[id] || null;
}
