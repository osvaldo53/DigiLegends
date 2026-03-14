Game.createDigimon = function(species){
    const base = Game.digimons[species];

    if(!base){
        console.error("Template do Digimon não encontrado:", species);
        return null;
    }

    return {
        id: crypto.randomUUID(),
        species: species,
        name: species,
        level: 1,
        exp: 0,
        abi: 0,
        stats: { ...base.stats },
        currentHP: base.stats.hp,
        currentSP: base.stats.sp,
        stage: base.stage,
        type: base.type,
        attribute: base.attribute,
        evolution: base.evolution
    };
};