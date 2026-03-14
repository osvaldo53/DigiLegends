Game.renderDigidex = function(){

  const container = $("#digidex");

  container.empty();

  Object.entries(Game.digimons)
  .forEach(([name,d])=>{

    const spriteName = name.toLowerCase();

    let evoHTML = "";

    if(d.evolution && d.evolution.length){

      evoHTML += "<div class='evolutions'><strong>Evoluções:</strong><ul>";

      d.evolution.forEach(evo=>{

        const req = Object.entries(evo.requirements)
        .map(([k,v])=>`${k}: ${v}`)
        .join(", ");

        evoHTML += `<li>${evo.digimon} (${req})</li>`;

      });

      evoHTML += "</ul></div>";

    }

    const card = $(`
      <div class="digidex-card">

        <img class="digimon-sprite"
        src="assets/sprites/${spriteName}.png">

        <h2>${name}</h2>

        <p><strong>Stage:</strong> ${d.stage}</p>
        <p><strong>Type:</strong> ${d.type}</p>
        <p><strong>Attribute:</strong> ${d.attribute}</p>

        <div class="stats">
          <div>HP: ${d.stats.hp}</div>
          <div>SP: ${d.stats.sp}</div>
          <div>ATK: ${d.stats.atk}</div>
          <div>DEF: ${d.stats.def}</div>
          <div>INT: ${d.stats.int}</div>
          <div>SPD: ${d.stats.spd}</div>
        </div>

        ${evoHTML}

      </div>
    `);

    container.append(card);

  });

};