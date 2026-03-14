Game.selectedStarter = null;

Game.initNewGame = function(){

  // selecionar starter
  $(".starter-card").on("click", function(){

    $(".starter-card").removeClass("starter-selected");

    $(this).addClass("starter-selected");

    const starter = $(this).data("digimon");

    Game.selectedStarter = starter;

    $("#confirm-starter").prop("disabled", false);

    Game.showStarterInfo(starter);

  });

  // confirmar escolha
  $("#confirm-starter").on("click", function(){

    const name = $("#player-name").val().trim();

    if(!name){
      alert("Digite seu nome primeiro");
      return;
    }

    if(!Game.selectedStarter){
      alert("Escolha um Digimon");
      return;
    }

    Game.startNewGame(name, Game.selectedStarter);

  });

};

Game.showStarterInfo = function(name){

  const d = Game.digimons[name];

  if(!d){
    console.error("Digimon não encontrado:", name);
    return;
  }

  const html = `
    <h3>${name}</h3>

    <div class="starter-meta">
      <div><strong>Stage:</strong> ${d.stage}</div>
      <div><strong>Type:</strong> ${d.type}</div>
      <div><strong>Attribute:</strong> ${d.attribute}</div>
    </div>

    <div class="starter-stats">

      <div>HP</div><div>${d.stats.hp}</div>
      <div>SP</div><div>${d.stats.sp}</div>
      <div>ATK</div><div>${d.stats.atk}</div>
      <div>DEF</div><div>${d.stats.def}</div>
      <div>INT</div><div>${d.stats.int}</div>
      <div>SPD</div><div>${d.stats.spd}</div>

    </div>
  `;

  $("#starter-info").html(html);

};