import { SAVE_VERSION } from "../config/constants.js";

export function createEmptySave() {
  return {
    version: SAVE_VERSION,
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
  };
}
