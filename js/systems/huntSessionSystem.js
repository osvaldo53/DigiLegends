import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { getHuntById, rollHuntGenericDrop } from "../data/encounters.js";
import { getDigimonSpecies } from "../data/digimons.js";
import { getItemById } from "../data/items.js";
import { rollSpeciesDrops } from "../data/speciesDrops.js";
import { createEnemyDigimon } from "../factories/digimonFactory.js";
import { addItemToInventory, getInventoryEntry, useItemOnDigimon } from "./itemSystem.js";
import {
  startBattleFromHunt,
  startBattleFromScenario,
  performPlayerAutoAttack,
  performPlayerBattleAction,
  performPlayerDigimonSwitch,
  performEnemyAutoAttack,
  closeBattle,
  registerPlayerItemUse
} from "./battleSystem.js";

const TURN_CHARGE_DELAY_MS = 1600;
const ENEMY_RESPONSE_DELAY_MS = 900;
const RESOLVE_DELAY_MS = 1400;
const AUTO_ITEM_RESOURCES = ["hp", "sp"];
const DUNGEON_VIEWPORT = { cols: 11, rows: 9 };
const DUNGEON_START_POSITION = { x: 2, y: 3, facing: "down" };
const HUNT_DIRECTIONS = {
  up: { x: 0, y: -1, facing: "up" },
  down: { x: 0, y: 1, facing: "down" },
  left: { x: -1, y: 0, facing: "left" },
  right: { x: 1, y: 0, facing: "right" }
};

let huntTimer = null;

function rerender() {
  window.dispatchEvent(new Event("digilegends:rerender"));
}

function getActiveBattlePlayerDigimon() {
  const activeUid = state.battle.playerDigimonUid;

  return (
    state.save.party.find(
      (digimon) => digimon.uid === activeUid && (digimon.currentHP ?? 0) > 0
    ) || null
  );
}

function isAutoBattleEnabled() {
  return state.save.combat?.autoBattleEnabled !== false;
}

function setPhase(label, durationMs = 0) {
  state.huntSession.phaseLabel = label;
  state.huntSession.phaseDurationMs = durationMs;
  state.huntSession.phaseStartedAt = durationMs > 0 ? Date.now() : 0;
}

function clearHuntTimer() {
  if (huntTimer) {
    clearTimeout(huntTimer);
    huntTimer = null;
  }
}

function scheduleNextStep(callback, delay) {
  clearHuntTimer();
  huntTimer = setTimeout(() => {
    callback();
  }, delay);
}

function getEnemySpeciesIdFromPoolEntry(entry) {
  return typeof entry === "string" ? entry : entry?.speciesId || null;
}

function getHuntEnemySpeciesPool(hunt) {
  return (hunt?.enemyPool || [])
    .map(getEnemySpeciesIdFromPoolEntry)
    .filter(Boolean);
}

function getHuntTheme(hunt) {
  const stageLabel = String(hunt?.stageLabel || "").toLowerCase();

  if (stageLabel.includes("mega")) return "mega";
  if (stageLabel.includes("ultimate")) return "ultimate";
  if (stageLabel.includes("champion")) return "champion";
  if (stageLabel.includes("rookie")) return "rookie";
  return "training";
}

function getTileKey(x, y) {
  return `${x},${y}`;
}

function createFilledGrid(width, height, tile = "#") {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => tile));
}

function carveRect(grid, rect) {
  for (let y = rect.y; y < rect.y + rect.h; y += 1) {
    for (let x = rect.x; x < rect.x + rect.w; x += 1) {
      if (grid[y]?.[x] !== undefined) {
        grid[y][x] = ".";
      }
    }
  }
}

function carveHorizontal(grid, xA, xB, y) {
  const minX = Math.min(xA, xB);
  const maxX = Math.max(xA, xB);

  for (let x = minX; x <= maxX; x += 1) {
    if (grid[y]?.[x] !== undefined) {
      grid[y][x] = ".";
    }
  }
}

function carveVertical(grid, yA, yB, x) {
  const minY = Math.min(yA, yB);
  const maxY = Math.max(yA, yB);

  for (let y = minY; y <= maxY; y += 1) {
    if (grid[y]?.[x] !== undefined) {
      grid[y][x] = ".";
    }
  }
}

function carvePath(grid, points) {
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const next = points[index];

    carveHorizontal(grid, previous.x, next.x, previous.y);
    carveVertical(grid, previous.y, next.y, next.x);
  }
}

function gridToRows(grid) {
  return grid.map((row) => row.join(""));
}

function buildFloorRows(width, height, rooms, paths) {
  const grid = createFilledGrid(width, height);

  rooms.forEach((room) => carveRect(grid, room));
  paths.forEach((path) => carvePath(grid, path));

  return gridToRows(grid);
}

function getSpeciesFromPool(speciesPool, index) {
  if (!speciesPool.length) {
    return "koromon";
  }

  return speciesPool[index % speciesPool.length];
}

function getBossSpeciesId(speciesPool) {
  return getSpeciesFromPool(speciesPool, speciesPool.length - 1);
}

function getDungeonLevelRange(hunt) {
  const min = Math.max(1, Number(hunt.levelRange?.min ?? hunt.minLevel ?? 1));
  const max = Math.max(min, Number(hunt.levelRange?.max ?? min + 2));

  return { min, max };
}

function createDungeonFloor({
  id,
  name,
  width,
  height,
  rooms,
  paths,
  entrance,
  portal = null,
  exit = null,
  encounters = [],
  chests = [],
  boss = null
}) {
  return {
    id,
    name,
    width,
    height,
    rows: buildFloorRows(width, height, rooms, paths),
    entrance,
    portal,
    exit,
    encounters,
    chests,
    boss,
    discovered: []
  };
}

function createDungeonFloors(hunt) {
  const speciesPool = getHuntEnemySpeciesPool(hunt);
  const levelRange = getDungeonLevelRange(hunt);
  const baseBits = Math.max(8, Number(hunt.rewards?.bits ?? 10));
  const bossLevel = Math.max(levelRange.max + 1, levelRange.min + 3);

  const floorOne = createDungeonFloor({
    id: `${hunt.id}-f1`,
    name: "Andar 1",
    width: 40,
    height: 30,
    entrance: { x: 2, y: 3 },
    portal: { x: 36, y: 26, targetFloorIndex: 1 },
    rooms: [
      { x: 1, y: 1, w: 8, h: 5 },
      { x: 12, y: 2, w: 7, h: 5 },
      { x: 24, y: 1, w: 7, h: 6 },
      { x: 31, y: 5, w: 7, h: 5 },
      { x: 5, y: 10, w: 8, h: 6 },
      { x: 17, y: 10, w: 8, h: 5 },
      { x: 29, y: 12, w: 8, h: 6 },
      { x: 2, y: 20, w: 9, h: 7 },
      { x: 15, y: 21, w: 8, h: 6 },
      { x: 30, y: 22, w: 8, h: 6 }
    ],
    paths: [
      [
        { x: 5, y: 3 },
        { x: 15, y: 4 },
        { x: 27, y: 4 },
        { x: 34, y: 7 },
        { x: 33, y: 15 },
        { x: 21, y: 12 },
        { x: 9, y: 13 },
        { x: 6, y: 23 },
        { x: 19, y: 24 },
        { x: 34, y: 25 }
      ],
      [
        { x: 27, y: 4 },
        { x: 18, y: 12 },
        { x: 19, y: 24 }
      ],
      [
        { x: 34, y: 15 },
        { x: 36, y: 26 }
      ]
    ],
    encounters: [
      { id: `${hunt.id}-f1-e1`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 0), x: 15, y: 4 },
      { id: `${hunt.id}-f1-e2`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 1), x: 27, y: 3 },
      { id: `${hunt.id}-f1-e3`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 2), x: 9, y: 14 },
      { id: `${hunt.id}-f1-e4`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 3), x: 18, y: 24 },
      { id: `${hunt.id}-f1-e5`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 1), x: 32, y: 15 },
      { id: `${hunt.id}-f1-e6`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 0), x: 6, y: 22 }
    ],
    chests: [
      { id: `${hunt.id}-f1-c1`, x: 7, y: 4, opened: false, rewards: { bits: baseBits + 8 } },
      { id: `${hunt.id}-f1-c2`, x: 23, y: 13, opened: false, rewards: { itemId: "bandage", quantity: 1 } },
      { id: `${hunt.id}-f1-c3`, x: 31, y: 23, opened: false, rewards: { itemId: "small_sp_disk", quantity: 1 } }
    ]
  });

  const floorTwo = createDungeonFloor({
    id: `${hunt.id}-f2`,
    name: "Andar 2",
    width: 34,
    height: 26,
    entrance: { x: 2, y: 22 },
    exit: { x: 31, y: 3 },
    rooms: [
      { x: 1, y: 19, w: 8, h: 6 },
      { x: 11, y: 17, w: 7, h: 5 },
      { x: 22, y: 18, w: 7, h: 5 },
      { x: 6, y: 10, w: 8, h: 5 },
      { x: 18, y: 9, w: 7, h: 5 },
      { x: 26, y: 1, w: 7, h: 6 },
      { x: 2, y: 2, w: 8, h: 5 },
      { x: 13, y: 3, w: 7, h: 4 }
    ],
    paths: [
      [
        { x: 4, y: 22 },
        { x: 14, y: 19 },
        { x: 25, y: 20 },
        { x: 21, y: 11 },
        { x: 10, y: 12 },
        { x: 6, y: 4 },
        { x: 16, y: 5 },
        { x: 29, y: 4 }
      ],
      [
        { x: 14, y: 19 },
        { x: 10, y: 12 },
        { x: 21, y: 11 },
        { x: 29, y: 4 }
      ]
    ],
    encounters: [
      { id: `${hunt.id}-f2-e1`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 1), x: 14, y: 19 },
      { id: `${hunt.id}-f2-e2`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 2), x: 24, y: 20 },
      { id: `${hunt.id}-f2-e3`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 0), x: 10, y: 12 },
      { id: `${hunt.id}-f2-e4`, kind: "wild", speciesId: getSpeciesFromPool(speciesPool, 3), x: 16, y: 5 }
    ],
    chests: [
      { id: `${hunt.id}-f2-c1`, x: 7, y: 3, opened: false, rewards: { bits: baseBits + 16 } },
      { id: `${hunt.id}-f2-c2`, x: 22, y: 12, opened: false, rewards: { itemId: "small_recovery", quantity: 1 } }
    ],
    boss: {
      id: `${hunt.id}-f2-boss`,
      kind: "boss",
      speciesId: getBossSpeciesId(speciesPool),
      x: 29,
      y: 3,
      level: bossLevel,
      defeated: false,
      bonusStats: {
        hp: 24 + bossLevel * 3,
        sp: 8,
        atk: 4,
        def: 4,
        int: 4,
        spd: 2
      },
      rewards: {
        bits: baseBits * 3,
        exp: bossLevel * 5 + 18
      }
    }
  });

  return [floorOne, floorTwo];
}

function getCurrentFloor(map = state.huntSession.map) {
  return map?.floors?.[map.currentFloorIndex] || null;
}

function isInsideFloor(floor, x, y) {
  return Boolean(floor) && x >= 0 && x < floor.width && y >= 0 && y < floor.height;
}

function getFloorTile(floor, x, y) {
  if (!isInsideFloor(floor, x, y)) {
    return "#";
  }

  return floor.rows[y]?.charAt(x) || "#";
}

function isWallTile(floor, x, y) {
  return getFloorTile(floor, x, y) === "#";
}

function rememberDiscoveredTile(floor, x, y) {
  if (!isInsideFloor(floor, x, y)) {
    return;
  }

  const key = getTileKey(x, y);

  if (!floor.discovered.includes(key)) {
    floor.discovered.push(key);
  }
}

function discoverAroundPlayer(map = state.huntSession.map) {
  const floor = getCurrentFloor(map);

  if (!map || !floor) {
    return;
  }

  const halfCols = Math.floor(map.viewport.cols / 2);
  const halfRows = Math.floor(map.viewport.rows / 2);

  for (let y = map.player.y - halfRows; y <= map.player.y + halfRows; y += 1) {
    for (let x = map.player.x - halfCols; x <= map.player.x + halfCols; x += 1) {
      rememberDiscoveredTile(floor, x, y);
    }
  }
}

function createHuntMap(hunt) {
  const floors = createDungeonFloors(hunt);
  const firstFloor = floors[0];
  const player = {
    ...DUNGEON_START_POSITION,
    ...firstFloor.entrance
  };

  const map = {
    theme: getHuntTheme(hunt),
    viewport: { ...DUNGEON_VIEWPORT },
    currentFloorIndex: 0,
    floors,
    player,
    steps: 0,
    openedChests: 0,
    activeEncounter: null,
    lastEncounterId: null,
    message: "Dungeon iniciada. Explore ate encontrar o portal."
  };

  discoverAroundPlayer(map);
  return map;
}

function getMapEncounterAt(x, y) {
  const floor = getCurrentFloor();

  if (!floor) {
    return null;
  }

  const wildEncounter = floor.encounters.find((encounter) => {
    return !encounter.defeated && encounter.x === x && encounter.y === y;
  });

  if (wildEncounter) {
    return wildEncounter;
  }

  if (floor.boss && !floor.boss.defeated && floor.boss.x === x && floor.boss.y === y) {
    return floor.boss;
  }

  return null;
}

function getMapEncounterById(encounterId) {
  const floor = getCurrentFloor();

  if (!floor) {
    return null;
  }

  if (floor.boss?.id === encounterId && !floor.boss.defeated) {
    return floor.boss;
  }

  return floor.encounters.find((encounter) => {
    return !encounter.defeated && encounter.id === encounterId;
  }) || null;
}

function getChestAt(x, y) {
  const floor = getCurrentFloor();

  if (!floor) {
    return null;
  }

  return floor.chests.find((chest) => !chest.opened && chest.x === x && chest.y === y) || null;
}

function isPortalAt(floor, x, y) {
  return Boolean(floor?.portal && floor.portal.x === x && floor.portal.y === y);
}

function isExitAt(floor, x, y) {
  return Boolean(floor?.exit && floor.exit.x === x && floor.exit.y === y);
}

function ensureCanExplore() {
  if (!state.huntSession.active || state.huntSession.status !== "exploring") {
    throw new Error("Nao ha exploracao ativa.");
  }

  if (state.battle.active && !state.battle.result) {
    throw new Error("Nao e possivel mover durante uma batalha.");
  }

  if (!state.huntSession.map || !getCurrentFloor()) {
    throw new Error("Dungeon da hunt nao foi carregada.");
  }
}

function beginMapEncounter(encounter) {
  if (!state.huntSession.active || !encounter) {
    return;
  }

  const hunt = getHuntById(state.huntSession.huntId);
  const species = getDigimonSpecies(encounter.speciesId);
  const map = state.huntSession.map;

  clearHuntTimer();
  state.huntSession.status = "battling";
  state.huntSession.currentBattleNumber += 1;
  state.huntSession.totalBattles += 1;
  state.huntSession.turnOwner = null;

  if (map) {
    map.activeEncounter = {
      id: encounter.id,
      kind: encounter.kind || "wild",
      floorIndex: map.currentFloorIndex
    };
    map.lastEncounterId = encounter.id;
    map.message = `Encontro com ${species?.name || encounter.speciesId}.`;
  }

  if (encounter.kind === "boss") {
    const enemy = createEnemyDigimon(
      encounter.speciesId,
      encounter.level,
      encounter.bonusStats || {}
    );

    startBattleFromScenario({
      battleId: encounter.id,
      battleName: `${hunt?.name || "Dungeon"} - Guardiao da saida`,
      enemy,
      rewards: encounter.rewards,
      context: "hunt"
    });
  } else {
    startBattleFromHunt(state.huntSession.huntId, { speciesId: encounter.speciesId });
  }

  setPlayerTurnReady();
}

function rollBattleDrops(enemySpeciesId) {
  const drops = [];
  const genericDrop = rollHuntGenericDrop(state.huntSession.huntId);

  if (genericDrop) {
    drops.push(genericDrop);
  }

  return [...drops, ...rollSpeciesDrops(enemySpeciesId)];
}

function registerDrop(drop) {
  if (!drop) return;

  const existing = state.huntSession.drops.find((item) => item.id === drop.id);

  if (existing) {
    existing.quantity += drop.quantity;
  } else {
    state.huntSession.drops.push({ ...drop });
  }

  addItemToInventory(state.save, drop.id, drop.quantity);
}

function registerChestReward(chest) {
  if (!chest || chest.opened) {
    return null;
  }

  const reward = chest.rewards || {};
  const bits = Math.max(0, Number(reward.bits || 0));
  const itemId = reward.itemId || null;
  const quantity = Math.max(1, Number(reward.quantity || 1));
  const rewardParts = [];

  chest.opened = true;
  state.huntSession.map.openedChests += 1;

  if (bits > 0) {
    state.save.bits += bits;
    state.huntSession.totalBitsEarned += bits;
    rewardParts.push(`${bits} Bits`);
  }

  if (itemId) {
    const item = getItemById(itemId);

    registerDrop({
      id: itemId,
      itemId,
      name: item?.name || itemId,
      quantity
    });
    rewardParts.push(`${item?.name || itemId} x${quantity}`);
  }

  saveGame(state.save);
  return rewardParts.join(" + ") || "bau vazio";
}

function resolveActiveMapEncounterVictory() {
  const map = state.huntSession.map;
  const activeEncounter = map?.activeEncounter;

  if (!map || !activeEncounter) {
    return;
  }

  const floor = map.floors[activeEncounter.floorIndex];

  if (!floor) {
    map.activeEncounter = null;
    return;
  }

  if (activeEncounter.kind === "boss" && floor.boss?.id === activeEncounter.id) {
    floor.boss.defeated = true;
    map.message = "Guardiao derrotado. A saida foi liberada.";
    map.activeEncounter = null;
    return;
  }

  const defeatedEncounter = floor.encounters.find(
    (encounter) => encounter.id === activeEncounter.id
  );

  if (defeatedEncounter) {
    defeatedEncounter.defeated = true;
  }

  map.message = "Sinal eliminado. Continue explorando.";
  map.activeEncounter = null;
}

function moveToNextDungeonFloor(floor) {
  const map = state.huntSession.map;
  const nextFloorIndex = Number(floor.portal?.targetFloorIndex ?? map.currentFloorIndex + 1);
  const nextFloor = map.floors[nextFloorIndex];

  if (!nextFloor) {
    map.message = "O portal esta instavel.";
    return {
      changedFloor: false
    };
  }

  map.currentFloorIndex = nextFloorIndex;
  map.player = {
    ...map.player,
    ...nextFloor.entrance,
    facing: "down"
  };
  map.message = `${nextFloor.name} acessado. Encontre a sala da saida.`;
  discoverAroundPlayer(map);

  return {
    changedFloor: true,
    floorIndex: nextFloorIndex
  };
}

function isExitUnlocked(floor) {
  return !floor?.boss || Boolean(floor.boss.defeated);
}

function completeDungeonRun() {
  const healedDigimons = restorePartyAfterHuntEnd();

  endHuntSession("completed", {
    completed: true,
    openedChests: state.huntSession.map?.openedChests || 0,
    reachedFloor: (state.huntSession.map?.currentFloorIndex || 0) + 1,
    healedDigimons,
    message: "Dungeon concluida. Seu time foi recuperado apos encontrar a saida."
  });
}

function resetActiveHuntSession() {
  state.huntSession.active = false;
  state.huntSession.huntId = null;
  state.huntSession.playerDigimonUid = null;
  state.huntSession.totalBattles = 0;
  state.huntSession.totalWins = 0;
  state.huntSession.totalDefeats = 0;
  state.huntSession.totalBitsEarned = 0;
  state.huntSession.totalExpEarned = 0;
  state.huntSession.totalTamerExpEarned = 0;
  state.huntSession.currentBattleNumber = 0;
  state.huntSession.turnOwner = null;
  state.huntSession.status = "stopped";
  state.huntSession.drops = [];
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;
  state.huntSession.pendingBattleItem = null;
  state.huntSession.map = null;
}

function clearPendingBattleItemSelection() {
  state.huntSession.pendingBattleItem = null;
}

function buildDropSummary() {
  return state.huntSession.drops.map((drop) => ({ ...drop }));
}

function restorePartyAfterHuntEnd() {
  const healedDigimons = [];

  for (const digimon of state.save.party) {
    const hpBefore = digimon.currentHP ?? 0;
    const spBefore = digimon.currentSP ?? 0;

    digimon.currentHP = digimon.finalStats.hp;
    digimon.currentSP = digimon.finalStats.sp;

    if (hpBefore < digimon.finalStats.hp || spBefore < digimon.finalStats.sp) {
      healedDigimons.push(
        getDigimonSpecies(digimon.speciesId)?.name || digimon.nickname || digimon.speciesId
      );
    }
  }

  return healedDigimons;
}

function finalizeHuntSummary(reason, options = {}) {
  const activeHuntId = state.huntSession.huntId;
  const activeHunt = activeHuntId ? getHuntById(activeHuntId) : null;

  state.huntSession.summary = {
    huntId: activeHuntId,
    huntName: activeHunt?.name || "",
    reason,
    totalBattles: state.huntSession.totalBattles,
    totalWins: state.huntSession.totalWins,
    totalDefeats: state.huntSession.totalDefeats,
    totalBitsEarned: state.huntSession.totalBitsEarned,
    totalExpEarned: state.huntSession.totalExpEarned,
    totalTamerExpEarned: state.huntSession.totalTamerExpEarned,
    drops: buildDropSummary(),
    penaltyBits: options.penaltyBits || 0,
    healedDigimons: options.healedDigimons || [],
    completed: Boolean(options.completed),
    openedChests: options.openedChests || 0,
    reachedFloor: options.reachedFloor || 0,
    message: options.message || ""
  };
}

function endHuntSession(reason, options = {}) {
  clearHuntTimer();

  if (!state.huntSession.active && !state.huntSession.huntId) {
    return;
  }

  finalizeHuntSummary(reason, options);
  resetActiveHuntSession();
  closeBattle();
  saveGame(state.save);
  rerender();
}

function getCombatSlot(resource) {
  return state.save.combat?.autoItemSlots?.[resource] || null;
}

function shouldTriggerAutoItem(playerDigimon, resource, slot) {
  if (!playerDigimon || !slot?.itemId) {
    return false;
  }

  const currentValue =
    resource === "sp" ? playerDigimon.currentSP ?? 0 : playerDigimon.currentHP ?? 0;
  const maxValue =
    resource === "sp" ? playerDigimon.finalStats.sp || 1 : playerDigimon.finalStats.hp || 1;
  const currentPercent = (currentValue / maxValue) * 100;

  return currentPercent <= Number(slot.thresholdPercent ?? 0);
}

function setPlayerTurnReady() {
  state.huntSession.turnOwner = "player";
  clearPendingBattleItemSelection();

  if (!state.battle.active || state.battle.result) {
    return;
  }

  if (isAutoBattleEnabled()) {
    setPhase("Carregando acao", TURN_CHARGE_DELAY_MS);
    rerender();
    scheduleNextStep(runAutoPlayerTurn, TURN_CHARGE_DELAY_MS);
    return;
  }

  clearHuntTimer();
  setPhase("Aguardando comando", 0);
  saveGame(state.save);
  rerender();
}

function scheduleEnemyTurn() {
  state.huntSession.turnOwner = "enemy";
  clearPendingBattleItemSelection();
  setPhase("Resposta inimiga", ENEMY_RESPONSE_DELAY_MS);
  saveGame(state.save);
  rerender();
  scheduleNextStep(runEnemyAction, ENEMY_RESPONSE_DELAY_MS);
}

function handlePostPlayerAction() {
  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  scheduleEnemyTurn();
}

function getTargetDigimonForBattleItem(item, targetDigimonUid = null) {
  const isReviveItem = Boolean(item?.effect?.revivePercent);

  if (isReviveItem) {
    if (targetDigimonUid) {
      const selectedDigimon = state.save.party.find((digimon) => digimon.uid === targetDigimonUid) || null;

      if (!selectedDigimon) {
        throw new Error("Digimon selecionado nao foi encontrado.");
      }

      if ((selectedDigimon.currentHP ?? 0) > 0) {
        throw new Error("Selecione um Digimon derrotado para usar o revive.");
      }

      return selectedDigimon;
    }

    return state.save.party.find((digimon) => (digimon.currentHP ?? 0) <= 0) || null;
  }

  if (targetDigimonUid) {
    const selectedDigimon = state.save.party.find((digimon) => digimon.uid === targetDigimonUid) || null;

    if (!selectedDigimon) {
      throw new Error("Digimon selecionado nao foi encontrado.");
    }

    return selectedDigimon;
  }

  return getActiveBattlePlayerDigimon();
}

function useBattleItemCore(itemId, targetDigimonUid = null) {
  const item = getItemById(itemId);
  const targetDigimon = getTargetDigimonForBattleItem(item, targetDigimonUid);

  if (!targetDigimon) {
    throw new Error(
      item?.effect?.revivePercent
        ? "Nao ha Digimon derrotado para reviver."
        : "Nao ha Digimon valido para usar o item."
    );
  }

  const previousStats = {
    hp: targetDigimon.currentHP ?? 0,
    sp: targetDigimon.currentSP ?? 0
  };

  const result = useItemOnDigimon({
    save: state.save,
    itemId,
    targetDigimon,
    context: "battle"
  });

  registerPlayerItemUse(result.item, result.target, previousStats);
  return result;
}

function tryUseConfiguredAutoItem() {
  const player = getActiveBattlePlayerDigimon();

  if (!player) {
    return null;
  }

  for (const resource of AUTO_ITEM_RESOURCES) {
    const slot = getCombatSlot(resource);
    const itemId = slot?.itemId;

    if (!itemId) {
      continue;
    }

    const inventoryEntry = getInventoryEntry(state.save, itemId);

    if (!inventoryEntry || inventoryEntry.quantity <= 0 || !shouldTriggerAutoItem(player, resource, slot)) {
      continue;
    }

    try {
      return useBattleItemCore(itemId);
    } catch {
      continue;
    }
  }

  return null;
}

function runAutoPlayerTurn() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;
  if (state.huntSession.turnOwner !== "player") return;

  const itemResult = tryUseConfiguredAutoItem();

  if (!itemResult) {
    performPlayerAutoAttack();
  }

  rerender();
  handlePostPlayerAction();
}

function runEnemyAction() {
  if (!state.huntSession.active) return;
  if (!state.battle.active || state.battle.result) return;
  if (state.huntSession.turnOwner !== "enemy") return;

  performEnemyAutoAttack();
  rerender();

  if (state.battle.result) {
    finishBattleCycle();
    return;
  }

  setPlayerTurnReady();
}

function finishBattleCycle() {
  if (!state.huntSession.active) return;

  state.huntSession.turnOwner = null;
  state.huntSession.status = "resolving";

  if (state.battle.result === "victory") {
    state.huntSession.totalWins += 1;
    state.huntSession.totalBitsEarned += state.battle.rewards?.bits || 0;
    state.huntSession.totalExpEarned += state.battle.rewards?.exp || 0;
    state.huntSession.totalTamerExpEarned =
      (state.huntSession.totalTamerExpEarned || 0) + (state.battle.rewards?.tamerExp || 0);

    const drops = rollBattleDrops(state.battle.enemy?.speciesId);
    drops.forEach((drop) => registerDrop(drop));
    resolveActiveMapEncounterVictory();
  }

  if (state.battle.result === "defeat") {
    state.huntSession.totalDefeats += 1;

    const healedDigimons = restorePartyAfterHuntEnd();
    const penaltyBits = state.battle.rewards?.bitsLost || 0;

    endHuntSession("defeat", {
      penaltyBits,
      healedDigimons,
      message: "Seu time foi derrotado e recebeu recuperacao completa para a proxima hunt."
    });
    return;
  }

  setPhase("Retornando ao mapa", RESOLVE_DELAY_MS);
  saveGame(state.save);
  rerender();

  scheduleNextStep(() => {
    closeBattle();

    if (!state.huntSession.active) return;

    state.huntSession.status = "exploring";
    state.huntSession.turnOwner = null;
    clearPendingBattleItemSelection();
    discoverAroundPlayer();
    setPhase("Explorando area", 0);
    rerender();
  }, RESOLVE_DELAY_MS);
}

export function clearHuntSummary() {
  state.huntSession.summary = null;
  rerender();
}

export function moveHuntPlayer(direction) {
  const movement = HUNT_DIRECTIONS[direction];

  if (!movement) {
    throw new Error("Direcao invalida.");
  }

  ensureCanExplore();

  const map = state.huntSession.map;
  const floor = getCurrentFloor(map);
  const nextX = map.player.x + movement.x;
  const nextY = map.player.y + movement.y;

  map.player.facing = movement.facing;

  if (!isInsideFloor(floor, nextX, nextY) || isWallTile(floor, nextX, nextY)) {
    map.message = "Caminho bloqueado.";
    rerender();
    return {
      moved: false,
      blocked: true,
      encounter: null,
      chest: null,
      portal: null,
      exit: null
    };
  }

  map.player.x = nextX;
  map.player.y = nextY;
  map.steps += 1;
  map.message = "Corredor explorado.";
  discoverAroundPlayer(map);

  const encounter = getMapEncounterAt(nextX, nextY);

  if (encounter) {
    beginMapEncounter(encounter);
    return {
      moved: true,
      blocked: false,
      encounter,
      chest: null,
      portal: null,
      exit: null
    };
  }

  const chest = getChestAt(nextX, nextY);

  if (chest) {
    const rewardLabel = registerChestReward(chest);

    map.message = `Bau aberto: ${rewardLabel}.`;
    rerender();

    return {
      moved: true,
      blocked: false,
      encounter: null,
      chest,
      portal: null,
      exit: null
    };
  }

  if (isPortalAt(floor, nextX, nextY)) {
    const portalResult = moveToNextDungeonFloor(floor);

    rerender();
    return {
      moved: true,
      blocked: false,
      encounter: null,
      chest: null,
      portal: portalResult,
      exit: null
    };
  }

  if (isExitAt(floor, nextX, nextY)) {
    if (!isExitUnlocked(floor)) {
      map.message = "A saida esta bloqueada pelo guardiao.";
      rerender();

      return {
        moved: true,
        blocked: false,
        encounter: null,
        chest: null,
        portal: null,
        exit: { completed: false }
      };
    }

    completeDungeonRun();
    return {
      moved: true,
      blocked: false,
      encounter: null,
      chest: null,
      portal: null,
      exit: { completed: true }
    };
  }

  rerender();
  return {
    moved: true,
    blocked: false,
    encounter: null,
    chest: null,
    portal: null,
    exit: null
  };
}

export function triggerHuntMapEncounter(encounterId) {
  ensureCanExplore();

  const encounter = getMapEncounterById(encounterId);

  if (!encounter) {
    throw new Error("Encontro nao encontrado no mapa.");
  }

  beginMapEncounter(encounter);
  return encounter;
}

export function getBattleItemEligibleTargets(itemId) {
  const item = getItemById(itemId);

  if (!item?.usableInBattle) {
    return [];
  }

  if (item.effect?.revivePercent) {
    return state.save.party.filter((digimon) => (digimon.currentHP ?? 0) <= 0);
  }

  const activeDigimon = getActiveBattlePlayerDigimon();
  return activeDigimon ? [activeDigimon] : [];
}

export function beginBattleItemTargetSelection(itemId) {
  const item = getItemById(itemId);

  if (!item?.usableInBattle) {
    throw new Error("Item nao pode ser usado em batalha.");
  }

  const targets = getBattleItemEligibleTargets(itemId);

  if (!targets.length) {
    throw new Error(
      item.effect?.revivePercent
        ? "Nao ha Digimon derrotado para reviver."
        : "Nao ha Digimon valido para usar o item."
    );
  }

  state.huntSession.pendingBattleItem = {
    itemId
  };
  rerender();

  return {
    item,
    targets
  };
}

export function cancelBattleItemTargetSelection() {
  if (!state.huntSession.pendingBattleItem) {
    return;
  }

  clearPendingBattleItemSelection();
  rerender();
}

export function startHuntSession(huntId) {
  const hunt = getHuntById(huntId);
  const player = state.save.party.find((digimon) => (digimon.currentHP ?? 0) > 0);

  if (!hunt) {
    throw new Error("Hunt invalida.");
  }

  if (!player) {
    throw new Error("Nao ha Digimon com HP suficiente no time.");
  }

  clearHuntTimer();
  state.huntSession.summary = null;

  state.huntSession.active = true;
  state.huntSession.huntId = huntId;
  state.huntSession.playerDigimonUid = player.uid;
  state.huntSession.totalBattles = 0;
  state.huntSession.totalWins = 0;
  state.huntSession.totalDefeats = 0;
  state.huntSession.totalBitsEarned = 0;
  state.huntSession.totalExpEarned = 0;
  state.huntSession.totalTamerExpEarned = 0;
  state.huntSession.currentBattleNumber = 0;
  state.huntSession.turnOwner = null;
  state.huntSession.status = "exploring";
  state.huntSession.drops = [];
  state.huntSession.phaseLabel = "";
  state.huntSession.phaseDurationMs = 0;
  state.huntSession.phaseStartedAt = 0;
  state.huntSession.pendingBattleItem = null;
  state.huntSession.map = createHuntMap(hunt, 0);

  setPhase("Explorando area", 0);
  rerender();
}

export function stopHuntSession() {
  const healedDigimons = restorePartyAfterHuntEnd();

  endHuntSession("manual", {
    healedDigimons,
    message: "Hunt encerrada pelo jogador. Seu time foi totalmente recuperado."
  });
}

export function toggleAutoBattleMode() {
  state.save.combat.autoBattleEnabled = !isAutoBattleEnabled();
  saveGame(state.save);

  if (state.huntSession.active && state.battle.active && !state.battle.result) {
    if (state.huntSession.turnOwner === "player") {
      setPlayerTurnReady();
    } else {
      rerender();
    }
    return;
  }

  rerender();
}

export function updateAutoItemSlot(resource, patch = {}) {
  const normalizedResource = resource === "sp" ? "sp" : "hp";
  const existingSlot = getCombatSlot(normalizedResource);

  if (!existingSlot) {
    return;
  }

  const nextItemId =
    patch.itemId === "" || patch.itemId === null
      ? null
      : typeof patch.itemId === "string"
        ? patch.itemId
        : existingSlot.itemId;

  state.save.combat.autoItemSlots[normalizedResource] = {
    ...existingSlot,
    itemId: nextItemId,
    thresholdPercent: Math.max(
      1,
      Math.min(
        100,
        Math.floor(
          Number.isFinite(Number(patch.thresholdPercent))
            ? Number(patch.thresholdPercent)
            : existingSlot.thresholdPercent
        )
      )
    )
  };

  saveGame(state.save);
  rerender();
}

export function performManualBattleAction(skillId = null) {
  if (!state.huntSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  if (state.huntSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearHuntTimer();
  performPlayerBattleAction(skillId);
  rerender();
  handlePostPlayerAction();
}

export function useBattleItemTurn(itemId, targetDigimonUid = null) {
  if (!state.huntSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  if (state.huntSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearHuntTimer();
  const result = useBattleItemCore(itemId, targetDigimonUid);
  clearPendingBattleItemSelection();
  rerender();
  handlePostPlayerAction();
  return result;
}

export function switchBattleDigimonTurn(nextDigimonUid) {
  if (!state.huntSession.active || !state.battle.active || state.battle.result) {
    throw new Error("Nao ha batalha ativa.");
  }

  if (state.huntSession.turnOwner !== "player") {
    throw new Error("Ainda nao e o turno do jogador.");
  }

  clearHuntTimer();
  performPlayerDigimonSwitch(nextDigimonUid);
  rerender();
  handlePostPlayerAction();
}
