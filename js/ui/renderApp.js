import { state } from "../core/state.js";
import { renderTitle } from "./screens/titleScreen.js";
import { renderHome } from "./screens/homeScreen.js";

export function renderApp() {
  const app = document.getElementById("app");

  switch (state.app.currentScreen) {
    case "title":
      app.innerHTML = renderTitle();
      break;
    case "home":
      app.innerHTML = renderHome();
      break;
    default:
      app.innerHTML = "<p>Tela não encontrada</p>";
  }
}
