import { state } from "../core/state.js";
import { saveGame } from "../core/saveManager.js";
import { createEmptySave } from "../factories/saveFactory.js";
import { createPlayerDigimon } from "../factories/digimonFactory.js";
import { uniquePush } from "../core/utils.js";

export function startNewGame(playerName, starterSpeciesId) {
  const cleanName = String(playerName || "").trim();

  if (!cleanName) {
    throw new Error("Nome do jogador inválido.");
  }

  const save = createEmptySave();
  const starter = createPlayerDigimon(starterSpeciesId);

  save.playerName = cleanName;
  save.party = [starter];

  uniquePush(save.digidex.seen, starterSpeciesId);
  uniquePush(save.digidex.owned, starterSpeciesId);

  state.save = save;
  saveGame(state.save);

  return save;
}
