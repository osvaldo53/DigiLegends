const KEY = "digilegends_save";

export function saveGame(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function loadGame() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
