import { beforeEach, describe, expect, it, vi } from "vitest";
import { state } from "../js/core/state.js";
import { createEmptySave } from "../js/factories/saveFactory.js";
import { createPlayerDigimon } from "../js/factories/digimonFactory.js";
import {
  beginBattleItemTargetSelection,
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
      currentBattleNumber: 2,
      turnOwner: null,
      status: "searching",
      drops: [],
      phaseLabel: "",
      phaseDurationMs: 0,
      phaseStartedAt: 0,
      summary: null,
      pendingBattleItem: null
    };
    globalThis.window = globalThis.window || {};
    window.dispatchEvent = vi.fn();
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
