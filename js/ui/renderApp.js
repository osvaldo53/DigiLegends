import { state } from "../core/state.js";
import { bindTitleScreen, renderTitleScreen } from "./screens/titleScreen.js";
import { bindNewGameScreen, renderNewGameScreen } from "./screens/newGameScreen.js";
import { bindHomeScreen, renderHomeScreen } from "./screens/homeScreen.js";
import { bindTeamScreen, renderTeamScreen } from "./screens/teamScreen.js";
import { bindDigiDexScreen, renderDigiDexScreen } from "./screens/digidexScreen.js";
import { bindHuntsScreen, renderHuntsScreen } from "./screens/huntsScreen.js";
import { bindBattleScreen, renderBattleScreen } from "./screens/battleScreen.js";
import { bindItemsScreen, renderItemsScreen } from "./screens/itemsScreen.js";
import { bindShopScreen, renderShopScreen } from "./screens/shopScreen.js";
import { renderNotFoundScreen } from "./screens/notFoundScreen.js";

export function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  switch (state.app.currentScreen) {
    case "title":
      app.innerHTML = renderTitleScreen();
      bindTitleScreen();
      break;

    case "newGame":
      app.innerHTML = renderNewGameScreen();
      bindNewGameScreen();
      break;

    case "home":
      app.innerHTML = renderHomeScreen();
      bindHomeScreen();
      break;

    case "team":
      app.innerHTML = renderTeamScreen();
      bindTeamScreen();
      break;

    case "digidex":
      app.innerHTML = renderDigiDexScreen();
      bindDigiDexScreen();
      break;

    case "hunts":
      app.innerHTML = renderHuntsScreen();
      bindHuntsScreen();
      break;

    case "items":
      app.innerHTML = renderItemsScreen();
      bindItemsScreen();
      break;

    case "shop":
      app.innerHTML = renderShopScreen();
      bindShopScreen();
      break;

    case "battle":
      app.innerHTML = renderBattleScreen();
      bindBattleScreen();
      break;

    default:
      app.innerHTML = renderNotFoundScreen();
      break;
  }
}