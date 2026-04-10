/**
 * Banco de dados de itens do jogo.
 * Estrutura preparada para expansão futura (buffs, revive, etc).
 */

export const ITEMS = {
  bandage: {
    id: "bandage",
    name: "Bandage",
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

  small_recovery: {
    id: "small_recovery",
    name: "Small Recovery",
    description: "Recupera 60 de HP.",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 60,
      spRestore: 0
    },
    usableInMenu: true,
    usableInBattle: true
  },

  medium_recovery: {
    id: "medium_recovery",
    name: "Medium Recovery",
    description: "Recupera 120 de HP.",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 120,
      spRestore: 0
    },
    usableInMenu: true,
    usableInBattle: true
  },

  high_recovery: {
    id: "high_recovery",
    name: "High Recovery",
    description: "Recupera 350 de HP.",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 350,
      spRestore: 0
    },
    usableInMenu: true,
    usableInBattle: true
  },

  small_sp_disk: {
    id: "small_sp_disk",
    name: "Small SP Disk",
    description: "Recupera 30 de SP.",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 30
    },
    usableInMenu: true,
    usableInBattle: true
  },

  medium_sp_disk: {
    id: "medium_sp_disk",
    name: "Medium SP Disk",
    description: "Recupera 60 de SP.",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 60
    },
    usableInMenu: true,
    usableInBattle: true
  },

  high_sp_disk: {
    id: "high_sp_disk",
    name: "High SP Disk",
    description: "Recupera 120 de SP.",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 120
    },
    usableInMenu: true,
    usableInBattle: true
  },

  revive: {
    id: "revive",
    name: "Revive",
    description: "Ressuscita um Digimon derrotado com 50% de HP.",
    category: "recovery",
    target: "single_ally",
    effect: {
      revivePercent: 0.5
    },
    usableInMenu: false,
    usableInBattle: true
  },

  revive_max: {
    id: "revive_max",
    name: "Revive Max",
    description: "Ressuscita um Digimon derrotado com 100% de HP.",
    category: "recovery",
    target: "single_ally",
    effect: {
      revivePercent: 1
    },
    usableInMenu: false,
    usableInBattle: true
  },

  omni_sword: {
    id: "omni_sword",
    name: "Omni Sword",
    description: "Espada rara obtida ao superar o desafio de Omnimon.",
    sprite: "./assets/items/omni_sword.png",
    category: "boss",
    target: "none",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  toy_gun: {
    id: "toy_gun",
    name: "Toy Gun",
    description: "Pistola simbolica usada para despertar o poder maximo de Beelzemon.",
    sprite: "./assets/items/toy_gun.png",
    category: "evolution",
    target: "none",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  chaos_digicore: {
    id: "chaos_digicore",
    name: "Chaos Digicore",
    description: "Nucleo caotico necessario para forcar a evolucao de Machinedramon.",
    sprite: "./assets/items/chaos_digicore.png",
    category: "evolution",
    target: "none",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
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
