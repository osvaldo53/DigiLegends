import { getAllDigimonSpecies } from "../data/digimons.js";

export function getDigiDexEntries(save) {
  const seen = new Set(save.digidex.seen || []);
  const owned = new Set(save.digidex.owned || []);

  return getAllDigimonSpecies().map((species) => ({
    ...species,
    seen: seen.has(species.id),
    owned: owned.has(species.id)
  }));
}
