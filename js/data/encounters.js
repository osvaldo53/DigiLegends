export const HUNTS = [
  {
    id: "training-grounds",
    name: "Campo de Treino",
    description: "Área inicial para testes de combate e ganho básico de EXP.",
    minLevel: 1,
    rewards: { bits: 12, exp: 18 },
    enemyPool: ["koromon", "tsunomon", "tokomon"]
  },
  {
    id: "rookie-forest",
    name: "Floresta Rookie",
    description: "Primeira área de risco moderado, com inimigos Rookie.",
    minLevel: 3,
    rewards: { bits: 22, exp: 28 },
    enemyPool: [
      "agumon",
      "gabumon",
      "patamon",
      "palmon",
      "tentomon",
      "gomamon",
      "biyomon",
      "veemon"
    ]
  },
  {
    id: "champion-ridge",
    name: "Crista Champion",
    description: "Área avançada para testes com inimigos Champion.",
    minLevel: 8,
    rewards: { bits: 45, exp: 48 },
    enemyPool: [
      "greymon",
      "garurumon",
      "angemon",
      "togemon",
      "kabuterimon",
      "ikkakumon",
      "birdramon",
      "exveemon"
    ]
  },
  {
    id: "ultimate-domain",
    name: "Domínio Ultimate",
    description: "Área de alto risco com Digimons Ultimate e recompensas superiores.",
    minLevel: 18,
    rewards: { bits: 85, exp: 92 },
    enemyPool: [
      "metalgreymon",
      "weregarurumon",
      "holyangemon",
      "lillymon",
      "megakabuterimon",
      "zudomon",
      "garudamon",
      "aeroveedramon"
    ]
  }
];

export function getHuntById(huntId) {
  return HUNTS.find((hunt) => hunt.id === huntId) || null;
}