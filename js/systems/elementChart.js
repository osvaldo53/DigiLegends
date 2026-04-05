/**
 * Sistema de vantagem elemental.
 *
 * Elementos:
 * - Fire
 * - Water
 * - Plant
 * - Electric
 * - Earth
 * - Wind
 * - Light
 * - Dark
 * - Neutral (fallback)
 *
 * Regras:
 * - baseado em tabela ofensiva
 * - Light e Dark possuem vantagem mutua ofensiva
 * - NÃO existe resistencia entre Light e Dark
 *
 * Multiplicadores:
 * - vantagem: 1.20
 * - desvantagem: 0.85
 * - neutro: 1.00
 */

/**
 * Multiplicadores padronizados do sistema elemental.
 */
export const ELEMENT_MULTIPLIERS = {
  ADVANTAGE: 1.20,
  DISADVANTAGE: 0.85,
  NEUTRAL: 1.0
};

/**
 * Lista de elementos válidos.
 */
const VALID_ELEMENTS = [
  "Fire",
  "Water",
  "Plant",
  "Electric",
  "Earth",
  "Wind",
  "Light",
  "Dark",
  "Neutral"
];

/**
 * Tabela ofensiva de vantagens elementais.
 *
 * Interpretação:
 * - se skillElement estiver aqui
 * - e defenderElement estiver no array correspondente
 * então há vantagem ofensiva
 */
const ELEMENT_ADVANTAGES = {
  Fire: ["Plant"],
  Water: ["Fire"],
  Plant: ["Water"],
  Electric: ["Water"],
  Earth: ["Electric"],
  Wind: ["Earth"],
  Light: ["Dark"],
  Dark: ["Light"]
};

/**
 * Verifica se o elemento é válido.
 *
 * @param {string} element
 * @returns {boolean}
 */
export function isValidElement(element) {
  return VALID_ELEMENTS.includes(element);
}

/**
 * Retorna o multiplicador elemental.
 *
 * Regras:
 * - Neutral sempre retorna 1.0
 * - vantagem ofensiva = 1.20
 * - desvantagem ofensiva = 0.85
 * - neutro = 1.00
 *
 * Light/Dark:
 * - ambos têm vantagem ofensiva entre si
 * - NÃO existe resistência entre eles
 *
 * @param {string} skillElement
 * @param {string} defenderElement
 * @returns {number}
 */
export function getElementMultiplier(skillElement, defenderElement) {
  // Segurança contra valores inválidos
  if (!isValidElement(skillElement) || !isValidElement(defenderElement)) {
    return ELEMENT_MULTIPLIERS.NEUTRAL;
  }

  // Neutral sempre neutro
  if (skillElement === "Neutral" || defenderElement === "Neutral") {
    return ELEMENT_MULTIPLIERS.NEUTRAL;
  }

  const attackerAdvantages = ELEMENT_ADVANTAGES[skillElement] || [];

  // vantagem ofensiva
  if (attackerAdvantages.includes(defenderElement)) {
    return ELEMENT_MULTIPLIERS.ADVANTAGE;
  }

  const defenderAdvantages = ELEMENT_ADVANTAGES[defenderElement] || [];

  // desvantagem ofensiva (exceto Light/Dark)
  if (
    defenderAdvantages.includes(skillElement) &&
    !(
      (skillElement === "Light" && defenderElement === "Dark") ||
      (skillElement === "Dark" && defenderElement === "Light")
    )
  ) {
    return ELEMENT_MULTIPLIERS.DISADVANTAGE;
  }

  return ELEMENT_MULTIPLIERS.NEUTRAL;
}