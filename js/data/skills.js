export const SKILLS = {
  claw_attack: { id: "claw_attack", name: "Claw Attack", kind: "attack", power: 18, cost: 3, element: "Neutral", scaling: "atk" },
  body_slam: { id: "body_slam", name: "Body Slam", kind: "attack", power: 20, cost: 4, element: "Neutral", scaling: "atk" },
  bubble_pop: { id: "bubble_pop", name: "Bubble Pop", kind: "attack", power: 16, cost: 3, element: "Water", scaling: "int" },
  headbutt: { id: "headbutt", name: "Headbutt", kind: "attack", power: 17, cost: 3, element: "Neutral", scaling: "atk" },
  petit_bite: { id: "petit_bite", name: "Petit Bite", kind: "attack", power: 16, cost: 3, element: "Neutral", scaling: "atk" },
  seed_blast: { id: "seed_blast", name: "Seed Blast", kind: "attack", power: 17, cost: 3, element: "Plant", scaling: "int" },
  static_buzz: { id: "static_buzz", name: "Static Buzz", kind: "attack", power: 17, cost: 3, element: "Electric", scaling: "int" },
  baby_flame: { id: "baby_flame", name: "Baby Flame", kind: "attack", power: 17, cost: 3, element: "Fire", scaling: "int" },
  vee_tackle: { id: "vee_tackle", name: "Vee Tackle", kind: "attack", power: 18, cost: 3, element: "Neutral", scaling: "atk" },
  bad_message: { id: "bad_message", name: "Bad Message", kind: "attack", power: 17, cost: 3, element: "Dark", scaling: "int" },

  pepper_breath: { id: "pepper_breath", name: "Pepper Breath", kind: "attack", power: 24, cost: 6, element: "Fire", scaling: "int" },
  black_pepper_breath: { id: "black_pepper_breath", name: "Black Pepper Breath", kind: "attack", power: 24, cost: 6, element: "Fire", scaling: "int" },
  horn_attack: { id: "horn_attack", name: "Horn Attack", kind: "attack", power: 20, cost: 4, element: "Neutral", scaling: "atk" },
  blue_blaster: { id: "blue_blaster", name: "Blue Blaster", kind: "attack", power: 24, cost: 6, element: "Water", scaling: "int" },
  air_shot: { id: "air_shot", name: "Air Shot", kind: "attack", power: 22, cost: 5, element: "Wind", scaling: "int" },
  holy_tackle: { id: "holy_tackle", name: "Holy Tackle", kind: "attack", power: 20, cost: 4, element: "Light", scaling: "atk" },
  web_wrecker: { id: "web_wrecker", name: "Web Wrecker", kind: "attack", power: 23, cost: 5, element: "Dark", scaling: "int" },
  evil_wing: { id: "evil_wing", name: "Evil Wing", kind: "attack", power: 22, cost: 5, element: "Dark", scaling: "int" },

  minor_heal: { id: "minor_heal", name: "Minor Heal", kind: "healing", cost: 8, target: "self", effect: { hpRestore: 28 } },
  greater_heal: { id: "greater_heal", name: "Greater Heal", kind: "healing", cost: 12, target: "self", effect: { hpRestore: 42 } },

  mega_flame: { id: "mega_flame", name: "Mega Flame", kind: "attack", power: 34, cost: 10, element: "Fire", scaling: "int" },
  great_horn_attack: { id: "great_horn_attack", name: "Great Horn Attack", kind: "attack", power: 30, cost: 8, element: "Neutral", scaling: "atk" },
  fox_fire: { id: "fox_fire", name: "Fox Fire", kind: "attack", power: 32, cost: 9, element: "Water", scaling: "int" },
  sharp_fang: { id: "sharp_fang", name: "Sharp Fang", kind: "attack", power: 28, cost: 7, element: "Neutral", scaling: "atk" },
  hand_of_fate: { id: "hand_of_fate", name: "Hand of Fate", kind: "attack", power: 34, cost: 10, element: "Light", scaling: "int" },
  heaven_knuckle: { id: "heaven_knuckle", name: "Heaven Knuckle", kind: "attack", power: 30, cost: 8, element: "Light", scaling: "atk" },
  giga_destroyer: { id: "giga_destroyer", name: "Giga Destroyer", kind: "attack", power: 40, cost: 12, element: "Fire", scaling: "int" },
  blue_mega_flame: { id: "blue_mega_flame", name: "Blue Mega Flame", kind: "attack", power: 34, cost: 10, element: "Fire", scaling: "int" },
  virus_breath: { id: "virus_breath", name: "Virus Breath", kind: "attack", power: 33, cost: 9, element: "Dark", scaling: "int" },
  trident_arm: { id: "trident_arm", name: "Trident Arm", kind: "attack", power: 36, cost: 10, element: "Neutral", scaling: "atk" },
  wolf_claw: { id: "wolf_claw", name: "Wolf Claw", kind: "attack", power: 39, cost: 11, element: "Water", scaling: "atk" },
  kaiser_nail: { id: "kaiser_nail", name: "Kaiser Nail", kind: "attack", power: 35, cost: 9, element: "Neutral", scaling: "atk" },
  heavens_gate: { id: "heavens_gate", name: "Heavens Gate", kind: "attack", power: 40, cost: 12, element: "Light", scaling: "int" },
  excalibur_slash: { id: "excalibur_slash", name: "Excalibur Slash", kind: "attack", power: 36, cost: 10, element: "Light", scaling: "atk" },
  nightmare_claw: { id: "nightmare_claw", name: "Nightmare Claw", kind: "attack", power: 36, cost: 10, element: "Dark", scaling: "atk" },
  data_crusher: { id: "data_crusher", name: "Data Crusher", kind: "attack", power: 37, cost: 10, element: "Dark", scaling: "atk" },

  poison_ivy: { id: "poison_ivy", name: "Poison Ivy", kind: "attack", power: 24, cost: 6, element: "Plant", scaling: "int" },
  needle_spray: { id: "needle_spray", name: "Needle Spray", kind: "attack", power: 22, cost: 5, element: "Plant", scaling: "atk" },
  flower_cannon: { id: "flower_cannon", name: "Flower Cannon", kind: "attack", power: 38, cost: 11, element: "Plant", scaling: "int" },
  forbidden_temptation: { id: "forbidden_temptation", name: "Forbidden Temptation", kind: "attack", power: 40, cost: 12, element: "Plant", scaling: "int" },
  thorn_whip: { id: "thorn_whip", name: "Thorn Whip", kind: "attack", power: 35, cost: 9, element: "Plant", scaling: "atk" },

  super_shocker: { id: "super_shocker", name: "Super Shocker", kind: "attack", power: 25, cost: 6, element: "Electric", scaling: "int" },
  mega_blaster: { id: "mega_blaster", name: "Mega Blaster", kind: "attack", power: 33, cost: 9, element: "Electric", scaling: "int" },
  giga_blaster: { id: "giga_blaster", name: "Giga Blaster", kind: "attack", power: 40, cost: 12, element: "Electric", scaling: "int" },
  horn_buster: { id: "horn_buster", name: "Horn Buster", kind: "attack", power: 35, cost: 9, element: "Neutral", scaling: "atk" },

  marching_fishes: { id: "marching_fishes", name: "Marching Fishes", kind: "attack", power: 22, cost: 5, element: "Water", scaling: "atk" },
  harpoon_torpedo: { id: "harpoon_torpedo", name: "Harpoon Torpedo", kind: "attack", power: 31, cost: 8, element: "Water", scaling: "atk" },
  hammer_spark: { id: "hammer_spark", name: "Hammer Spark", kind: "attack", power: 38, cost: 10, element: "Water", scaling: "atk" },
  arctic_blizzard: { id: "arctic_blizzard", name: "Arctic Blizzard", kind: "attack", power: 40, cost: 12, element: "Water", scaling: "int" },

  spiral_twister: { id: "spiral_twister", name: "Spiral Twister", kind: "attack", power: 23, cost: 5, element: "Wind", scaling: "int" },
  meteor_wing: { id: "meteor_wing", name: "Meteor Wing", kind: "attack", power: 32, cost: 9, element: "Fire", scaling: "int" },
  phoenix_blaze: { id: "phoenix_blaze", name: "Phoenix Blaze", kind: "attack", power: 40, cost: 12, element: "Fire", scaling: "int" },
  crimson_flare: { id: "crimson_flare", name: "Crimson Flare", kind: "attack", power: 39, cost: 11, element: "Fire", scaling: "int" },

  vee_headbutt: { id: "vee_headbutt", name: "Vee Headbutt", kind: "attack", power: 21, cost: 4, element: "Neutral", scaling: "atk" },
  vee_laser: { id: "vee_laser", name: "Vee Laser", kind: "attack", power: 28, cost: 7, element: "Light", scaling: "int" },
  v_wing_blade: { id: "v_wing_blade", name: "V-Wing Blade", kind: "attack", power: 36, cost: 10, element: "Wind", scaling: "atk" },
  ray_of_victory: { id: "ray_of_victory", name: "Ray of Victory", kind: "attack", power: 40, cost: 12, element: "Wind", scaling: "int" },
  ulforce_saber: { id: "ulforce_saber", name: "Ulforce Saber", kind: "attack", power: 36, cost: 10, element: "Neutral", scaling: "atk" },

  terra_force: { id: "terra_force", name: "Terra Force", kind: "attack", power: 42, cost: 13, element: "Fire", scaling: "int" },
  brave_tornado: { id: "brave_tornado", name: "Brave Tornado", kind: "attack", power: 37, cost: 10, element: "Neutral", scaling: "atk" },
  cocytus_breath: { id: "cocytus_breath", name: "Cocytus Breath", kind: "attack", power: 42, cost: 13, element: "Water", scaling: "int" },
  garuru_cannon: { id: "garuru_cannon", name: "Garuru Cannon", kind: "attack", power: 38, cost: 11, element: "Water", scaling: "atk" },
  grey_sword: { id: "grey_sword", name: "Grey Sword", kind: "attack", power: 41, cost: 12, element: "Light", scaling: "atk" },
  supreme_cannon: { id: "supreme_cannon", name: "Supreme Cannon", kind: "attack", power: 44, cost: 14, element: "Light", scaling: "int" },
  gaia_destroyer: { id: "gaia_destroyer", name: "Gaia Destroyer", kind: "attack", power: 43, cost: 13, element: "Fire", scaling: "int" },
  dark_tornado: { id: "dark_tornado", name: "Dark Tornado", kind: "attack", power: 39, cost: 11, element: "Dark", scaling: "atk" },
  catastro_disaster: { id: "catastro_disaster", name: "Catastro Disaster", kind: "attack", power: 45, cost: 14, element: "Dark", scaling: "int" },
  spider_shooter: { id: "spider_shooter", name: "Spider Shooter", kind: "attack", power: 39, cost: 11, element: "Dark", scaling: "atk" },
  seven_heavens: { id: "seven_heavens", name: "Seven Heavens", kind: "attack", power: 42, cost: 13, element: "Light", scaling: "int" },
  holy_judgment: { id: "holy_judgment", name: "Holy Judgment", kind: "attack", power: 38, cost: 11, element: "Light", scaling: "atk" },
  night_raid: { id: "night_raid", name: "Night Raid", kind: "attack", power: 43, cost: 13, element: "Dark", scaling: "int" },
  poison_stream: { id: "poison_stream", name: "Poison Stream", kind: "attack", power: 38, cost: 11, element: "Dark", scaling: "atk" }
};

export function getSkillById(skillId) {
  return SKILLS[skillId] || null;
}

export const SPECIES_SKILLS = {
  koromon: ["bubble_pop"],
  tsunomon: ["headbutt"],
  tsumemon: ["bad_message"],
  tokomon: ["petit_bite"],
  tanemon: ["seed_blast"],
  motimon: ["static_buzz"],
  bukamon: ["bubble_pop"],
  yokomon: ["baby_flame"],
  demiveemon: ["vee_tackle"],

  agumon: ["claw_attack", "pepper_breath"],
  agumon_black: ["claw_attack", "black_pepper_breath"],
  gabumon: ["horn_attack", "blue_blaster"],
  keramon: ["web_wrecker", "bad_message"],
  patamon: ["air_shot", "holy_tackle", "minor_heal"],
  demidevimon: ["evil_wing", "bad_message"],
  palmon: ["needle_spray", "poison_ivy"],
  tentomon: ["claw_attack", "super_shocker"],
  gomamon: ["marching_fishes", "bubble_pop"],
  biyomon: ["spiral_twister", "body_slam"],
  veemon: ["vee_headbutt", "vee_laser"],

  greymon: ["great_horn_attack", "mega_flame"],
  greymon_blue: ["great_horn_attack", "blue_mega_flame"],
  garurumon: ["sharp_fang", "fox_fire"],
  angemon: ["heaven_knuckle", "hand_of_fate", "minor_heal"],
  devimon: ["nightmare_claw", "evil_wing"],
  togemon: ["needle_spray", "poison_ivy"],
  kabuterimon: ["horn_attack", "mega_blaster"],
  ikkakumon: ["harpoon_torpedo", "body_slam"],
  birdramon: ["meteor_wing", "spiral_twister"],
  exveemon: ["vee_headbutt", "vee_laser"],
  chrysalimon: ["data_crusher", "web_wrecker"],

  metalgreymon: ["giga_destroyer", "trident_arm"],
  metalgreymon_blue: ["giga_destroyer", "virus_breath"],
  weregarurumon: ["wolf_claw", "kaiser_nail"],
  holyangemon: ["heavens_gate", "excalibur_slash", "greater_heal"],
  lillymon: ["flower_cannon", "minor_heal"],
  megakabuterimon: ["giga_blaster", "horn_attack"],
  zudomon: ["hammer_spark", "body_slam"],
  garudamon: ["phoenix_blaze", "meteor_wing"],
  aeroveedramon: ["v_wing_blade", "vee_laser"],
  myotismon: ["night_raid", "poison_stream"],
  infermon: ["catastro_disaster", "spider_shooter"],

  wargreymon: ["terra_force", "brave_tornado"],
  blackwargreymon: ["gaia_destroyer", "dark_tornado"],
  metalgarurumon: ["cocytus_breath", "garuru_cannon"],
  omnimon: ["grey_sword", "supreme_cannon"],
  diaboromon: ["catastro_disaster", "spider_shooter"],
  seraphimon: ["seven_heavens", "holy_judgment", "greater_heal"],
  venommyotismon: ["night_raid", "poison_stream"],
  rosemon: ["forbidden_temptation", "thorn_whip", "greater_heal"],
  herculeskabuterimon: ["giga_blaster", "horn_buster"],
  vikemon: ["arctic_blizzard", "hammer_spark"],
  phoenixmon: ["crimson_flare", "phoenix_blaze"],
  ulforceveedramon: ["ray_of_victory", "ulforce_saber"]
};

export function getSkillsForSpecies(speciesId) {
  return SPECIES_SKILLS[speciesId] || [];
}

export function getDefaultSkillForSpecies(speciesId) {
  const skills = getSkillsForSpecies(speciesId);
  return skills.length ? getSkillById(skills[0]) : null;
}
