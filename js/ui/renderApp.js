import { state } from "../core/state.js";
import { bindTitleScreen, renderTitleScreen } from "./screens/titleScreen.js";
import { bindNewGameScreen, renderNewGameScreen } from "./screens/newGameScreen.js";
import { bindHomeScreen, renderHomeScreen } from "./screens/homeScreen.js";
import { bindOptionsScreen, renderOptionsScreen } from "./screens/optionsScreen.js";
import { bindTeamScreen, renderTeamScreen } from "./screens/teamScreen.js";
import { bindDigiDexScreen, renderDigiDexScreen } from "./screens/digidexScreen.js";
import { bindHuntsScreen, renderHuntsScreen } from "./screens/huntsScreen.js";
import { bindBossesScreen, renderBossesScreen } from "./screens/bossesScreen.js";
import { bindItemsScreen, renderItemsScreen } from "./screens/itemsScreen.js";
import { bindTrainingScreen, renderTrainingScreen } from "./screens/trainingScreen.js";
import { bindShopScreen, renderShopScreen } from "./screens/shopScreen.js";
import { bindConversionScreen, renderConversionScreen } from "./screens/conversionScreen.js";
import { renderNotFoundScreen } from "./screens/notFoundScreen.js";
import { renderEvolutionModal } from "./components/evolutionModal.js";

export function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  let screenMarkup = "";

  switch (state.app.currentScreen) {
    case "title":
      screenMarkup = renderTitleScreen();
      break;

    case "newGame":
      screenMarkup = renderNewGameScreen();
      break;

    case "home":
      screenMarkup = renderHomeScreen();
      break;

    case "options":
      screenMarkup = renderOptionsScreen();
      break;

    case "team":
      screenMarkup = renderTeamScreen();
      break;

    case "digidex":
      screenMarkup = renderDigiDexScreen();
      break;

    case "hunts":
      screenMarkup = renderHuntsScreen();
      break;

    case "bosses":
      screenMarkup = renderBossesScreen();
      break;

    case "items":
      screenMarkup = renderItemsScreen();
      break;

    case "training":
      screenMarkup = renderTrainingScreen();
      break;

    case "shop":
      screenMarkup = renderShopScreen();
      break;

    case "conversion":
      screenMarkup = renderConversionScreen();
      break;

    case "notFound":
      screenMarkup = renderNotFoundScreen();
      break;

    default:
      screenMarkup = renderNotFoundScreen();
      break;
  }

  app.innerHTML = `
    ${screenMarkup}
    ${renderEvolutionModal(state.app.evolutionAnimation)}
  `;

  switch (state.app.currentScreen) {
    case "title":
      bindTitleScreen();
      break;

    case "newGame":
      bindNewGameScreen();
      break;

    case "home":
      bindHomeScreen();
      break;

    case "options":
      bindOptionsScreen();
      break;

    case "team":
      bindTeamScreen();
      break;

    case "digidex":
      bindDigiDexScreen();
      break;

    case "hunts":
      bindHuntsScreen();
      break;

    case "bosses":
      bindBossesScreen();
      break;

    case "items":
      bindItemsScreen();
      break;

    case "training":
      bindTrainingScreen();
      break;

    case "shop":
      bindShopScreen();
      break;

    case "conversion":
      bindConversionScreen();
      break;

    default:
      break;
  }
}
