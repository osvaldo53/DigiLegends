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

let lastScrollKey = null;

function scrollToScreenTop() {
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }

  window.scrollTo({ top: 0, left: 0 });
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0 });
  });
  window.setTimeout(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, 0);
}

function getScrollKey(currentScreen) {
  if (currentScreen === "hunts") {
    if (state.huntSession.active) return "hunts:active";
    if (state.huntSession.summary) return "hunts:summary";
    return "hunts:list";
  }

  if (currentScreen === "bosses") {
    if (state.bossSession.active) return "bosses:active";
    if (state.bossSession.summary) return "bosses:summary";
    return "bosses:list";
  }

  return currentScreen;
}

export function renderApp() {
  const app = document.getElementById("app");
  if (!app) return;

  let screenMarkup = "";
  const currentScreen = state.app.currentScreen;

  switch (currentScreen) {
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

  const scrollKey = getScrollKey(currentScreen);

  if (lastScrollKey !== scrollKey) {
    scrollToScreenTop();
    lastScrollKey = scrollKey;
  }

  switch (currentScreen) {
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
