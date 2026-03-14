Game.init = function () {

    // clique no menu
    $(".menu-card").on("click", function () {

        const screen = $(this).data("screen");

        Game.navigate(screen);

    });

    // botão voltar
    $(".back-home").on("click", function () {

        Game.navigate("home");

    });

    // botão Apagar Save (screen options)
    $("#reset-save").on("click", function () {
        const confirmReset = confirm("Tem certeza que deseja apagar seu progresso?");
        if (confirmReset) {
            Game.resetSave();
        }
    });

};


Game.navigate = function (screen) {

    $(".screen").removeClass("active");

    $("#screen-" + screen).addClass("active");

    if (screen === "digidex") {
        Game.renderDigidex();
    }

    if (screen === "team") {
        Game.renderTeam();
    }

};