import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { createEncounterFromHunt } from "./encounterSystem.js";
import { uniquePush, clamp } from "../core/utils.js";
import { applyBattleRewards } from "./progressionSystem.js";
import { calculateFinalDamage } from "./damageSystem.js";
import { getElementMultiplier } from "./elementChart.js";
import { getSkillsForSpecies, getSkillById } from "../data/skills.js";
import { addScanOnDefeat } from "./scanSystem.js";
import { setPartyLeader } from "./storageSystem.js";

const BASIC_ATTACK_SKILL = {
  id: "basic_attack",
  name: "Basic Attack",
  kind: "attack",
  power: 12,
  cost: 0,
  element: "Neutral",
  scaling: "atk"
};

function getActivePlayerDigimon() {
  const uid = state.battle.playerDigimonUid;
  return state.save.party.find((digimon) => digimon.uid === uid) || null;
}

function getFirstAvailablePartyDigimon() {
  return state.save.party.find((digimon) => (digimon.currentHP ?? 0) > 0) || null;
}

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

function switchActivePlayerDigimon(nextDigimon) {
  state.battle.playerDigimonUid = nextDigimon.uid;
  state.huntSession.playerDigimonUid = nextDigimon.uid;

  if (state.bossSession?.active) {
    state.bossSession.playerDigimonUid = nextDigimon.uid;
  }
}

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

function setLastItemAction(actor, target, item) {
  state.battle.lastAction = {
    actor,
    target,
    moveName: item.name,
    skillId: item.id,
    isBasicAttack: false,
    timestamp: Date.now()
  };
}

function setLastSwitchAction(previousDigimon, nextDigimon) {
  state.battle.lastAction = {
    actor: "player",
    target: "player",
    moveName: `Troca: ${nextDigimon.name}`,
    skillId: `switch:${previousDigimon.uid}:${nextDigimon.uid}`,
    isBasicAttack: false,
    timestamp: Date.now()
  };
}

function pushLog(message) {
  state.battle.log.unshift(message);
  state.battle.log = state.battle.log.slice(0, 16);
}

function getSpeciesSkills(speciesData) {
  if (!speciesData) return [];

  return getSkillsForSpecies(speciesData.id)
    .map((skillId) => getSkillById(skillId))
    .filter(Boolean);
}

function getUsableSkillsBySP(digimonInstance, skills) {
  return skills.filter((skill) => (digimonInstance.currentSP ?? 0) >= (skill.cost ?? 0));
}

function shouldUseHealingSkill(digimonInstance) {
  const hpRatio = (digimonInstance.currentHP ?? 0) / (digimonInstance.finalStats.hp || 1);
  return hpRatio < 0.5;
}

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

function chooseBestAttackSkill(skills, defenderSpecies) {
  if (!skills.length) return null;

  const scoredSkills = skills.map((skill) => {
    const elementMultiplier = getElementMultiplier(
      skill.element || "Neutral",
      defenderSpecies?.element || "Neutral"
    );

    return {
      skill,
      score: (skill.power || 0) * elementMultiplier
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

function resolvePlayerSkillSelection(player, playerSpecies, enemySpecies, skillId = null) {
  if (!skillId || skillId === BASIC_ATTACK_SKILL.id) {
    return {
      skill: BASIC_ATTACK_SKILL,
      isBasicAttack: true
    };
  }

  const availableSkills = getSpeciesSkills(playerSpecies);
  const selectedSkill = availableSkills.find((skill) => skill.id === skillId);

  if (!selectedSkill) {
    throw new Error("Skill invalida para este Digimon.");
  }

  if ((player.currentSP ?? 0) < (selectedSkill.cost ?? 0)) {
    throw new Error("SP insuficiente para usar esta skill.");
  }

  return {
    skill: selectedSkill,
    isBasicAttack: false
  };
}

function consumeSkillCost(digimonInstance, skill) {
  const currentSP = digimonInstance.currentSP ?? 0;
  digimonInstance.currentSP = clamp(
    currentSP - (skill.cost || 0),
    0,
    digimonInstance.finalStats.sp
  );
}

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
    parts.push("resistencia elemental");
  }

  if (!parts.length) {
    return "";
  }

  return ` (${parts.join(" + ")})`;
}

function finalizeVictory() {
  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;
  const battleRewards = state.battle.encounterRewards;

  if (!player || !enemy || !battleRewards) return;

  if (state.battle.context === "hunt") {
    state.save.progress.huntsCompleted += 1;
  }

  const progression = applyBattleRewards(player, battleRewards, state.save);
  const scanResult = addScanOnDefeat(state.save, enemy.speciesId);

  state.battle.result = "victory";
  state.battle.rewards = {
    ...battleRewards,
    gainedLevels: progression.gainedLevels,
    scanGained: scanResult.gained,
    scanTotal: scanResult.total,
    scannedSpeciesId: enemy.speciesId
  };

  pushLog(`Vitoria. Recompensas: +${battleRewards.bits} Bits, +${battleRewards.exp} EXP.`);
  pushLog(
    `Scan obtido: +${scanResult.gained}% de ${getDigimonSpecies(enemy.speciesId)?.name || enemy.speciesId} (total: ${scanResult.total}%).`
  );

  if (progression.gainedLevels > 0) {
    pushLog(
      `${getDigimonSpecies(player.speciesId)?.name || "Seu Digimon"} subiu ${progression.gainedLevels} nivel(is).`
    );
  }

  saveGame(state.save);
}

function finalizeDefeat() {
  const player = getActivePlayerDigimon();
  const penalty = 8;

  if (player) {
    player.currentHP = 0;
  }

  state.save.bits = Math.max(0, state.save.bits - penalty);

  state.battle.result = "defeat";
  state.battle.rewards = {
    bitsLost: penalty
  };

  pushLog(`Derrota. Penalidade: -${penalty} Bits.`);
  saveGame(state.save);
}

export function startBattleFromHunt(huntId) {
  const player = getFirstAvailablePartyDigimon();

  if (!player) {
    throw new Error("Nao ha Digimon com HP suficiente no time.");
  }

  const { hunt, enemy, rewards } = createEncounterFromHunt(huntId, player.level);
  startBattleFromScenario({
    battleId: hunt.id,
    battleName: hunt.name,
    enemy,
    rewards,
    context: "hunt"
  });
}

export function startBattleFromScenario({
  battleId,
  battleName,
  enemy,
  rewards,
  context = "skirmish"
}) {
  const player = getFirstAvailablePartyDigimon();

  if (!player) {
    throw new Error("Nao ha Digimon com HP suficiente no time.");
  }

  if (!enemy || !rewards) {
    throw new Error("Nao foi possivel iniciar a batalha configurada.");
  }

  uniquePush(state.save.digidex.seen, enemy.speciesId);

  state.battle = {
    active: true,
    huntId: battleId,
    context,
    sourceName: battleName || battleId,
    playerDigimonUid: player.uid,
    enemy,
    encounterRewards: rewards,
    log: [],
    result: null,
    rewards: null,
    lastAction: null
  };

  state.huntSession.playerDigimonUid = player.uid;

  if (state.bossSession?.active) {
    state.bossSession.playerDigimonUid = player.uid;
  }

  pushLog(`Encontro iniciado em ${battleName || "Batalha especial"}.`);
  pushLog(`Inimigo: ${getDigimonSpecies(enemy.speciesId)?.name || enemy.speciesId} Lv. ${enemy.level}.`);
  pushLog(`${getDigimonSpecies(player.speciesId)?.name || "Seu Digimon"} entrou em combate.`);

  saveGame(state.save);
}

export function performPlayerAutoAttack() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) return;

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const enemySpecies = getDigimonSpecies(enemy.speciesId);

  if (!playerSpecies || !enemySpecies) return;

  const { skill, isBasicAttack } = chooseSkillForBattle(player, playerSpecies, enemySpecies);
  return executePlayerAction(player, enemy, playerSpecies, enemySpecies, skill, isBasicAttack);
}

function executePlayerAction(player, enemy, playerSpecies, enemySpecies, skill, isBasicAttack) {
  if (!player || !enemy || !playerSpecies || !enemySpecies || !skill) {
    return;
  }

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

export function performPlayerBattleAction(skillId = null) {
  if (!state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  const player = getActivePlayerDigimon();
  const enemy = state.battle.enemy;

  if (!player || !enemy) {
    throw new Error("Nao foi possivel localizar os combatentes.");
  }

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const enemySpecies = getDigimonSpecies(enemy.speciesId);

  if (!playerSpecies || !enemySpecies) {
    throw new Error("Nao foi possivel carregar os dados da batalha.");
  }

  const { skill, isBasicAttack } = resolvePlayerSkillSelection(
    player,
    playerSpecies,
    enemySpecies,
    skillId
  );

  executePlayerAction(player, enemy, playerSpecies, enemySpecies, skill, isBasicAttack);
}

export function performPlayerDigimonSwitch(nextDigimonUid) {
  if (!state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  const currentDigimon = getActivePlayerDigimon();

  if (!currentDigimon) {
    throw new Error("Nao foi possivel localizar o Digimon ativo.");
  }

  const nextDigimon = state.save.party.find((digimon) => digimon.uid === nextDigimonUid);

  if (!nextDigimon) {
    throw new Error("Digimon selecionado nao foi encontrado no time.");
  }

  if (nextDigimon.uid === currentDigimon.uid) {
    throw new Error("Este Digimon ja esta em combate.");
  }

  if ((nextDigimon.currentHP ?? 0) <= 0) {
    throw new Error("Nao e possivel trocar para um Digimon derrotado.");
  }

  const currentSpeciesName =
    getDigimonSpecies(currentDigimon.speciesId)?.name ||
    currentDigimon.nickname ||
    currentDigimon.speciesId;
  const nextSpeciesName =
    getDigimonSpecies(nextDigimon.speciesId)?.name ||
    nextDigimon.nickname ||
    nextDigimon.speciesId;

  switchActivePlayerDigimon(nextDigimon);

  if (state.battle.context === "hunt") {
    setPartyLeader(state.save, nextDigimon.uid);
  }

  setLastSwitchAction(
    { uid: currentDigimon.uid, name: currentSpeciesName },
    { uid: nextDigimon.uid, name: nextSpeciesName }
  );
  pushLog(`${currentSpeciesName} recuou. ${nextSpeciesName} entrou em combate.`);
  saveGame(state.save);
}

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

export function performAutoBattleTurn() {
  performPlayerAutoAttack();

  if (state.battle.result) return;

  performEnemyAutoAttack();
}

export function performPlayerAttack() {
  performAutoBattleTurn();
}

export function registerPlayerItemUse(item, targetDigimon, previousStats = {}) {
  if (!item || !targetDigimon) {
    return;
  }

  const speciesName =
    getDigimonSpecies(targetDigimon.speciesId)?.name ||
    targetDigimon.nickname ||
    targetDigimon.speciesId;
  const healedHP = Math.max(0, (targetDigimon.currentHP ?? 0) - (previousStats.hp ?? 0));
  const healedSP = Math.max(0, (targetDigimon.currentSP ?? 0) - (previousStats.sp ?? 0));
  const recoveredParts = [];

  if (healedHP > 0) {
    recoveredParts.push(`${healedHP} HP`);
  }

  if (healedSP > 0) {
    recoveredParts.push(`${healedSP} SP`);
  }

  setLastItemAction("player", "player", item);
  pushLog(
    `${speciesName} usou ${item.name}${
      recoveredParts.length ? ` e recuperou ${recoveredParts.join(" e ")}.` : "."
    }`
  );
  saveGame(state.save);
}

export function fleeBattle() {
  if (!state.battle.active || state.battle.result) return;

  const player = getActivePlayerDigimon();

  if (player) {
    player.currentHP = Math.max(1, player.currentHP - 2);
  }

  state.battle.result = "fled";
  state.battle.rewards = null;

  pushLog("Voce fugiu da batalha. Penalidade leve de HP.");
  saveGame(state.save);
}

export function closeBattle() {
  state.battle = {
    active: false,
    huntId: null,
    context: "skirmish",
    sourceName: "",
    playerDigimonUid: null,
    enemy: null,
    encounterRewards: null,
    log: [],
    result: null,
    rewards: null,
    lastAction: null
  };

  state.huntSession.playerDigimonUid = null;

  if (state.bossSession) {
    state.bossSession.playerDigimonUid = null;
  }
}
