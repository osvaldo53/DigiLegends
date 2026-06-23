/**
 * Estado global da aplicação.
 *
 * Estrutura:
 * - app: estado geral da interface
 * - save: dados persistidos localmente
 * - battle: batalha atual
 * - huntSession: sessão AFK de hunt
 */
export const state = {
  app: {
    initialized: false,
    currentScreen: "title",
    evolutionAnimation: null
  },

  save: {
    version: 3,
    playerName: "",
    bits: 100,
    tamer: {
      level: 1,
      exp: 0
    },
    party: [],
    storage: [],
    digidex: {
      seen: [],
      owned: []
    },
    progress: {
      huntsCompleted: 0,
      bossesCompleted: 0
    },
    combat: {
      autoBattleEnabled: true,
      autoItemSlots: {
        hp: {
          itemId: "small_recovery",
          thresholdPercent: 55
        },
        sp: {
          itemId: "small_sp_disk",
          thresholdPercent: 25
        }
      }
    },
    training: {
      jobs: []
    },
    inventory: [],
    scanData: {}
  },

  /**
   * Estado da batalha atual.
   */
  battle: {
    active: false,
    huntId: null,
    context: "skirmish",
    sourceName: "",
    playerDigimonUid: null,
    enemy: null,
    encounterRewards: null,
    log: [],
    result: null, // null | "victory" | "defeat" | "fled"
    rewards: null,

    /**
     * Dados visuais usados pela UI durante a luta.
     * lastAction:
     * - actor: "player" | "enemy"
     * - target: "player" | "enemy"
     * - moveName: nome da ação exibida
     * - timestamp: momento da ação
     */
    lastAction: null
  },

  /**
   * Sessão AFK atual.
   */
  huntSession: {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    totalBattles: 0,
    totalWins: 0,
    totalDefeats: 0,
    totalBitsEarned: 0,
    totalExpEarned: 0,
    totalTamerExpEarned: 0,
    currentBattleNumber: 0,
    turnOwner: null, // null | "player" | "enemy"
    status: "idle", // idle | exploring | battling | resolving | stopped

    /**
     * Itens acumulados durante a sessão.
     * Exemplo:
     * [
     *   { id: "small-data", name: "Small Data", quantity: 2 }
     * ]
     */
    drops: [],

    /**
     * Controle visual da barra de carregamento.
     */
    phaseLabel: "",
    phaseDurationMs: 0,
    phaseStartedAt: 0,
    summary: null,
    pendingBattleItem: null,
    map: null
  },

  bossSession: {
    active: false,
    bossId: null,
    playerDigimonUid: null,
    stageIndex: 0,
    totalBattles: 0,
    totalWins: 0,
    totalDefeats: 0,
    totalBitsEarned: 0,
    totalExpEarned: 0,
    totalTamerExpEarned: 0,
    turnOwner: null,
    status: "idle",
    drops: [],
    phaseLabel: "",
    phaseDurationMs: 0,
    phaseStartedAt: 0,
    summary: null,
    pendingBattleItem: null
  }
};
