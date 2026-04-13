/**
 * Banco de dados de itens do jogo.
 * Estrutura preparada para expansão futura (buffs, revive, etc).
 */

export const ITEMS = {
  bandage: {
    id: "bandage",
    name: "Bandage",
    description: "Recupera 30 de HP.",
    sprite: "./assets/items/hp_recovery.png",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 30,
      spRestore: 0
    },
    usableInMenu: false,
    usableInBattle: true
  },

  small_recovery: {
    id: "small_recovery",
    name: "Small Recovery",
    description: "Recupera 60 de HP.",
    sprite: "./assets/items/hp_recovery.png",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 60,
      spRestore: 0
    },
    usableInMenu: false,
    usableInBattle: true
  },

  medium_recovery: {
    id: "medium_recovery",
    name: "Medium Recovery",
    description: "Recupera 120 de HP.",
    sprite: "./assets/items/hp_recovery.png",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 120,
      spRestore: 0
    },
    usableInMenu: false,
    usableInBattle: true
  },

  high_recovery: {
    id: "high_recovery",
    name: "High Recovery",
    description: "Recupera 350 de HP.",
    sprite: "./assets/items/hp_recovery.png",
    category: "healing",
    target: "single_ally",
    effect: {
      hpRestore: 350,
      spRestore: 0
    },
    usableInMenu: false,
    usableInBattle: true
  },

  small_sp_disk: {
    id: "small_sp_disk",
    name: "Small SP Disk",
    description: "Recupera 30 de SP.",
    sprite: "./assets/items/sp_disk.png",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 30
    },
    usableInMenu: false,
    usableInBattle: true
  },

  medium_sp_disk: {
    id: "medium_sp_disk",
    name: "Medium SP Disk",
    description: "Recupera 60 de SP.",
    sprite: "./assets/items/sp_disk.png",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 60
    },
    usableInMenu: false,
    usableInBattle: true
  },

  high_sp_disk: {
    id: "high_sp_disk",
    name: "High SP Disk",
    description: "Recupera 120 de SP.",
    sprite: "./assets/items/sp_disk.png",
    category: "recovery",
    target: "single_ally",
    effect: {
      hpRestore: 0,
      spRestore: 120
    },
    usableInMenu: false,
    usableInBattle: true
  },

  revive: {
    id: "revive",
    name: "Revive",
    description: "Ressuscita um Digimon derrotado com 50% de HP.",
    sprite: "./assets/items/revive.png",
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
    sprite: "./assets/items/revive_max.png",
    category: "recovery",
    target: "single_ally",
    effect: {
      revivePercent: 1
    },
    usableInMenu: false,
    usableInBattle: true
  },

  xp_chip_tiny: {
    id: "xp_chip_tiny",
    name: "XP Chip Tiny",
    description: "Concede 32 de EXP a um Digimon.",
    sprite: "./assets/items/xp_chip.png",
    category: "xp",
    target: "single_ally",
    effect: {
      expGain: 32
    },
    usableInMenu: true,
    usableInBattle: false
  },

  xp_chip_small: {
    id: "xp_chip_small",
    name: "XP Chip Small",
    description: "Concede 72 de EXP a um Digimon.",
    sprite: "./assets/items/xp_chip.png",
    category: "xp",
    target: "single_ally",
    effect: {
      expGain: 72
    },
    usableInMenu: true,
    usableInBattle: false
  },

  xp_chip_medium: {
    id: "xp_chip_medium",
    name: "XP Chip Medium",
    description: "Concede 144 de EXP a um Digimon.",
    sprite: "./assets/items/xp_chip.png",
    category: "xp",
    target: "single_ally",
    effect: {
      expGain: 144
    },
    usableInMenu: true,
    usableInBattle: false
  },

  xp_chip_large: {
    id: "xp_chip_large",
    name: "XP Chip Large",
    description: "Concede 240 de EXP a um Digimon.",
    sprite: "./assets/items/xp_chip.png",
    category: "xp",
    target: "single_ally",
    effect: {
      expGain: 240
    },
    usableInMenu: true,
    usableInBattle: false
  },

  xp_chip_mega: {
    id: "xp_chip_mega",
    name: "XP Chip Mega",
    description: "Concede 360 de EXP a um Digimon.",
    sprite: "./assets/items/xp_chip.png",
    category: "xp",
    target: "single_ally",
    effect: {
      expGain: 360
    },
    usableInMenu: true,
    usableInBattle: false
  },

  training_chip_hp: {
    id: "training_chip_hp",
    name: "HP Training Chip",
    description: "Usado na tela de treinamento para aumentar HP.",
    sprite: "./assets/items/training_chip_hp.png",
    category: "training",
    target: "single_ally",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  training_chip_sp: {
    id: "training_chip_sp",
    name: "SP Training Chip",
    description: "Usado na tela de treinamento para aumentar SP.",
    sprite: "./assets/items/training_chip_sp.png",
    category: "training",
    target: "single_ally",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  training_chip_atk: {
    id: "training_chip_atk",
    name: "ATK Training Chip",
    description: "Usado na tela de treinamento para aumentar ATK.",
    sprite: "./assets/items/training_chip_atk.png",
    category: "training",
    target: "single_ally",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  training_chip_def: {
    id: "training_chip_def",
    name: "DEF Training Chip",
    description: "Usado na tela de treinamento para aumentar DEF.",
    sprite: "./assets/items/training_chip_def.png",
    category: "training",
    target: "single_ally",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  training_chip_int: {
    id: "training_chip_int",
    name: "INT Training Chip",
    description: "Usado na tela de treinamento para aumentar INT.",
    sprite: "./assets/items/training_chip_int.png",
    category: "training",
    target: "single_ally",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
  },

  training_chip_spd: {
    id: "training_chip_spd",
    name: "SPD Training Chip",
    description: "Usado na tela de treinamento para aumentar SPD.",
    sprite: "./assets/items/training_chip_spd.png",
    category: "training",
    target: "single_ally",
    effect: {},
    usableInMenu: false,
    usableInBattle: false
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
