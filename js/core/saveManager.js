import { SAVE_KEY, SAVE_VERSION } from "../config/constants.js";
import { createEmptySave } from "../factories/saveFactory.js";

export function saveGame(saveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Falha ao ler save:", error);
    return null;
  }
}

export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

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
    }
  };

  migrated.version = SAVE_VERSION;
  return migrated;
}
