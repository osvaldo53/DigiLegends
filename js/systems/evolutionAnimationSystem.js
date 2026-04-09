import { state } from "../core/state.js";

let evolutionAnimationTimer = null;

function rerender() {
  window.dispatchEvent(new Event("digilegends:rerender"));
}

export function clearEvolutionAnimation() {
  if (evolutionAnimationTimer) {
    window.clearTimeout(evolutionAnimationTimer);
    evolutionAnimationTimer = null;
  }

  if (!state.app.evolutionAnimation) {
    return;
  }

  state.app.evolutionAnimation = null;
  rerender();
}

export function showEvolutionAnimation(animationData, durationMs = 5500) {
  if (!animationData?.from || !animationData?.to) {
    return;
  }

  if (evolutionAnimationTimer) {
    window.clearTimeout(evolutionAnimationTimer);
  }

  state.app.evolutionAnimation = animationData;
  rerender();

  evolutionAnimationTimer = window.setTimeout(() => {
    evolutionAnimationTimer = null;

    if (!state.app.evolutionAnimation) {
      return;
    }

    state.app.evolutionAnimation = null;
    rerender();
  }, durationMs);
}
