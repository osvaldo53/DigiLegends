import { state } from "./state.js";
import { renderApp } from "../ui/renderApp.js";

export function goToScreen(screenName) {
  state.app.currentScreen = screenName;
  renderApp();
}
