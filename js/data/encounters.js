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
    enemyPool: ["agumon", "gabumon", "patamon"]
  },
  {
    id: "champion-ridge",
    name: "Crista Champion",
    description: "Área avançada para testes. Ainda desequilibrada nesta fase do projeto.",
    minLevel: 8,
    rewards: { bits: 45, exp: 48 },
    enemyPool: ["greymon", "garurumon", "angemon"]
  }
];

export function getHuntById(huntId) {
  return HUNTS.find((hunt) => hunt.id === huntId) || null;
}
