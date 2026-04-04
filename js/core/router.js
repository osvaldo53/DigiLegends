import { state } from "./state.js";
import { renderApp } from "../ui/renderApp.js";

export function goToScreen(screen) {
  state.app.currentScreen = screen;
  renderApp();
}
