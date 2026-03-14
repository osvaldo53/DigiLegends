// controla se a digidex já foi renderizada
let digidexRendered = false;

// Função para navegar entre telas
function navigate(screen) {

  document.querySelectorAll(".screen")
    .forEach(s => s.classList.remove("active"));

  document.getElementById("screen-" + screen)
    .classList.add("active");

  // Renderiza DigiDex apenas na primeira vez
  if (screen === "digidex" && !digidexRendered) {
    renderDigidex(digimons);
    digidexRendered = true;
  }

}


// Renderiza a DigiDex
function renderDigidex(digimons) {

  const container = document.getElementById("digidex");
  container.innerHTML = "";

  const fragment = document.createDocumentFragment();

  Object.entries(digimons)
  .forEach(([name,d])=>{

      const card = document.createElement("div");
      card.className = "digidex-card";

      const sprite = `assets/sprites/${name.toLowerCase()}.png`;

      let evoHTML = "";

      if (d.evolution && d.evolution.length > 0) {

        evoHTML += "<div class='evolutions'><strong>Evoluções:</strong><ul>";

        d.evolution.forEach(evo => {

          const reqs = Object.entries(evo.requirements)
            .map(([req, val]) => `${req}: ${val}`)
            .join(" | ");

          evoHTML += `
            <li>
              <strong>${evo.digimon}</strong><br>
              <small>${reqs}</small>
            </li>
          `;

        });

        evoHTML += "</ul></div>";

      }

      card.innerHTML = `
        <div class="digimon-header">

          <img 
            class="digimon-sprite"
            src="${sprite}"
            alt="${name}"
            onerror="this.src='assets/sprites/unknown.png'"
          >

          <h2>${name}</h2>

        </div>

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
      `;

      fragment.appendChild(card);

    });

  container.appendChild(fragment);

}