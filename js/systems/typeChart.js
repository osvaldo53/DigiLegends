/**
 * Sistema de vantagem de tipos.
 *
 * Tipos existentes:
 * - Vaccine
 * - Virus
 * - Data
 * - Free
 *
 * Regras:
 * - Vaccine > Virus
 * - Virus > Data
 * - Data > Vaccine
 * - Free nunca tem vantagem nem desvantagem
 *
 * Multiplicadores:
 * - vantagem: 1.25
 * - desvantagem: 0.80
 * - neutro: 1.00
 */

/**
 * Multiplicadores padronizados do sistema de tipos.
 * Mantidos como constantes para facilitar balanceamento futuro.
 */
export const TYPE_MULTIPLIERS = {
  ADVANTAGE: 1.25,
  DISADVANTAGE: 0.8,
  NEUTRAL: 1.0
};

/**
 * Tabela ofensiva de vantagens.
 *
 * Interpretação:
 * - se attackerType estiver aqui
 * - e defenderType estiver dentro do array correspondente
 * então há vantagem ofensiva.
 */
const TYPE_ADVANTAGES = {
  Vaccine: ["Virus"],
  Virus: ["Data"],
  Data: ["Vaccine"]
};

/**
 * Verifica se o tipo informado é válido dentro do sistema.
 *
 * @param {string} type
 * @returns {boolean}
 */
export function isValidDigimonType(type) {
  return ["Vaccine", "Virus", "Data", "Free"].includes(type);
}

/**
 * Retorna o multiplicador de tipo.
 *
 * Regras:
 * - Free sempre resulta em neutro
 * - vantagem ofensiva = 1.25
 * - desvantagem ofensiva = 0.80
 * - neutro = 1.00
 *
 * @param {string} attackerType
 * @param {string} defenderType
 * @returns {number}
 */
export function getTypeMultiplier(attackerType, defenderType) {
  // Segurança: se vier valor inválido, trata como neutro
  if (!isValidDigimonType(attackerType) || !isValidDigimonType(defenderType)) {
    return TYPE_MULTIPLIERS.NEUTRAL;
  }

  // Tipo Free nunca gera vantagem nem desvantagem
  if (attackerType === "Free" || defenderType === "Free") {
    return TYPE_MULTIPLIERS.NEUTRAL;
  }

  const attackerAdvantages = TYPE_ADVANTAGES[attackerType] || [];

  if (attackerAdvantages.includes(defenderType)) {
    return TYPE_MULTIPLIERS.ADVANTAGE;
  }

  const defenderAdvantages = TYPE_ADVANTAGES[defenderType] || [];

  if (defenderAdvantages.includes(attackerType)) {
    return TYPE_MULTIPLIERS.DISADVANTAGE;
  }

  return TYPE_MULTIPLIERS.NEUTRAL;
}