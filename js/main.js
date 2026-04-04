import { state } from "./core/state.js";
import { loadGame } from "./core/saveManager.js";
import { renderApp } from "./ui/renderApp.js";

function bootstrap() {
  const save = loadGame();

  if (save) {
    state.save = save;
    state.app.currentScreen = "home";
  } else {
    state.app.currentScreen = "title";
  }

  renderApp();
}

bootstrap();
