import { getItemById } from "../data/items.js";
import { applyExpGain } from "./progressionSystem.js";

/**
 * Retorna a entrada do inventário para um item específico.
 *
 * @param {object} save
 * @param {string} itemId
 * @returns {object|null}
 */
export function getInventoryEntry(save, itemId) {
  return save.inventory.find((i) => i.itemId === itemId) || null;
}

/**
 * Adiciona item ao inventário.
 *
 * Se já existir, soma quantidade.
 * Se não existir, cria nova entrada.
 *
 * @param {object} save
 * @param {string} itemId
 * @param {number} quantity
 */
export function addItemToInventory(save, itemId, quantity = 1) {
  let entry = getInventoryEntry(save, itemId);

  if (!entry) {
    entry = { itemId, quantity: 0 };
    save.inventory.push(entry);
  }

  entry.quantity += quantity;
}

/**
 * Consome (remove) item do inventário.
 *
 * @param {object} save
 * @param {string} itemId
 * @param {number} quantity
 */
export function consumeItem(save, itemId, quantity = 1) {
  const entry = getInventoryEntry(save, itemId);

  if (!entry || entry.quantity < quantity) {
    throw new Error("Item insuficiente.");
  }

  entry.quantity -= quantity;

  if (entry.quantity <= 0) {
    save.inventory = save.inventory.filter((i) => i.itemId !== itemId);
  }
}

/**
 * Aplica o efeito do item no Digimon.
 *
 * @param {object} item
 * @param {object} digimon
 */
function applyItemEffect(item, digimon) {
  const effect = item.effect;
  let progression = null;

  if (effect.revivePercent && (digimon.currentHP ?? 0) <= 0) {
    digimon.currentHP = Math.max(
      1,
      Math.floor(digimon.finalStats.hp * effect.revivePercent)
    );
  }

  if (effect.hpRestore) {
    digimon.currentHP = Math.min(
      digimon.currentHP + effect.hpRestore,
      digimon.finalStats.hp
    );
  }

  if (effect.spRestore) {
    digimon.currentSP = Math.min(
      digimon.currentSP + effect.spRestore,
      digimon.finalStats.sp
    );
  }

  if (effect.expGain) {
    progression = applyExpGain(digimon, effect.expGain);
  }

  return progression;
}

function canItemAffectDefeatedDigimon(item) {
  return Boolean(item.effect?.revive || item.effect?.revivePercent);
}

/**
 * Usa um item em um Digimon.
 *
 * Regras:
 * - valida contexto (menu ou battle)
 * - bloqueia cura comum em Digimon derrotado
 * - verifica se houve efeito real (evita desperdício)
 * - consome o item apenas se houver efeito
 *
 * @param {object} params
 * @param {object} params.save
 * @param {string} params.itemId
 * @param {object} params.targetDigimon
 * @param {"menu"|"battle"} params.context
 *
 * @returns {object}
 */
export function useItemOnDigimon({
  save,
  itemId,
  targetDigimon,
  context = "menu"
}) {
  const item = getItemById(itemId);

  if (!item) {
    throw new Error("Item inválido.");
  }

  if (!targetDigimon) {
    throw new Error("Alvo inválido.");
  }

  if (context === "menu" && !item.usableInMenu) {
    throw new Error("Item não pode ser usado no menu.");
  }

  if (context === "battle" && !item.usableInBattle) {
    throw new Error("Item não pode ser usado em batalha.");
  }

  if ((targetDigimon.currentHP ?? 0) <= 0 && !canItemAffectDefeatedDigimon(item)) {
    throw new Error("Digimon derrotado não pode ser curado sem item de revive.");
  }

  const beforeHP = targetDigimon.currentHP;
  const beforeSP = targetDigimon.currentSP;
  const beforeLevel = targetDigimon.level;
  const beforeExp = targetDigimon.exp;

  const progression = applyItemEffect(item, targetDigimon);

  const changed =
    beforeHP !== targetDigimon.currentHP ||
    beforeSP !== targetDigimon.currentSP ||
    beforeLevel !== targetDigimon.level ||
    beforeExp !== targetDigimon.exp;

  if (!changed) {
    throw new Error("O item não teve efeito.");
  }

  consumeItem(save, itemId, 1);

  return {
    success: true,
    item,
    target: targetDigimon,
    progression
  };
}
