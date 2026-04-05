/**
 * Banco de skills do jogo.
 *
 * Estrutura padrão:
 * - id: identificador único
 * - name: nome exibido
 * - kind: "attack" | "healing"
 *
 * Para skills ofensivas:
 * - power: poder base
 * - cost: custo em SP
 * - element: elemento da skill
 * - scaling: "atk" ou "int"
 *
 * Para skills de cura:
 * - cost: custo em SP
 * - target: alvo da skill
 * - effect: efeito aplicado
 *
 * Observação:
 * Nesta fase inicial, ainda não usamos:
 * - precisão
 * - crítico
 * - múltiplos alvos
 * - efeitos secundários complexos
 *
 * Isso pode ser expandido depois sem retrabalho.
 */

export const SKILLS = {
  claw_attack: {
    id: "claw_attack",
    name: "Claw Attack",
    kind: "attack",
    power: 18,
    cost: 3,
    element: "Neutral",
    scaling: "atk"
  },

  body_slam: {
    id: "body_slam",
    name: "Body Slam",
    kind: "attack",
    power: 20,
    cost: 4,
    element: "Neutral",
    scaling: "atk"
  },

  bubble_pop: {
    id: "bubble_pop",
    name: "Bubble Pop",
    kind: "attack",
    power: 16,
    cost: 3,
    element: "Water",
    scaling: "int"
  },

  headbutt: {
    id: "headbutt",
    name: "Headbutt",
    kind: "attack",
    power: 17,
    cost: 3,
    element: "Neutral",
    scaling: "atk"
  },

  petit_bite: {
    id: "petit_bite",
    name: "Petit Bite",
    kind: "attack",
    power: 16,
    cost: 3,
    element: "Neutral",
    scaling: "atk"
  },

  pepper_breath: {
    id: "pepper_breath",
    name: "Pepper Breath",
    kind: "attack",
    power: 24,
    cost: 6,
    element: "Fire",
    scaling: "int"
  },

  horn_attack: {
    id: "horn_attack",
    name: "Horn Attack",
    kind: "attack",
    power: 20,
    cost: 4,
    element: "Neutral",
    scaling: "atk"
  },

  blue_blaster: {
    id: "blue_blaster",
    name: "Blue Blaster",
    kind: "attack",
    power: 24,
    cost: 6,
    element: "Water",
    scaling: "int"
  },

  air_shot: {
    id: "air_shot",
    name: "Air Shot",
    kind: "attack",
    power: 22,
    cost: 5,
    element: "Wind",
    scaling: "int"
  },

  holy_tackle: {
    id: "holy_tackle",
    name: "Holy Tackle",
    kind: "attack",
    power: 20,
    cost: 4,
    element: "Light",
    scaling: "atk"
  },

  /**
   * Skill de cura inicial.
   *
   * Patamon é um bom candidato para começar a testar
   * a lógica de suporte/recuperação.
   */
  minor_heal: {
    id: "minor_heal",
    name: "Minor Heal",
    kind: "healing",
    cost: 8,
    target: "self",
    effect: {
      hpRestore: 28
    }
  },

  mega_flame: {
    id: "mega_flame",
    name: "Mega Flame",
    kind: "attack",
    power: 34,
    cost: 10,
    element: "Fire",
    scaling: "int"
  },

  great_horn_attack: {
    id: "great_horn_attack",
    name: "Great Horn Attack",
    kind: "attack",
    power: 30,
    cost: 8,
    element: "Neutral",
    scaling: "atk"
  },

  fox_fire: {
    id: "fox_fire",
    name: "Fox Fire",
    kind: "attack",
    power: 32,
    cost: 9,
    element: "Water",
    scaling: "int"
  },

  sharp_fang: {
    id: "sharp_fang",
    name: "Sharp Fang",
    kind: "attack",
    power: 28,
    cost: 7,
    element: "Neutral",
    scaling: "atk"
  },

  hand_of_fate: {
    id: "hand_of_fate",
    name: "Hand of Fate",
    kind: "attack",
    power: 34,
    cost: 10,
    element: "Light",
    scaling: "int"
  },

  heaven_knuckle: {
    id: "heaven_knuckle",
    name: "Heaven Knuckle",
    kind: "attack",
    power: 30,
    cost: 8,
    element: "Light",
    scaling: "atk"
  }
};

/**
 * Retorna uma skill pelo ID.
 *
 * @param {string} skillId
 * @returns {object|null}
 */
export function getSkillById(skillId) {
  return SKILLS[skillId] || null;
}

/**
 * Mapeamento inicial de skills por espécie.
 *
 * Regras desta fase:
 * - cada espécie tem uma lista simples de skills disponíveis
 * - por enquanto, as primeiras 4 podem ser tratadas como skills ativas visuais
 * - a IA de batalha pode decidir qual usar
 */
export const SPECIES_SKILLS = {
  koromon: ["bubble_pop"],
  tsunomon: ["headbutt"],
  tokomon: ["petit_bite"],

  agumon: ["claw_attack", "pepper_breath"],
  gabumon: ["horn_attack", "blue_blaster"],

  /**
   * Patamon recebe uma skill de cura para começarmos
   * a testar a lógica de suporte em combate.
   */
  patamon: ["air_shot", "holy_tackle", "minor_heal"],

  greymon: ["great_horn_attack", "mega_flame"],
  garurumon: ["sharp_fang", "fox_fire"],
  angemon: ["heaven_knuckle", "hand_of_fate", "minor_heal"]
};

/**
 * Retorna a lista de skills de uma espécie.
 *
 * @param {string} speciesId
 * @returns {string[]}
 */
export function getSkillsForSpecies(speciesId) {
  return SPECIES_SKILLS[speciesId] || [];
}

/**
 * Retorna a skill automática padrão de uma espécie.
 *
 * Regra atual:
 * - usa a primeira skill cadastrada
 *
 * Mantida por compatibilidade com partes mais antigas do sistema.
 *
 * @param {string} speciesId
 * @returns {object|null}
 */
export function getDefaultSkillForSpecies(speciesId) {
  const skillIds = getSkillsForSpecies(speciesId);

  if (!skillIds.length) {
    return null;
  }

  return getSkillById(skillIds[0]);
}