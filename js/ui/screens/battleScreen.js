import { state } from "../../core/state.js";
import { goToScreen } from "../../core/router.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { closeBattle, fleeBattle, performPlayerAttack } from "../../systems/battleSystem.js";
import { escapeHtml, clamp } from "../../core/utils.js";

function renderHpBar(current, max) {
  const pct = max > 0 ? clamp((current / max) * 100, 0, 100) : 0;
  return `
    <div class="hpbar"><span style="width:${pct}%;"></span></div>
    <small>${current}/${max} HP</small>
  `;
}

export function renderBattleScreen() {
  const player = state.save.party.find((digimon) => digimon.uid === state.battle.playerDigimonUid);
  const enemy = state.battle.enemy;

  if (!player || !enemy) {
    return `
      <section class="screen">
        <div class="panel">
          <h2>Batalha indisponível</h2>
          <p>Não há dados de batalha ativos.</p>
          <div class="button-row">
            <button class="btn btn-secondary" id="btn-battle-home">Voltar</button>
          </div>
        </div>
      </section>
    `;
  }

  const playerSpecies = getDigimonSpecies(player.speciesId);
  const enemySpecies = getDigimonSpecies(enemy.speciesId);

  const resultText = state.battle.result === "victory"
    ? `Vitória. +${state.battle.rewards?.bits || 0} Bits / +${state.battle.rewards?.exp || 0} EXP${state.battle.rewards?.gainedLevels ? ` / +${state.battle.rewards.gainedLevels} nível(is)` : ""}.`
    : state.battle.result === "defeat"
      ? `Derrota. -${state.battle.rewards?.bitsLost || 0} Bits.`
      : state.battle.result === "fled"
        ? "Você fugiu da batalha."
        : "";

  return `
    <section class="screen">
      <div class="panel battle-layout">
        <div>
          <h2>Batalha</h2>
          <p>Loop inicial de combate com ataque básico, recompensa, EXP e autosave.</p>
        </div>

        ${state.battle.result ? `<div class="battle-result">${escapeHtml(resultText)}</div>` : ""}

        <div class="battle-arena">
          <div class="battle-side">
            <h3>${escapeHtml(playerSpecies?.name || "Seu Digimon")} · Lv. ${player.level}</h3>
            <img src="${escapeHtml(playerSpecies?.sprite || "")}" alt="${escapeHtml(playerSpecies?.name || "Digimon")}" onerror="this.style.display='none'" />
            ${renderHpBar(player.currentHP, player.finalStats.hp)}
            <div class="stat-list">
              <span>ATK: ${player.finalStats.atk}</span>
              <span>DEF: ${player.finalStats.def}</span>
              <span>SPD: ${player.finalStats.spd}</span>
            </div>
          </div>

          <div class="battle-side">
            <h3>${escapeHtml(enemySpecies?.name || "Inimigo")} · Lv. ${enemy.level}</h3>
            <img src="${escapeHtml(enemySpecies?.sprite || "")}" alt="${escapeHtml(enemySpecies?.name || "Inimigo")}" onerror="this.style.display='none'" />
            ${renderHpBar(enemy.currentHP, enemy.finalStats.hp)}
            <div class="stat-list">
              <span>ATK: ${enemy.finalStats.atk}</span>
              <span>DEF: ${enemy.finalStats.def}</span>
              <span>SPD: ${enemy.finalStats.spd}</span>
            </div>
          </div>
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="btn-attack" ${state.battle.result ? "disabled" : ""}>Atacar</button>
          <button class="btn btn-secondary" id="btn-flee" ${state.battle.result ? "disabled" : ""}>Fugir</button>
          <button class="btn btn-secondary" id="btn-exit-battle">${state.battle.result ? "Encerrar batalha" : "Voltar sem encerrar"}</button>
        </div>

        <div class="log-panel">
          <ul>
            ${state.battle.log.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>
  `;
}

export function bindBattleScreen() {
  document.getElementById("btn-attack")?.addEventListener("click", () => {
    performPlayerAttack();
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("btn-flee")?.addEventListener("click", () => {
    fleeBattle();
    window.dispatchEvent(new Event("digilegends:rerender"));
  });

  document.getElementById("btn-exit-battle")?.addEventListener("click", () => {
    if (state.battle.result) {
      closeBattle();
      goToScreen("hunts");
      return;
    }
    goToScreen("hunts");
  });
}

window.addEventListener("digilegends:rerender", () => {
  if (state.app.currentScreen === "battle") {
    window.requestAnimationFrame(() => {
      import("../renderApp.js").then(({ renderApp }) => renderApp());
    });
  }
});
