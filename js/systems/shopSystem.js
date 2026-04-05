import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { addItemToInventory } from "./itemSystem.js";
import { getShopEntryByItemId } from "../data/shopCatalog.js";

/**
 * Verifica se o jogador possui Bits suficientes.
 *
 * @param {number} price
 * @returns {boolean}
 */
function hasEnoughBits(price) {
  return (state.save.bits ?? 0) >= price;
}

/**
 * Tenta comprar um item da loja.
 *
 * Fluxo:
 * 1. verifica se o item existe no catálogo
 * 2. verifica se o jogador tem Bits suficientes
 * 3. desconta o valor
 * 4. adiciona item ao inventário
 *
 * @param {string} itemId
 * @returns {{ success: boolean, message: string }}
 */
export function buyItem(itemId) {
  const shopEntry = getShopEntryByItemId(itemId);

  if (!shopEntry) {
    return {
      success: false,
      message: "Item não encontrado na loja."
    };
  }

  const { price, item } = shopEntry;

  if (!hasEnoughBits(price)) {
    return {
      success: false,
      message: "Bits insuficientes."
    };
  }

  // desconta Bits
  state.save.bits -= price;

  // adiciona ao inventário
  addItemToInventory(state.save, itemId, 1);

  saveGame(state.save);

  return {
    success: true,
    message: `${item.name} comprado com sucesso.`
  };
}

/**
 * Compra múltiplas unidades de um item.
 *
 * @param {string} itemId
 * @param {number} quantity
 * @returns {{ success: boolean, message: string }}
 */
export function buyItemBulk(itemId, quantity) {
  const shopEntry = getShopEntryByItemId(itemId);

  if (!shopEntry) {
    return {
      success: false,
      message: "Item não encontrado na loja."
    };
  }

  const safeQuantity = Math.max(1, Number(quantity) || 1);
  const totalPrice = shopEntry.price * safeQuantity;

  if (!hasEnoughBits(totalPrice)) {
    return {
      success: false,
      message: "Bits insuficientes para compra em quantidade."
    };
  }

  state.save.bits -= totalPrice;

  addItemToInventory(state.save, itemId, safeQuantity);

  saveGame(state.save);

  return {
    success: true,
    message: `${safeQuantity}x ${shopEntry.item.name} comprado(s).`
  };
}