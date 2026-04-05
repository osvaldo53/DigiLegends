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
    price: 20
  },
  {
    itemId: "small_recovery",
    price: 45
  },
  {
    itemId: "small_sp_disk",
    price: 35
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