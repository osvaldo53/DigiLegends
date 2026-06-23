import { beforeEach, describe, expect, it, vi } from "vitest";
import { state } from "../js/core/state.js";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  beginBattleItemTargetSelection,
  moveHuntPlayer,
  startHuntSession,
  stopHuntSession,
  switchBattleDigimonTurn,
  useBattleItemTurn
} from "../js/systems/huntSessionSystem.js";

describe("huntSessionSystem", () => {
  beforeEach(() => {
    state.save = createEmptySave();
    state.battle = {
      active: false,
      huntId: null,
      playerDigimonUid: null,
      enemy: null,
      encounterRewards: null,
      log: [],
      result: null,
      rewards: null,
      lastAction: null
    };
    state.huntSession = {
      active: true,
      huntId: "virus-nightmare",
      playerDigimonUid: null,
      totalBattles: 2,
      totalWins: 1,
      totalDefeats: 0,
      totalBitsEarned: 0,
      totalExpEarned: 0,
      totalTamerExpEarned: 0,
      currentBattleNumber: 2,
      turnOwner: null,
      status: "searching",
      drops: [],
      phaseLabel: "",
      phaseDurationMs: 0,
      phaseStartedAt: 0,
      summary: null,
      pendingBattleItem: null,
      map: null
    };
    globalThis.window = globalThis.window || {};
    window.dispatchEvent = vi.fn();
  });

  it("inicia a hunt em modo exploracao com mapa e encontros visiveis", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    expect(state.huntSession.active).toBe(true);
    expect(state.huntSession.status).toBe("exploring");
    expect(state.huntSession.map).toEqual(
      expect.objectContaining({
        theme: "training",
        currentFloorIndex: 0,
        viewport: { cols: 11, rows: 9 }
      })
    );
    expect(state.huntSession.map.floors).toHaveLength(2);
    expect(state.huntSession.map.floors[0]).toEqual(
      expect.objectContaining({
        width: 40,
        height: 30,
        name: "Andar 1"
      })
    );
    expect(state.huntSession.map.floors[0].encounters.slice(0, 4).map((encounter) => encounter.speciesId)).toEqual([
      "koromon",
      "tsunomon",
      "tokomon",
      "tsumemon"
    ]);
    expect(state.huntSession.map.floors[0].discovered).toContain("2,3");
    expect(state.battle.active).toBe(false);
  });

  it("move o jogador pelo mapa e bloqueia limites", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    const moved = moveHuntPlayer("left");
    const blocked = moveHuntPlayer("left");

    expect(moved).toEqual(expect.objectContaining({ moved: true, blocked: false }));
    expect(blocked).toEqual(expect.objectContaining({ moved: false, blocked: true }));
    expect(state.huntSession.map.player).toEqual(
      expect.objectContaining({ x: 1, y: 3, facing: "left" })
    );
    expect(state.huntSession.map.message).toBe("Caminho bloqueado.");
  });

  it("inicia uma batalha ao encostar em um Digimon do mapa", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.save.combat.autoBattleEnabled = false;
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    const targetEncounter = state.huntSession.map.floors[0].encounters.find(
      (encounter) => encounter.x === 15 && encounter.y === 4
    );

    for (let step = 0; step < 13; step += 1) {
      moveHuntPlayer("right");
    }

    const result = moveHuntPlayer("down");

    expect(result.encounter).toEqual(targetEncounter);
    expect(state.huntSession.status).toBe("battling");
    expect(state.huntSession.totalBattles).toBe(1);
    expect(state.huntSession.currentBattleNumber).toBe(1);
    expect(state.huntSession.turnOwner).toBe("player");
    expect(state.battle.active).toBe(true);
    expect(state.battle.context).toBe("hunt");
    expect(state.battle.enemy.speciesId).toBe(targetEncounter.speciesId);
  });

  it("abre baus e adiciona recompensas a sessao", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    state.huntSession.map.player = { x: 6, y: 4, facing: "right" };
    const bitsBefore = state.save.bits;
    const result = moveHuntPlayer("right");

    expect(result.chest).toBeTruthy();
    expect(result.chest.opened).toBe(true);
    expect(state.huntSession.map.openedChests).toBe(1);
    expect(state.save.bits).toBeGreaterThan(bitsBefore);
    expect(state.huntSession.totalBitsEarned).toBe(result.chest.rewards.bits);
  });

  it("usa portal para entrar no segundo andar", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    state.huntSession.map.player = { x: 35, y: 26, facing: "right" };
    const result = moveHuntPlayer("right");

    expect(result.portal).toEqual(expect.objectContaining({ changedFloor: true, floorIndex: 1 }));
    expect(state.huntSession.map.currentFloorIndex).toBe(1);
    expect(state.huntSession.map.player).toEqual(expect.objectContaining({ x: 2, y: 22 }));
    expect(state.huntSession.map.floors[1].discovered).toContain("2,22");
  });

  it("inicia batalha de boss na sala da saida", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.save.combat.autoBattleEnabled = false;
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    state.huntSession.map.currentFloorIndex = 1;
    state.huntSession.map.player = { x: 28, y: 3, facing: "right" };

    const result = moveHuntPlayer("right");

    expect(result.encounter?.kind).toBe("boss");
    expect(state.huntSession.status).toBe("battling");
    expect(state.battle.active).toBe(true);
    expect(state.battle.enemy.speciesId).toBe(state.huntSession.map.floors[1].boss.speciesId);
    expect(state.battle.enemy.finalStats.hp).toBeGreaterThan(
      state.battle.enemy.finalStats.atk
    );
  });

  it("bloqueia a saida ate o boss ser derrotado e conclui depois", () => {
    const digimon = createPlayerDigimon("agumon", { level: 8, bond: 5 });

    state.save.party = [digimon];
    state.huntSession.active = false;

    startHuntSession("training-bloom");

    state.huntSession.map.currentFloorIndex = 1;
    state.huntSession.map.player = { x: 30, y: 3, facing: "right" };

    const blockedExit = moveHuntPlayer("right");

    expect(blockedExit.exit).toEqual({ completed: false });
    expect(state.huntSession.active).toBe(true);

    state.huntSession.map.player = { x: 30, y: 3, facing: "right" };
    state.huntSession.map.floors[1].boss.defeated = true;

    const completedExit = moveHuntPlayer("right");

    expect(completedExit.exit).toEqual({ completed: true });
    expect(state.huntSession.active).toBe(false);
    expect(state.huntSession.summary?.reason).toBe("completed");
    expect(state.huntSession.summary?.completed).toBe(true);
  });

  it("cura e revive o time ao parar a hunt manualmente", () => {
    const digimonA = createPlayerDigimon("agumon", { level: 10, bond: 5 });
    const digimonB = createPlayerDigimon("gabumon", { level: 10, bond: 5 });

    digimonA.currentHP = 0;
    digimonA.currentSP = 1;
    digimonB.currentHP = 5;
    digimonB.currentSP = 0;

    state.save.party = [digimonA, digimonB];

    stopHuntSession();

    expect(digimonA.currentHP).toBe(digimonA.finalStats.hp);
    expect(digimonA.currentSP).toBe(digimonA.finalStats.sp);
    expect(digimonB.currentHP).toBe(digimonB.finalStats.hp);
    expect(digimonB.currentSP).toBe(digimonB.finalStats.sp);
    expect(state.huntSession.summary?.reason).toBe("manual");
    expect(state.huntSession.summary?.healedDigimons.length).toBe(2);
  });

  it("troca o Digimon ativo e consome o turno do jogador", () => {
    const digimonA = createPlayerDigimon("agumon", { level: 10, bond: 5 });
    const digimonB = createPlayerDigimon("gabumon", { level: 10, bond: 5 });

    state.save.party = [digimonA, digimonB];
    state.battle = {
      active: true,
      huntId: "training-woods",
      context: "hunt",
      playerDigimonUid: digimonA.uid,
      enemy: {
        speciesId: "betamon",
        level: 8,
        currentHP: 30,
        currentSP: 10,
        finalStats: {
          hp: 30,
          sp: 10,
          atk: 12,
          def: 8
        }
      },
      encounterRewards: null,
      log: [],
      result: null,
      rewards: null,
      lastAction: null
    };
    state.huntSession.active = true;
    state.huntSession.turnOwner = "player";
    state.huntSession.playerDigimonUid = digimonA.uid;

    switchBattleDigimonTurn(digimonB.uid);

    expect(state.battle.playerDigimonUid).toBe(digimonB.uid);
    expect(state.huntSession.playerDigimonUid).toBe(digimonB.uid);
    expect(state.save.party[0].uid).toBe(digimonB.uid);
    expect(state.huntSession.turnOwner).toBe("enemy");
    expect(state.battle.log[0]).toContain("entrou em combate");
  });

  it("permite escolher manualmente qual Digimon derrotado recebera o revive", () => {
    const digimonA = createPlayerDigimon("agumon", { level: 10, bond: 5 });
    const digimonB = createPlayerDigimon("gabumon", { level: 10, bond: 5 });

    digimonA.currentHP = 0;
    state.save.party = [digimonA, digimonB];
    state.save.inventory.push({ itemId: "revive", quantity: 1 });
    state.battle = {
      active: true,
      huntId: "training-woods",
      context: "hunt",
      playerDigimonUid: digimonB.uid,
      enemy: {
        speciesId: "betamon",
        level: 8,
        currentHP: 30,
        currentSP: 10,
        finalStats: {
          hp: 30,
          sp: 10,
          atk: 12,
          def: 8
        }
      },
      encounterRewards: null,
      log: [],
      result: null,
      rewards: null,
      lastAction: null
    };
    state.huntSession.active = true;
    state.huntSession.turnOwner = "player";
    state.huntSession.playerDigimonUid = digimonB.uid;

    const selection = beginBattleItemTargetSelection("revive");

    expect(selection.targets).toHaveLength(1);
    expect(selection.targets[0].uid).toBe(digimonA.uid);
    expect(state.huntSession.pendingBattleItem?.itemId).toBe("revive");

    useBattleItemTurn("revive", digimonA.uid);

    expect(digimonA.currentHP).toBe(Math.floor(digimonA.finalStats.hp * 0.5));
    expect(state.huntSession.pendingBattleItem).toBeNull();
    expect(state.huntSession.turnOwner).toBe("enemy");
  });
});
