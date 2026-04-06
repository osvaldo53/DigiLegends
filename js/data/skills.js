/**
 * Banco de skills do jogo.
 */

export const SKILLS = {
  claw_attack: { id: "claw_attack", name: "Claw Attack", kind: "attack", power: 18, cost: 3, element: "Neutral", scaling: "atk" },
  body_slam: { id: "body_slam", name: "Body Slam", kind: "attack", power: 20, cost: 4, element: "Neutral", scaling: "atk" },
  bubble_pop: { id: "bubble_pop", name: "Bubble Pop", kind: "attack", power: 16, cost: 3, element: "Water", scaling: "int" },
  headbutt: { id: "headbutt", name: "Headbutt", kind: "attack", power: 17, cost: 3, element: "Neutral", scaling: "atk" },
  petit_bite: { id: "petit_bite", name: "Petit Bite", kind: "attack", power: 16, cost: 3, element: "Neutral", scaling: "atk" },

  pepper_breath: { id: "pepper_breath", name: "Pepper Breath", kind: "attack", power: 24, cost: 6, element: "Fire", scaling: "int" },
  horn_attack: { id: "horn_attack", name: "Horn Attack", kind: "attack", power: 20, cost: 4, element: "Neutral", scaling: "atk" },
  blue_blaster: { id: "blue_blaster", name: "Blue Blaster", kind: "attack", power: 24, cost: 6, element: "Water", scaling: "int" },
  air_shot: { id: "air_shot", name: "Air Shot", kind: "attack", power: 22, cost: 5, element: "Wind", scaling: "int" },
  holy_tackle: { id: "holy_tackle", name: "Holy Tackle", kind: "attack", power: 20, cost: 4, element: "Light", scaling: "atk" },

  minor_heal: { id: "minor_heal", name: "Minor Heal", kind: "healing", cost: 8, target: "self", effect: { hpRestore: 28 } },

  mega_flame: { id: "mega_flame", name: "Mega Flame", kind: "attack", power: 34, cost: 10, element: "Fire", scaling: "int" },
  great_horn_attack: { id: "great_horn_attack", name: "Great Horn Attack", kind: "attack", power: 30, cost: 8, element: "Neutral", scaling: "atk" },
  fox_fire: { id: "fox_fire", name: "Fox Fire", kind: "attack", power: 32, cost: 9, element: "Water", scaling: "int" },
  sharp_fang: { id: "sharp_fang", name: "Sharp Fang", kind: "attack", power: 28, cost: 7, element: "Neutral", scaling: "atk" },
  hand_of_fate: { id: "hand_of_fate", name: "Hand of Fate", kind: "attack", power: 34, cost: 10, element: "Light", scaling: "int" },
  heaven_knuckle: { id: "heaven_knuckle", name: "Heaven Knuckle", kind: "attack", power: 30, cost: 8, element: "Light", scaling: "atk" },

  poison_ivy: { id: "poison_ivy", name: "Poison Ivy", kind: "attack", power: 24, cost: 6, element: "Plant", scaling: "int" },
  needle_spray: { id: "needle_spray", name: "Needle Spray", kind: "attack", power: 22, cost: 5, element: "Plant", scaling: "atk" },

  super_shocker: { id: "super_shocker", name: "Super Shocker", kind: "attack", power: 25, cost: 6, element: "Electric", scaling: "int" },
  mega_blaster: { id: "mega_blaster", name: "Mega Blaster", kind: "attack", power: 33, cost: 9, element: "Electric", scaling: "int" },

  marching_fishes: { id: "marching_fishes", name: "Marching Fishes", kind: "attack", power: 22, cost: 5, element: "Water", scaling: "atk" },
  harpoon_torpedo: { id: "harpoon_torpedo", name: "Harpoon Torpedo", kind: "attack", power: 31, cost: 8, element: "Water", scaling: "atk" },

  spiral_twister: { id: "spiral_twister", name: "Spiral Twister", kind: "attack", power: 23, cost: 5, element: "Wind", scaling: "int" },
  meteor_wing: { id: "meteor_wing", name: "Meteor Wing", kind: "attack", power: 32, cost: 9, element: "Fire", scaling: "int" },

  vee_headbutt: { id: "vee_headbutt", name: "Vee Headbutt", kind: "attack", power: 21, cost: 4, element: "Neutral", scaling: "atk" },
  vee_laser: { id: "vee_laser", name: "Vee Laser", kind: "attack", power: 28, cost: 7, element: "Light", scaling: "int" },

  /* ===== NOVAS SKILLS ULTIMATE ===== */

  flower_cannon: {
    id: "flower_cannon",
    name: "Flower Cannon",
    kind: "attack",
    power: 38,
    cost: 11,
    element: "Plant",
    scaling: "int"
  },

  giga_blaster: {
    id: "giga_blaster",
    name: "Giga Blaster",
    kind: "attack",
    power: 40,
    cost: 12,
    element: "Electric",
    scaling: "int"
  },

  hammer_spark: {
    id: "hammer_spark",
    name: "Hammer Spark",
    kind: "attack",
    power: 38,
    cost: 10,
    element: "Water",
    scaling: "atk"
  },

  phoenix_blaze: {
    id: "phoenix_blaze",
    name: "Phoenix Blaze",
    kind: "attack",
    power: 40,
    cost: 12,
    element: "Fire",
    scaling: "int"
  },

  v_wing_blade: {
    id: "v_wing_blade",
    name: "V-Wing Blade",
    kind: "attack",
    power: 36,
    cost: 10,
    element: "Wind",
    scaling: "atk"
  }
};

/**
 * Retorna uma skill pelo ID.
 */
export function getSkillById(skillId) {
  return SKILLS[skillId] || null;
}

/**
 * Skills por espécie
 */
export const SPECIES_SKILLS = {
  koromon: ["bubble_pop"],
  tsunomon: ["headbutt"],
  tokomon: ["petit_bite"],

  agumon: ["claw_attack", "pepper_breath"],
  gabumon: ["horn_attack", "blue_blaster"],
  patamon: ["air_shot", "holy_tackle", "minor_heal"],

  greymon: ["great_horn_attack", "mega_flame"],
  garurumon: ["sharp_fang", "fox_fire"],
  angemon: ["heaven_knuckle", "hand_of_fate", "minor_heal"],

  palmon: ["needle_spray", "poison_ivy"],
  togemon: ["needle_spray", "poison_ivy"],
  lillymon: ["flower_cannon", "minor_heal"],

  tentomon: ["claw_attack", "super_shocker"],
  kabuterimon: ["horn_attack", "mega_blaster"],
  megakabuterimon: ["giga_blaster", "horn_attack"],

  gomamon: ["marching_fishes", "bubble_pop"],
  ikkakumon: ["harpoon_torpedo", "body_slam"],
  zudomon: ["hammer_spark", "body_slam"],

  biyomon: ["spiral_twister", "body_slam"],
  birdramon: ["meteor_wing", "spiral_twister"],
  garudamon: ["phoenix_blaze", "meteor_wing"],

  veemon: ["vee_headbutt", "vee_laser"],
  exveemon: ["vee_headbutt", "vee_laser"],
  aeroveedramon: ["v_wing_blade", "vee_laser"]
};

export function getSkillsForSpecies(speciesId) {
  return SPECIES_SKILLS[speciesId] || [];
}

export function getDefaultSkillForSpecies(speciesId) {
  const skills = getSkillsForSpecies(speciesId);
  return skills.length ? getSkillById(skills[0]) : null;
}