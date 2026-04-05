import { getTypeMultiplier } from "./typeChart.js";
import { getElementMultiplier } from "./elementChart.js";

/**
 * Calcula o valor base de ataque de acordo com o scaling da skill.
 *
 * Regras:
 * - skills físicas usam ATK
 * - skills mágicas/técnicas usam INT
 * - fallback padrão: ATK
 *
 * @param {object} attacker
 * @param {object} skill
 * @returns {number}
 */
function getOffensiveStat(attacker, skill) {
  if (skill.scaling === "int") {
    return attacker.finalStats.int;
  }

  return attacker.finalStats.atk;
}

/**
 * Calcula o valor defensivo de acordo com o scaling da skill.
 *
 * Regras:
 * - skill baseada em ATK bate contra DEF
 * - skill baseada em INT bate contra INT
 *
 * @param {object} defender
 * @param {object} skill
 * @returns {number}
 */
function getDefensiveStat(defender, skill) {
  if (skill.scaling === "int") {
    return defender.finalStats.int;
  }

  return defender.finalStats.def;
}

/**
 * Calcula o dano base antes dos multiplicadores.
 *
 * Fórmula inicial:
 * danoBase = poder da skill + atributo ofensivo - metade da defesa
 *
 * Observação:
 * - esta fórmula foi escolhida para ser simples e fácil de balancear
 * - pode ser refinada depois sem alterar os charts de tipo/elemento
 *
 * @param {object} attacker
 * @param {object} defender
 * @param {object} skill
 * @returns {number}
 */
export function calculateBaseDamage(attacker, defender, skill) {
  const offensiveStat = getOffensiveStat(attacker, skill);
  const defensiveStat = getDefensiveStat(defender, skill);

  const rawDamage = skill.power + offensiveStat - Math.floor(defensiveStat / 2);

  return Math.max(1, rawDamage);
}

/**
 * Calcula o dano final já com multiplicadores de tipo e elemento.
 *
 * Fórmula:
 * danoFinal = danoBase * modificadorTipo * modificadorElemento
 *
 * @param {object} params
 * @param {object} params.attacker
 * @param {object} params.defender
 * @param {object} params.skill
 * @param {object} params.attackerSpecies
 * @param {object} params.defenderSpecies
 * @returns {object}
 */
export function calculateFinalDamage({
  attacker,
  defender,
  skill,
  attackerSpecies,
  defenderSpecies
}) {
  const baseDamage = calculateBaseDamage(attacker, defender, skill);

  const typeMultiplier = getTypeMultiplier(
    attackerSpecies?.type,
    defenderSpecies?.type
  );

  const elementMultiplier = getElementMultiplier(
    skill?.element || "Neutral",
    defenderSpecies?.element || "Neutral"
  );

  const finalDamage = Math.max(
    1,
    Math.floor(baseDamage * typeMultiplier * elementMultiplier)
  );

  return {
    baseDamage,
    typeMultiplier,
    elementMultiplier,
    finalDamage
  };
}