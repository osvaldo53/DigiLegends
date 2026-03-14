window.Game = window.Game || {};

Game.battleInProgress = false; // nova flag

Game.createEncounterDigimon = function() {
    const speciesList = Object.keys(Game.digimons);
    if(!speciesList.length) return null;
    const species = speciesList[Math.floor(Math.random() * speciesList.length)];
    const template = Game.digimons[species];
    if(!template) return null;

    return {
        id: crypto.randomUUID(),
        species,
        name: species,
        level: 1,
        stats: { ...template.stats },
        currentHP: template.stats.hp,
        currentSP: template.stats.sp,
        stage: template.stage,
        type: template.type,
        attribute: template.attribute,
        evolution: template.evolution
    };
};

Game.startEncounter = async function() {
    if(Game.battleInProgress) return; // se já está rolando, não faz nada
    if(!Game.player || !Game.player.digimons.length){
        alert("Nenhum Digimon no seu time!");
        return;
    }

    Game.battleInProgress = true; // bloqueia novas batalhas

    const player = Game.player.digimons[0];
    const enemy = Game.createEncounterDigimon();
    if(!enemy){
        alert("Erro ao criar Digimon inimigo.");
        Game.battleInProgress = false;
        return;
    }

    Game.resetBattleScreen(player, enemy);
    await Game.battle(player, enemy);

    Game.battleInProgress = false; // libera o botão após a batalha
};

Game.initHunts = function() {
    const $button = $('#hunt-search');
    if($button.length){
        $button.off('click').on('click', async function() {
            await Game.startEncounter();
        });
    } else {
        console.warn("Botão #hunt-search não encontrado no DOM.");
    }

    $(".back-home").off("click").on('click', function(){
        Game.navigate("home");
    });
};