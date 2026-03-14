window.Game = window.Game || {};

// Função de delay
Game.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Calcula dano simples: atk - def
Game.calculateDamage = function(attacker, defender) {
    return Math.max(attacker.stats.atk - defender.stats.def, 1);
};

// Reseta a tela da batalha
Game.resetBattleScreen = function(player, enemy){
    // Garantir stats atuais
    player.currentHP ??= player.stats.hp;
    player.currentSP ??= player.stats.sp;
    enemy.currentHP ??= enemy.stats.hp;
    enemy.currentSP ??= enemy.stats.sp;

    // Limpa log
    $('#battle-log').html("");

    // Reset das barras
    $('#player-hp-bar').css('width','100%');
    $('#enemy-hp-bar').css('width','100%');
    $('#player-sp-bar').css('width','100%');
    $('#enemy-sp-bar').css('width','100%');

    // Atualiza nomes
    $('#player-name').text(player.name);
    $('#enemy-name').text(enemy.name);

    // Atualiza sprites
    $('#player-sprite').attr('src', `assets/sprites/${player.species.toLowerCase()}.png`);
    $('#enemy-sprite').attr('src', `assets/sprites/${enemy.species.toLowerCase()}.png`);
};

// Função principal da batalha
Game.battle = async function(player, enemy) {
    const $battleLog = $('#battle-log');
    if(!$battleLog.length) return;

    // Checagem de stats
    if(!player.stats || !enemy.stats){
        $battleLog.html("Erro: stats do Digimon não encontrados.");
        console.error("Stats ausentes:", player, enemy);
        return;
    }

    // Garantir stats atuais
    player.currentHP ??= player.stats.hp;
    player.currentSP ??= player.stats.sp;
    enemy.currentHP ??= enemy.stats.hp;
    enemy.currentSP ??= enemy.stats.sp;

    player.name ??= player.species;
    enemy.name ??= enemy.species;

    let turn = 1;

    while(player.currentHP > 0 && enemy.currentHP > 0){
        try {
            // --- Turno do player ---
            let damage = Game.calculateDamage(player, enemy);
            enemy.currentHP -= damage;
            enemy.currentHP = Math.max(0, enemy.currentHP);
            $('#enemy-hp-bar').css('width', `${(enemy.currentHP / enemy.stats.hp) * 100}%`);
            $battleLog.append(`Turn ${turn}: ${player.name} atacou ${enemy.name} causando ${damage} de dano.<br>`);
            $battleLog.scrollTop($battleLog[0].scrollHeight);
            await Game.sleep(1000);

            if(enemy.currentHP <= 0){
                $battleLog.append(`<b>${enemy.name} foi derrotado!</b><br>`);
                break;
            }

            // --- Turno do inimigo ---
            damage = Game.calculateDamage(enemy, player);
            player.currentHP -= damage;
            player.currentHP = Math.max(0, player.currentHP);
            $('#player-hp-bar').css('width', `${(player.currentHP / player.stats.hp) * 100}%`);
            $battleLog.append(`${enemy.name} atacou ${player.name} causando ${damage} de dano.<br>`);
            $battleLog.scrollTop($battleLog[0].scrollHeight);
            await Game.sleep(1000);

            if(player.currentHP <= 0){
                $battleLog.append(`<b>${player.name} foi derrotado!</b><br>`);
                break;
            }

            turn++;

            // Limite de turnos para empate
            if(turn > 20){
                $battleLog.append("A batalha terminou em empate.<br>");
                break;
            }

        } catch(err) {
            console.error("Erro durante o loop da batalha:", err);
            $battleLog.append("Ocorreu um erro na batalha.<br>");
            break;
        }
    }
};