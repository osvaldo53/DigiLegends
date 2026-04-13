import { getItemById } from "./items.js";

/**
 * Catálogo da loja.
 *
 * Esta camada existe para separar:
 * - dados do item
 * - regras de venda/preço
 *
 * Assim, um item pode existir no jogo sem necessariamente
 * estar à venda na loja.
 */
export const SHOP_CATALOG = [
  {
    itemId: "bandage",
    price: 28
  },
  {
    itemId: "small_recovery",
    price: 65
  },
  {
    itemId: "medium_recovery",
    price: 140
  },
  {
    itemId: "high_recovery",
    price: 260
  },
  {
    itemId: "small_sp_disk",
    price: 55
  },
  {
    itemId: "medium_sp_disk",
    price: 120
  },
  {
    itemId: "high_sp_disk",
    price: 220
  },
  {
    itemId: "revive",
    price: 180
  },
  {
    itemId: "revive_max",
    price: 420
  },
  {
    itemId: "training_chip_hp",
    price: 1500
  },
  {
    itemId: "training_chip_sp",
    price: 1500
  },
  {
    itemId: "training_chip_atk",
    price: 1500
  },
  {
    itemId: "training_chip_def",
    price: 1500
  },
  {
    itemId: "training_chip_int",
    price: 1500
  },
  {
    itemId: "training_chip_spd",
    price: 1500
  },
  {
    itemId: "digi_egg_courage",
    price: 20000
  },
  {
    itemId: "digi_egg_friendship",
    price: 20000
  },
  {
    itemId: "digi_egg_hope",
    price: 20000
  }
];

/**
 * Retorna todas as entradas válidas da loja já enriquecidas
 * com os dados do item correspondente.
 *
 * @returns {object[]}
 */
export function getShopEntries() {
  return SHOP_CATALOG
    .map((entry) => {
      const item = getItemById(entry.itemId);

      if (!item) {
        return null;
      }

      return {
        ...entry,
        item
      };
    })
    .filter(Boolean);
}

/**
 * Retorna uma entrada específica da loja pelo itemId.
 *
 * @param {string} itemId
 * @returns {object|null}
 */
export function getShopEntryByItemId(itemId) {
  const entry = SHOP_CATALOG.find((shopEntry) => shopEntry.itemId === itemId);

  if (!entry) {
    return null;
  }

  const item = getItemById(entry.itemId);

  if (!item) {
    return null;
  }

  return {
    ...entry,
    item
  };
}
