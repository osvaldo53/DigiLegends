import { state } from "./core/state.js";
import { loadGame, migrateSaveIfNeeded } from "./core/saveManager.js";
import { renderApp } from "./ui/renderApp.js";

function bootstrap() {
  const loadedSave = loadGame();

  if (loadedSave) {
    state.save = migrateSaveIfNeeded(loadedSave);
    state.app.currentScreen = "home";
  } else {
    state.app.currentScreen = "title";
  }

  state.app.initialized = true;
  renderApp();
}

bootstrap();
