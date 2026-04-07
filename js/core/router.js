import { state } from "./state.js";
import { renderApp } from "../ui/renderApp.js";
import { SUPPORTED_SCREENS } from "../config/constants.js";

export function goToScreen(screenName) {
  state.app.currentScreen = SUPPORTED_SCREENS.includes(screenName)
    ? screenName
    : "notFound";
  renderApp();
}
