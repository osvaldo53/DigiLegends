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
  }
};

/**
 * Retorna um item pelo ID
 */
export function getItemById(id) {
  return ITEMS[id] || null;
}