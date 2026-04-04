import { goToScreen } from "../../core/router.js";

export function renderTitle() {
  setTimeout(() => {
    document.getElementById("startBtn").onclick = () => {
      goToScreen("home");
    };
  });

  return `
    <h1>DigiLegends</h1>
    <button id="startBtn">Novo Jogo</button>
  `;
}
