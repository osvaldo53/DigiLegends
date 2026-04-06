import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getHuntById } from "../data/encounters.js";
import { createEncounterFromHunt } from "./encounterSystem.js";
import { uniquePush, clamp } from "../core/utils.js";
import { applyBattleRewards } from "./progressionSystem.js";
import { calculateFinalDamage } from "./damageSystem.js";
import { getElementMultiplier } from "./elementChart.js";
import { getSkillsForSpecies, getSkillById } from "../data/skills.js";
import { addScanOnDefeat } from "./scanSystem.js";

/**
 * Skill fallback usada quando o Digimon não possui skill válida
 * ou não tem SP suficiente para usar skills reais.
 */
const BASIC_ATTACK_SKILL = {
  id: "basic_attack",
  name: "Basic Attack",
  kind: "attack",
  power: 12,
  cost: 0,
  element: "Neutral",
  scaling: "atk"
};

/**
 * Retorna o Digimon ativo do jogador na batalha atual.
 */
function getActivePlayerDigimon() {
  const uid = state.battle.playerDigimonUid;
  return state.save.party.find((digimon) => digimon.uid === uid) || null;
}

/**
 * Retorna o próximo Digimon vivo da party.
 *
 * Regras:
 * - procura Digimons com HP > 0
 * - ignora o UID informado, quando necessário
 *
 * @param {string|null} excludedUid
 * @returns {object|null}
 */
function getNextAvailablePlayerDigimon(excludedUid = null) {
  return (
    state.save.party.find((digimon) => {
      if (excludedUid && digimon.uid === excludedUid) {
        return false;
      }

      return (digimon.currentHP ?? 0) > 0;
    }) || null
  );
}

/**
 * Troca o Digimon ativo em batalha.
 *
 * @param {object} nextDigimon
 */
function switchActivePlayerDigimon(nextDigimon) {
  state.battle.playerDigimonUid = nextDigimon.uid;
}

/**
 * Define o último evento visual da batalha.
 *
 * @param {"player"|"enemy"} actor
 * @param {"player"|"enemy"} target
 * @param {object} skill
 * @param {boolean} isBasicAttack
 */
function setLastAction(actor, target, skill, isBasicAttack = false) {
  state.battle.lastAction = {
    actor,
    target,
    moveName: skill.name,
    skillId: skill.id,
    isBasicAttack,
    timestamp: Date.now()
  };
}

/**
 * Adiciona uma linha ao log da batalha.
 */
function pushLog(message) {
  state.battle.log.unshift(message);
  state.battle.log = state.battle.log.slice(0, 16);
}

/**
 * Retorna a lista completa de skills reais que a espécie possui.
 *
 * @param {object} speciesData
 * @returns {object[]}
 */
function getSpeciesSkills(speciesData) {
  if (!speciesData) return [];

  return getSkillsForSpecies(speciesData.id)
    .map((skillId) => getSkillById(skillId))
    .filter(Boolean);
}

/**
 * Retorna skills utilizáveis com base no SP atual.
 *
 * @param {object} digimonInstance
 * @param {object[]} skills
 * @returns {object[]}
 */
function getUsableSkillsBySP(digimonInstance, skills) {
  return skills.filter((skill) => (digimonInstance.currentSP ?? 0) >= (skill.cost ?? 0));
}

/**
 * Verifica se o Digimon deve tentar usar cura.
 *
 * Regra:
 * - apenas com HP abaixo de 50%
 *
 * @param {object} digimonInstance
 * @returns {boolean}
 */
function shouldUseHealingSkill(digimonInstance) {
  const hpRatio = (digimonInstance.currentHP ?? 0) / (digimonInstance.finalStats.hp || 1);
  return hpRatio < 0.5;
}

/**
 * Escolhe a melhor skill de cura disponível.
 *
 * @param {object[]} skills
 * @returns {object|null}
 */
function chooseBestHealingSkill(skills) {
  if (!skills.length) return null;

  const sorted = [...skills].sort((a, b) => {
    const healA = a.effect?.hpRestore ?? 0;
    const healB = b.effect?.hpRestore ?? 0;

    if (healB !== healA) {
      return healB - healA;
    }

    return (a.cost ?? 0) - (b.cost ?? 0);
  });

  return sorted[0] || null;
}

/**
 * Escolhe a melhor skill ofensiva disponível.
 *
 * Critério:
 * - score = power * elementMultiplier
 * - em empate, menor custo de SP
 *
 * @param {object[]} skills
 * @param {object} defenderSpecies
 * @returns {object|null}
 */
function chooseBestAttackSkill(skills, defenderSpecies) {
  if (!skills.length) return null;

  const scoredSkills = skills.map((skill) => {
    const elementMultiplier = getElementMultiplier(
      skill.element || "Neutral",
      defenderSpecies?.element || "Neutral"
    );

    const score = (skill.power || 0) * elementMultiplier;

    return {
      skill,
      score
    };
  });

  scoredSkills.sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }

    return (a.skill.cost ?? 0) - (b.skill.cost ?? 0);
  });

  return scoredSkills[0]?.skill || null;
}

/**
 * Decide qual skill será usada.
 *
 * @param {object} digimonInstance
 * @param {object} attackerSpecies
 * @param {object} defenderSpecies
 * @returns {{ skill: object, isBasicAttack: boolean }}
 */
function chooseSkillForBattle(digimonInstance, attackerSpecies, defenderSpecies) {
  const allSkills = getSpeciesSkills(attackerSpecies);
  const usableSkills = getUsableSkillsBySP(digimonInstance, allSkills);

  if (!usableSkills.length) {
    return {
      skill: BASIC_ATTACK_SKILL,
      isBasicAttack: true
    };
  }

  const healingSkills = usableSkills.filter((skill) => skill.kind === "healing");
  const attackSkills = usableSkills.filter((skill) => skill.kind === "attack");

  if (shouldUseHealingSkill(digimonInstance) && healingSkills.length > 0) {
    const bestHealingSkill = chooseBestHealingSkill(healingSkills);

    if (bestHealingSkill) {
      return {
        skill: bestHealingSkill,
        isBasicAttack: false
      };
    }
  }

  const bestAttackSkill = chooseBestAttackSkill(attackSkills, defenderSpecies);

  if (bestAttackSkill) {
    return {
      skill: bestAttackSkill,
      isBasicAttack: false
    };
  }

  return {
    skill: BASIC_ATTACK_SKILL,
    isBasicAttack: true
  };
}

/**
 * Consome SP da skill usada.
 *
 * @param {object} digimonInstance
 * @param {object} skill
 */
function consumeSkillCost(digimonInstance, skill) {
  const currentSP = digimonInstance.currentSP ?? 0;
  digimonInstance.currentSP = clamp(
    currentSP - (skill.cost || 0),
    0,
    digimonInstance.finalStats.sp
  );
}

/**
 * Aplica o efeito de cura de uma skill no próprio usuário.
 *
 * @param {object} digimonInstance
 * @param {object} skill
 * @returns {number}
 */
function applyHealingSkill(digimonInstance, skill) {
  const healAmount = skill.effect?.hpRestore ?? 0;
  const beforeHP = digimonInstance.currentHP ?? 0;

  digimonInstance.currentHP = clamp(
    beforeHP + healAmount,
    0,
    digimonInstance.finalStats.hp
  );

  return digimonInstance.currentHP - beforeHP;
}

/**
 * Monta texto auxiliar para multiplicadores.
 *
 * @param {number} typeMultiplier
 * @param {number} elementMultiplier
 * @returns {string}
 */
function buildMultiplierText(typeMultiplier, elementMultiplier) {
  const parts = [];

  if (typeMultiplier > 1) {
    parts.push("vantagem de tipo");
  } else if (typeMultiplier < 1) {
    parts.push("desvantagem de tipo");
  }

  if (elementMultiplier > 1) {
    parts.push("vantagem elemental");
  } else if (elementMultiplier < 1) {
    parts.push("resistência elemental");
  }

  if (!parts.length) {
    return "";
  }

  return ` (${parts.join(" + ")})`;
}

/**
 * Finaliza a batalha com vitória.
 */
function finalizeVictory() {
  const player = getActivePlayerDigimon();
  const hunt = getHuntById(state.battle.huntId);
  const enemy = state.battle.enemy;

  if (!player || !hunt || !enemy) return;

  state.save.progress.huntsCompleted += 1;

  const progression = applyBattleRewards(player, hunt.rewards, state.save);
  const scanResult = addScanOnDefeat(state.save, enemy.speciesId);

  state.battle.result = "victory";
  state.battle.rewards = {
    ...hunt.rewards,
    gainedLevels: progression.gainedLevels,
    scanGained: scanResult.gained,
    scanTotal: scanResult.total,
    scannedSpeciesId: enemy.speciesId
  };

  pushLog(`Vitória. Recompensas: +${hunt.rewards.bits} Bits, +${hunt.rewards.exp} EXP.`);
  pushLog(
    `Scan obtido: +${scanResult.gained}% de ${getDigimonSpecies(enemy.speciesId)?.name || enemy.speciesId} (total: ${scanResult.total}%).`
  );

  if (progression.gainedLevels > 0) {
    pushLog(`${getDigimonSpecies(player.speciesId)?.name || "Seu Digimon"} subiu ${progression.gainedLevels} nível(is).`);
  }

  saveGame(state.save);
}

/**
 * Finaliza a batalha com derrota total da party.
 */
function finalizeDefeat() {
  const player = getActivePlayerDigimon();
  const penalty = 8;

  if (player) {
    player.currentHP = 1;
  }

  state.save.bits = Math.max(0, state.save.bits - penalty);

  state.battle.result = "defeat";
  state.battle.rewards = {
    bitsLost: penalty
  };

  pushLog(`Derrota. Penalidade: -${penalty} Bits.`);
  saveGame(state.save);
}

/**
 * Prepara uma nova batalha.
 */
export function startBattleFromHunt(huntId) {
  const player = state.save.party[0];

  if (!player) {
    throw new Error("Não há Digimon no time.");
  }

  const { hunt, enemy } = createEncounterFromHunt(huntId, player.level);

  uniquePush(state.save.digidex.seen, enemy.speciesId);

  state.battle = {
    active: true,
    huntId: hunt.id,
    playerDigimonUid: player.uid,
    enemy,
    log: [],
    result: null,
    rewards: null,
    lastAction: null
  };

  pushLog(`Encontro iniciado em ${hunt.name}.`);
  pushLog(`Inimigo: ${getDigimonSpecies(enemy.speciesId)?.name || enemy.speciesId} Lv. ${enemy.level}.`);
  pushLog(`${getDigimonSpecies(player.speciesId)?.name || "Seu Digimon"} entrou em combate.`);

  saveGame(state.save);
}

/**
 * Executa ação do jogador.
 */
export function performPlayerAutoAttack() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) return;

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const enemySpecies = getDigimonSpecies(enemy.speciesId);

  if (!playerSpecies || !enemySpecies) return;

  const { skill, isBasicAttack } = chooseSkillForBattle(player, playerSpecies, enemySpecies);

  consumeSkillCost(player, skill);
  setLastAction("player", "enemy", skill, isBasicAttack);

  if (skill.kind === "healing") {
    const healedAmount = applyHealingSkill(player, skill);
    pushLog(`${playerSpecies.name} usou ${skill.name} e recuperou ${healedAmount} de HP.`);
    saveGame(state.save);
    return;
  }

  const damageData = calculateFinalDamage({
    attacker: player,
    defender: enemy,
    skill,
    attackerSpecies: playerSpecies,
    defenderSpecies: enemySpecies
  });

  enemy.currentHP = clamp(
    enemy.currentHP - damageData.finalDamage,
    0,
    enemy.finalStats.hp
  );

  const multiplierText = buildMultiplierText(
    damageData.typeMultiplier,
    damageData.elementMultiplier
  );

  pushLog(
    `${playerSpecies.name} usou ${skill.name} e causou ${damageData.finalDamage} de dano${multiplierText}.`
  );

  if (enemy.currentHP <= 0) {
    finalizeVictory();
    return;
  }

  saveGame(state.save);
}

/**
 * Executa ação do inimigo.
 */
export function performEnemyAutoAttack() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) return;

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const enemySpecies = getDigimonSpecies(enemy.speciesId);

  if (!playerSpecies || !enemySpecies) return;

  const { skill, isBasicAttack } = chooseSkillForBattle(enemy, enemySpecies, playerSpecies);

  consumeSkillCost(enemy, skill);
  setLastAction("enemy", "player", skill, isBasicAttack);

  if (skill.kind === "healing") {
    const healedAmount = applyHealingSkill(enemy, skill);
    pushLog(`${enemySpecies.name} usou ${skill.name} e recuperou ${healedAmount} de HP.`);
    saveGame(state.save);
    return;
  }

  const damageData = calculateFinalDamage({
    attacker: enemy,
    defender: player,
    skill,
    attackerSpecies: enemySpecies,
    defenderSpecies: playerSpecies
  });

  player.currentHP = clamp(
    player.currentHP - damageData.finalDamage,
    0,
    player.finalStats.hp
  );

  const multiplierText = buildMultiplierText(
    damageData.typeMultiplier,
    damageData.elementMultiplier
  );

  pushLog(
    `${enemySpecies.name} usou ${skill.name} e causou ${damageData.finalDamage} de dano${multiplierText}.`
  );

  if (player.currentHP <= 0) {
    const defeatedSpeciesName = playerSpecies.name;
    const nextDigimon = getNextAvailablePlayerDigimon(player.uid);

    if (nextDigimon) {
      const nextSpecies = getDigimonSpecies(nextDigimon.speciesId);

      pushLog(`${defeatedSpeciesName} foi derrotado.`);
      switchActivePlayerDigimon(nextDigimon);
      pushLog(`${nextSpecies?.name || "Outro Digimon"} entrou em combate.`);
      saveGame(state.save);
      return;
    }

    finalizeDefeat();
    return;
  }

  saveGame(state.save);
}

/**
 * Compatibilidade com fluxo antigo.
 */
export function performAutoBattleTurn() {
  performPlayerAutoAttack();

  if (state.battle.result) return;

  performEnemyAutoAttack();
}

/**
 * Compatibilidade com o fluxo anterior.
 */
export function performPlayerAttack() {
  performAutoBattleTurn();
}

/**
 * Fuga manual.
 */
export function fleeBattle() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();

  if (player) {
    player.currentHP = Math.max(1, player.currentHP - 2);
  }

  state.battle.result = "fled";
  state.battle.rewards = null;

  pushLog("Você fugiu da batalha. Penalidade leve de HP.");
  saveGame(state.save);
}

/**
 * Limpa completamente o estado da batalha.
 */
export function closeBattle() {
  state.battle = {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    enemy: null,
    log: [],
    result: null,
    rewards: null,
    lastAction: null
  };
}