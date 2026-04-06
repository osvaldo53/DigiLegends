import { SAVE_KEY, SAVE_VERSION } from "../config/constants.js";
import { createEmptySave } from "../factories/saveFactory.js";

/**
 * Salva os dados do jogo no localStorage.
 *
 * @param {object} saveData
 */
export function saveGame(saveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

/**
 * Carrega o save bruto do localStorage.
 *
 * Retorna:
 * - objeto do save, se existir e estiver válido
 * - null, se não houver save ou se o JSON estiver corrompido
 */
export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);

  if (!raw) {
    return null;
  }

  try {
    const data = JSON.parse(raw);

    /**
     * Compatibilidade mínima com saves antigos.
     */
    if (!data.inventory) {
      data.inventory = [];
    }

    if (!data.scanData) {
      data.scanData = {};
    }

    return data;
  } catch (error) {
    console.error("Falha ao ler save:", error);
    return null;
  }
}

/**
 * Informa se já existe save salvo.
 */
export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

/**
 * Remove o save atual.
 */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Migra saves antigos para a estrutura mais atual.
 *
 * @param {object} saveData
 * @returns {object}
 */
export function migrateSaveIfNeeded(saveData) {
  const base = createEmptySave();

  if (!saveData || typeof saveData !== "object") {
    return base;
  }

  const migrated = {
    ...base,
    ...saveData,

    digidex: {
      ...base.digidex,
      ...(saveData.digidex || {})
    },

    progress: {
      ...base.progress,
      ...(saveData.progress || {})
    },

    inventory: Array.isArray(saveData.inventory)
      ? saveData.inventory
      : base.inventory,

    scanData:
      saveData.scanData && typeof saveData.scanData === "object"
        ? saveData.scanData
        : base.scanData
  };

  migrated.version = SAVE_VERSION;

  return migrated;
}