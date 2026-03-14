Game.createNewPlayer = function () {

    return {

        version: 1,

        name: "Player",

        bits: 1000,

        digimons: [],
        storage: [],

        items: [],

        progress: {
            huntsCompleted: 0,
            digimonSeen: [],
            digimonOwned: []
        }

    };

};


Game.save = function () {

    localStorage.setItem(
        "digimon-legends-save",
        JSON.stringify(Game.player)
    );

};

Game.load = function () {

    const save = localStorage.getItem("digimon-legends-save");

    if (!save) {

        Game.navigate("newgame");
        return;

    }
    else {

        const parsed = JSON.parse(save);
        Game.player = Game.migrateSave(parsed);
    }

    Game.navigate("home");

};

Game.startNewGame = function (name, starter) {

    Game.player = Game.createNewPlayer();

    Game.player.name = name;

    const digimon = Game.createDigimon(starter);

    Game.player.digimons.push(digimon);

    Game.save();

    Game.navigate("home");

};


Game.migrateSave = function (save) {

    if (!save.version) {
        save.version = 1;
    }

    return save;

};

Game.resetSave = function () {

    localStorage.removeItem("digimon-legends-save");

    Game.player = null;

    Game.navigate("newgame");

};