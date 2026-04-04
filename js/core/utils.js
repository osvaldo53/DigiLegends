export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function capitalize(text = "") {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function uniquePush(array, value) {
  if (!array.includes(value)) array.push(value);
  return array;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function choice(array) {
  return array[Math.floor(Math.random() * array.length)];
}
