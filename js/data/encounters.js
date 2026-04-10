import { getItemById } from "./items.js";

const GENERIC_DROP_PRESETS = {
  in_training: {
    chance: 0.35,
    items: [
      { itemId: "bandage", weight: 75 },
      { itemId: "small_recovery", weight: 25 }
    ]
  },
  rookie: {
    chance: 0.45,
    items: [
      { itemId: "bandage", weight: 45 },
      { itemId: "small_recovery", weight: 40 },
      { itemId: "small_sp_disk", weight: 15 }
    ]
  },
  champion: {
    chance: 0.55,
    items: [
      { itemId: "small_recovery", weight: 40 },
      { itemId: "small_sp_disk", weight: 35 },
      { itemId: "medium_recovery", weight: 25 }
    ]
  },
  ultimate: {
    chance: 0.65,
    items: [
      { itemId: "medium_recovery", weight: 40 },
      { itemId: "medium_sp_disk", weight: 30 },
      { itemId: "high_recovery", weight: 20 },
      { itemId: "revive", weight: 10 }
    ]
  },
  mega: {
    chance: 0.75,
    items: [
      { itemId: "high_recovery", weight: 36 },
      { itemId: "high_sp_disk", weight: 26 },
      { itemId: "revive", weight: 26 },
      { itemId: "revive_max", weight: 12 }
    ]
  }
};

export const HUNTS = [
  {
    id: "training-bloom",
    name: "Jardim Inicial",
    stageLabel: "In-Training",
    description: "Area tranquila para os primeiros testes de combate.",
    minLevel: 1,
    levelRange: { min: 1, max: 4 },
    rewards: { bits: 10 },
    expFormula: { multiplier: 2.5, base: 8 },
    rewardLabel: "10 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.in_training,
    enemyPool: ["koromon", "tsunomon", "tokomon", "tsumemon"]
  },
  {
    id: "training-stream",
    name: "Riacho de Treino",
    stageLabel: "In-Training",
    description: "Zona de treino leve com criaturas jovens e equilibradas.",
    minLevel: 1,
    levelRange: { min: 2, max: 5 },
    rewards: { bits: 12 },
    expFormula: { multiplier: 2.5, base: 7 },
    rewardLabel: "12 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.in_training,
    enemyPool: ["tanemon", "motimon", "bukamon", "yokomon"]
  },
  {
    id: "training-mist",
    name: "Neblina Jovem",
    stageLabel: "In-Training",
    description: "Ultima area introdutoria antes das hunts Rookie.",
    minLevel: 2,
    levelRange: { min: 3, max: 6 },
    rewards: { bits: 14 },
    expFormula: { multiplier: 2.5, base: 7 },
    rewardLabel: "14 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.in_training,
    enemyPool: ["demiveemon", "wanyamon", "nyaromon", "pagumon"]
  },
  {
    id: "rookie-forest",
    name: "Floresta Rookie",
    stageLabel: "Rookie",
    description: "Primeira zona Rookie, focada em linhas classicas.",
    minLevel: 4,
    levelRange: { min: 6, max: 10 },
    rewards: { bits: 24 },
    expFormula: { multiplier: 2, base: 14 },
    rewardLabel: "24 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.rookie,
    enemyPool: ["agumon", "gabumon", "patamon", "palmon", "tentomon"]
  },
  {
    id: "rookie-coast",
    name: "Costa Rookie",
    stageLabel: "Rookie",
    description: "Hunt intermediaria com linhas aquaticas, aereas e livres.",
    minLevel: 5,
    levelRange: { min: 8, max: 12 },
    rewards: { bits: 28 },
    expFormula: { multiplier: 2, base: 14 },
    rewardLabel: "28 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.rookie,
    enemyPool: ["gomamon", "biyomon", "veemon", "wormmon", "salamon"]
  },
  {
    id: "rookie-ravine",
    name: "Ravina Rookie",
    stageLabel: "Rookie",
    description: "Area com linhas draconicas e de alta mobilidade.",
    minLevel: 6,
    levelRange: { min: 10, max: 14 },
    rewards: { bits: 32 },
    expFormula: { multiplier: 2, base: 14 },
    rewardLabel: "32 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.rookie,
    enemyPool: ["dorumon", "dracomon", "guilmon", "gaomon", "terriermon"]
  },
  {
    id: "rookie-nightfall",
    name: "Crepusculo Rookie",
    stageLabel: "Rookie",
    description: "Zona mais perigosa, com foco em linhas sombrias e agressivas.",
    minLevel: 7,
    levelRange: { min: 11, max: 15 },
    rewards: { bits: 35 },
    expFormula: { multiplier: 2, base: 14 },
    rewardLabel: "35 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.rookie,
    enemyPool: ["agumon_black", "keramon", "demidevimon", "elecmon", "impmon"]
  },
  {
    id: "champion-ridge",
    name: "Crista Champion",
    stageLabel: "Champion",
    description: "Primeira hunt Champion, com foco em linhas centrais do roster.",
    minLevel: 10,
    levelRange: { min: 16, max: 22 },
    rewards: { bits: 48 },
    expFormula: { multiplier: 2, base: 16 },
    rewardLabel: "48 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.champion,
    enemyPool: ["greymon", "garurumon", "angemon", "togemon", "kabuterimon", "ikkakumon"]
  },
  {
    id: "champion-skyline",
    name: "Linha do Ceu",
    stageLabel: "Champion",
    description: "Area Champion veloz, com aves, bestas e insetos.",
    minLevel: 11,
    levelRange: { min: 18, max: 24 },
    rewards: { bits: 52 },
    expFormula: { multiplier: 2, base: 16 },
    rewardLabel: "52 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.champion,
    enemyPool: ["birdramon", "exveemon", "stingmon", "leomon", "gatomon", "gargomon"]
  },
  {
    id: "champion-draco",
    name: "Fronteira Draconica",
    stageLabel: "Champion",
    description: "Hunt Champion especializada em linhas de dragao e combate pesado.",
    minLevel: 12,
    levelRange: { min: 20, max: 26 },
    rewards: { bits: 56 },
    expFormula: { multiplier: 2, base: 16 },
    rewardLabel: "56 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.champion,
    enemyPool: [
      "growlmon",
      "tyrannomon",
      "geogreymon",
      "gaogamon",
      "coredramon_blue",
      "coredramon_green"
    ]
  },
  {
    id: "champion-abyss",
    name: "Abismo Champion",
    stageLabel: "Champion",
    description: "Zona Champion mais arriscada, misturando linhas obscuras e ferais.",
    minLevel: 13,
    levelRange: { min: 22, max: 28 },
    rewards: { bits: 60 },
    expFormula: { multiplier: 2, base: 16 },
    rewardLabel: "60 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.champion,
    enemyPool: [
      "devimon",
      "chrysalimon",
      "greymon_blue",
      "raptordramon",
      "ginryumon",
      "icedevimon",
      "blackgatomon"
    ]
  },
  {
    id: "ultimate-core",
    name: "Nucleo Ultimate",
    stageLabel: "Ultimate/Armor",
    description: "Primeira area de formas avancadas, com um Armor na rotacao.",
    minLevel: 18,
    levelRange: { min: 28, max: 36 },
    rewards: { bits: 86 },
    expFormula: { multiplier: 3, base: -2 },
    rewardLabel: "86 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.ultimate,
    enemyPool: [
      "metalgreymon",
      "weregarurumon",
      "holyangemon",
      "lillymon",
      "flamedramon",
      "grademon",
      "paildramon"
    ]
  },
  {
    id: "ultimate-storm",
    name: "Tempestade Ultimate",
    stageLabel: "Ultimate/Armor",
    description: "Area de pressao media com linhas mecanicas, marinhas e draconicas.",
    minLevel: 20,
    levelRange: { min: 30, max: 38 },
    rewards: { bits: 92 },
    expFormula: { multiplier: 3, base: -2 },
    rewardLabel: "92 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.ultimate,
    enemyPool: [
      "megakabuterimon",
      "zudomon",
      "garudamon",
      "aeroveedramon",
      "lighdramon",
      "hisyaryumon",
      "metalgreymon_blue"
    ]
  },
  {
    id: "ultimate-blaze",
    name: "Forja Ultimate",
    stageLabel: "Ultimate/Armor",
    description: "Zona ofensiva com linhas de impacto alto e um Armor de suporte.",
    minLevel: 22,
    levelRange: { min: 32, max: 40 },
    rewards: { bits: 98 },
    expFormula: { multiplier: 3, base: 0 },
    rewardLabel: "98 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.ultimate,
    enemyPool: [
      "wargrowlmon",
      "metaltyrannomon",
      "rizegreymon",
      "machgaogamon",
      "pegasusmon",
      "wingdramon",
      "groundramon"
    ]
  },
  {
    id: "ultimate-eclipse",
    name: "Eclipse Ultimate",
    stageLabel: "Ultimate/Armor",
    description: "A area mais perigosa das formas Ultimate, sem Armor na rotacao.",
    minLevel: 24,
    levelRange: { min: 34, max: 42 },
    rewards: { bits: 108 },
    expFormula: { multiplier: 3, base: 4 },
    rewardLabel: "108 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.ultimate,
    enemyPool: [
      "rapidmon",
      "angewomon",
      "grapleomon",
      "gigadramon",
      "skullsatamon",
      "ladydevimon",
      "infermon",
      "myotismon"
    ]
  },
  {
    id: "mega-sanctuary",
    name: "Santuario Mega",
    stageLabel: "Mega",
    description: "Primeira zona Mega com linhas heroicas e classicas.",
    minLevel: 30,
    levelRange: { min: 42, max: 50 },
    rewards: { bits: 138 },
    expFormula: { multiplier: 3, base: 4 },
    rewardLabel: "138 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.mega,
    enemyPool: [
      "wargreymon",
      "metalgarurumon",
      "seraphimon",
      "rosemon",
      "herculeskabuterimon",
      "vikemon",
      "phoenixmon"
    ]
  },
  {
    id: "mega-vanguard",
    name: "Vanguarda Mega",
    stageLabel: "Mega",
    description: "Area Mega com guerreiros sagrados e linhas draconicas nobres.",
    minLevel: 32,
    levelRange: { min: 45, max: 53 },
    rewards: { bits: 146 },
    expFormula: { multiplier: 3, base: 3 },
    rewardLabel: "146 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.mega,
    enemyPool: [
      "ulforceveedramon",
      "imperialdramon_dm",
      "alphamon",
      "ouryumon",
      "gallantmon",
      "rusttyrannomon",
      "shinegreymon"
    ]
  },
  {
    id: "mega-tempest",
    name: "Tempestade Mega",
    stageLabel: "Mega",
    description: "Hunt Mega veloz e tecnica, com linhas de vento, maquina e anjo.",
    minLevel: 34,
    levelRange: { min: 48, max: 56 },
    rewards: { bits: 154 },
    expFormula: { multiplier: 3, base: 2 },
    rewardLabel: "154 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.mega,
    enemyPool: [
      "miragegaogamon",
      "slayerdramon",
      "brakedramon",
      "megagargomon",
      "ophanimon",
      "magnadramon",
      "saberleomon"
    ]
  },
  {
    id: "mega-nightfall",
    name: "Crepusculo Mega",
    stageLabel: "Mega",
    description: "A area Mega mais hostil, com demon lords, maquinas e formas sombrias.",
    minLevel: 36,
    levelRange: { min: 50, max: 60 },
    rewards: { bits: 162 },
    expFormula: { multiplier: 3, base: 3 },
    rewardLabel: "162 Bits / EXP por nivel",
    genericDrops: GENERIC_DROP_PRESETS.mega,
    enemyPool: [
      "bancholeomon",
      "machinedramon",
      "beelzemon",
      "lilithmon",
      "blackwargreymon",
      "venommyotismon",
      "diaboromon"
    ]
  }
];

function getWeightedEntry(entries, randomFn = Math.random) {
  const totalWeight = entries.reduce((sum, entry) => sum + Number(entry.weight ?? 1), 0);
  let roll = randomFn() * totalWeight;

  for (const entry of entries) {
    roll -= Number(entry.weight ?? 1);

    if (roll < 0) {
      return entry;
    }
  }

  return entries[entries.length - 1] || null;
}

export function getHuntById(huntId) {
  return HUNTS.find((hunt) => hunt.id === huntId) || null;
}

export function rollHuntGenericDrop(huntId, randomFn = Math.random) {
  const hunt = getHuntById(huntId);
  const dropConfig = hunt?.genericDrops;

  if (!hunt || !dropConfig?.items?.length) {
    return null;
  }

  if (randomFn() >= Number(dropConfig.chance ?? 0)) {
    return null;
  }

  const selectedItem = getWeightedEntry(dropConfig.items, randomFn);

  if (!selectedItem) {
    return null;
  }

  return {
    id: selectedItem.itemId,
    itemId: selectedItem.itemId,
    name: getItemById(selectedItem.itemId)?.name || selectedItem.itemId,
    quantity: Number(selectedItem.quantity ?? 1)
  };
}
