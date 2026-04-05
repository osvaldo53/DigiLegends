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
    currentScreen: "title"
  },

  save: {
    version: 3,
    playerName: "",
    bits: 100,
    party: [],
    storage: [],
    digidex: {
      seen: [],
      owned: []
    },
    progress: {
      huntsCompleted: 0
    },
    inventory: []
  },

  /**
   * Estado da batalha atual.
   */
  battle: {
    active: false,
    huntId: null,
    playerDigimonUid: null,
    enemy: null,
    log: [],
    result: null, // null | "victory" | "defeat" | "fled"
    rewards: null,

    /**
     * Dados visuais usados pela UI durante a luta.
     * lastAction:
     * - actor: "player" | "enemy"
     * - target: "player" | "enemy"
     * - moveName: nome do ataque exibido
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
    currentBattleNumber: 0,
    status: "idle", // idle | searching | battling | resolving | stopped

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
     * phaseLabel:
     * - "Procurando inimigo"
     * - "Próximo turno"
     * - "Preparando próxima batalha"
     *
     * phaseDurationMs:
     * Duração da fase atual.
     *
     * phaseStartedAt:
     * Timestamp de início da fase.
     */
    phaseLabel: "",
    phaseDurationMs: 0,
    phaseStartedAt: 0
  }
};