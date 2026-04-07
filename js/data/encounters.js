export const HUNTS = [
  {
    id: "training-grounds",
    name: "Campo de Treino",
    description: "Area inicial para testes de combate com Baby e In-Training.",
    minLevel: 1,
    rewards: { bits: 12, exp: 18 },
    enemyPool: [
      "koromon",
      "tsunomon",
      "tokomon",
      "tanemon",
      "motimon",
      "bukamon",
      "yokomon",
      "demiveemon"
    ]
  },
  {
    id: "rookie-forest",
    name: "Floresta Rookie",
    description: "Primeira area de risco moderado, com inimigos Rookie.",
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
    description: "Area avancada para testes com inimigos Champion.",
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
    name: "Dominio Ultimate",
    description: "Area de alto risco com Digimons Ultimate e recompensas superiores.",
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
  },
  {
    id: "mega-sanctuary",
    name: "Santuario Mega",
    description: "Area extrema para testar batalhas contra formas Mega.",
    minLevel: 30,
    rewards: { bits: 135, exp: 138 },
    enemyPool: [
      "wargreymon",
      "metalgarurumon",
      "seraphimon",
      "rosemon",
      "herculeskabuterimon",
      "vikemon",
      "phoenixmon",
      "ulforceveedramon"
    ]
  }
];

export function getHuntById(huntId) {
  return HUNTS.find((hunt) => hunt.id === huntId) || null;
}
