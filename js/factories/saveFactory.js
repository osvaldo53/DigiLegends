import { SAVE_VERSION } from "../config/constants.js";

/**
 * Cria a estrutura base de um save novo.
 *
 * Observações:
 * - O inventário já começa com alguns itens de teste para acelerar o desenvolvimento.
 * - scanData guarda a porcentagem acumulada de scan por espécie.
 */
export function createEmptySave() {
  return {
    version: SAVE_VERSION,
    playerName: "",
    bits: 100,

    /**
     * Digimons ativos no time
     */
    party: [],

    /**
     * Digimons fora do time
     */
    storage: [],

    /**
     * Progresso do DigiDex
     */
    digidex: {
      seen: [],
      owned: []
    },

    /**
     * Progresso geral do jogo
     */
    progress: {
      huntsCompleted: 0
    },

    /**
     * Inventário do jogador
     */
    inventory: [
      { itemId: "bandage", quantity: 3 },
      { itemId: "small_recovery", quantity: 1 },
      { itemId: "small_sp_disk", quantity: 1 }
    ],

    /**
     * Dados de scan por espécie.
     *
     * Exemplo:
     * scanData: {
     *   agumon: 36,
     *   gabumon: 100
     * }
     */
    scanData: {}
  };
}