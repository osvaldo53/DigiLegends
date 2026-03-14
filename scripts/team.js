Game.renderTeam = function(){

  const container = $("#team-container");

  container.empty();

  const team = Game.player.digimons;

  if(team.length === 0){

    container.append("<p>No Digimons</p>");
    return;

  }

  team.forEach(digimon=>{

    const base = Game.digimons[digimon.species];

    const sprite = digimon.species
      .toLowerCase()
      .replaceAll(" ","");

    const card = $(`
      <div class="team-card">

        <img class="digimon-sprite"
        src="assets/sprites/${sprite}.png">

        <h3>${digimon.species}</h3>

        <p>Lv ${digimon.level}</p>

        <p>HP ${digimon.hp}</p>
        <p>SP ${digimon.sp}</p>

      </div>
    `);

    container.append(card);

  });

};