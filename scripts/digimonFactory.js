Game.createDigimon = function(species){

  const base = Game.digimons[species];

  return {

    id: crypto.randomUUID(),

    species: species,

    level: 1,
    exp: 0,
    abi: 0,

    hp: base.stats.hp,
    sp: base.stats.sp

  };

};