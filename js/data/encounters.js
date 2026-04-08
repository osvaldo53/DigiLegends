export const HUNTS = [
  {
    id: "training-grounds",
    name: "Campo de Treino",
    description: "Area inicial para testes de combate com Baby e In-Training.",
    minLevel: 1,
    rewards: { bits: 12, exp: 18 },
    rewardLabel: "12 Bits / 18 EXP",
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
    rewardLabel: "22 Bits / 28 EXP",
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
    rewardLabel: "45 Bits / 48 EXP",
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
    rewardLabel: "85 Bits / 92 EXP",
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
    rewardLabel: "135 Bits / 138 EXP",
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
  },
  {
    id: "virus-nightmare",
    name: "Pesadelo Virus",
    description:
      "Uma hunt tematica infestada por Digimons Virus. Formas iniciais aparecem mais, mas entidades finais ainda podem surgir raramente.",
    minLevel: 18,
    rewards: { bits: 30, exp: 36 },
    rewardLabel: "Variavel por estagio",
    enemyPool: [
      {
        speciesId: "tsumemon",
        weight: 17,
        rewards: { bits: 12, exp: 16 },
        levelRange: { min: 3, max: 6 }
      },
      {
        speciesId: "agumon_black",
        weight: 11,
        rewards: { bits: 28, exp: 34 },
        levelRange: { min: 7, max: 11 }
      },
      {
        speciesId: "keramon",
        weight: 11,
        rewards: { bits: 30, exp: 36 },
        levelRange: { min: 7, max: 11 }
      },
      {
        speciesId: "demidevimon",
        weight: 11,
        rewards: { bits: 28, exp: 34 },
        levelRange: { min: 7, max: 11 }
      },
      {
        speciesId: "greymon_blue",
        weight: 10,
        rewards: { bits: 48, exp: 56 },
        levelRange: { min: 13, max: 18 }
      },
      {
        speciesId: "chrysalimon",
        weight: 9,
        rewards: { bits: 50, exp: 58 },
        levelRange: { min: 13, max: 18 }
      },
      {
        speciesId: "devimon",
        weight: 9,
        rewards: { bits: 48, exp: 56 },
        levelRange: { min: 13, max: 18 }
      },
      {
        speciesId: "metalgreymon_blue",
        weight: 4,
        rewards: { bits: 88, exp: 98 },
        levelRange: { min: 23, max: 30 }
      },
      {
        speciesId: "infermon",
        weight: 4,
        rewards: { bits: 94, exp: 106 },
        levelRange: { min: 24, max: 31 }
      },
      {
        speciesId: "myotismon",
        weight: 5,
        rewards: { bits: 92, exp: 104 },
        levelRange: { min: 24, max: 31 }
      },
      {
        speciesId: "blackwargreymon",
        weight: 3,
        rewards: { bits: 145, exp: 156 },
        levelRange: { min: 34, max: 42 }
      },
      {
        speciesId: "venommyotismon",
        weight: 3,
        rewards: { bits: 148, exp: 160 },
        levelRange: { min: 35, max: 42 }
      },
      {
        speciesId: "diaboromon",
        weight: 3,
        rewards: { bits: 160, exp: 172 },
        levelRange: { min: 36, max: 44 }
      }
    ]
  }
];

export function getHuntById(huntId) {
  return HUNTS.find((hunt) => hunt.id === huntId) || null;
}
