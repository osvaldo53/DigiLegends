// Função para navegar entre telas
function navigate(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + screen).classList.add("active");

  // Se for a Digidex, renderiza os Digimons
  if (screen === "digidex") {
    renderDigidex(digimons);
  }
}

// Renderiza a Digidex
function renderDigidex(digimons) {
  const container = document.getElementById("digidex");
  container.innerHTML = "";

  Object.keys(digimons).forEach(name => {
    const d = digimons[name];
    const card = document.createElement("div");
    card.className = "digidex-card"; // agora usa estilo próprio

    let evoHTML = "";
    if (d.evolution && d.evolution.length > 0) {
      evoHTML = "<div class='evolutions'><strong>Evoluções:</strong><ul>";
      d.evolution.forEach(evo => {
        evoHTML += `<li>${evo.digimon} (Requisitos: ${Object.entries(evo.requirements)
          .map(([req, val]) => `${req}: ${val}`)
          .join(", ")})</li>`;
      });
      evoHTML += "</ul></div>";
    }

    card.innerHTML = `
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
    `;

    container.appendChild(card);
  });
}