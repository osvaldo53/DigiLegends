const digimon = {};

//types
const VACCINE = "Vaccine";
const DATA = "Data";
const VIRUS = "Virus";
const FREE = "Free";

//stages
const IN_TRAINING = "In-Training";
const ROOKIE = "Rookie";
const CHAMPION = "Champion";
const ULTIMATE = "Ultimate";
const MEGA = "Mega";

//attributes
const FIRE = "Fire";

digimon.agumento = {
    "stage": ROOKIE,
    "type": VACCINE,
    "attribute": FIRE,
    "stats": {
        "hp": 450,
        "sp": 20,
        "atk": 68,
        "def": 45,
        "int": 15,
        "spd":37
    },    
    "evolution": [
        {
            "digimon": "Greymon",
            "requirements": {
                "level": 15,
                "atk": 90
            }
        },
        {
            "digimon": "GeoGreymon",
            "requirements": {
                "level": 18,
                "atk": 95,
                "spd": 60
            }
        }
    ]
}