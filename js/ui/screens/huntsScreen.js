import { HUNTS, getHuntById } from "../../data/encounters.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { renderHuntCard } from "../components/huntCard.js";
import { renderBattleSessionView, bindBattleSessionView } from "../components/battleSessionView.js";
import { renderTamerProgress } from "../components/tamerProgress.js";
import {
  startHuntSession,
  stopHuntSession,
  clearHuntSummary,
  moveHuntPlayer,
  triggerHuntMapEncounter,
  beginBattleItemTargetSelection,
  cancelBattleItemTargetSelection,
  getBattleItemEligibleTargets,
  toggleAutoBattleMode,
  updateAutoItemSlot,
  performManualBattleAction,
  useBattleItemTurn,
  switchBattleDigimonTurn
} from "../../systems/huntSessionSystem.js";
import { escapeHtml } from "../../core/utils.js";

let huntMapKeyHandler = null;

function renderDrops(items) {
  if (!items.length) {
    return '<p class="hunt-session__muted">Nenhum item dropado ate agora.</p>';
  }

  return `
    <div class="hunt-drop-list">
      ${items
        .map((item) => `<span class="hunt-drop-pill">${escapeHtml(item.name)} x${item.quantity}</span>`)
        .join("")}
    </div>
  `;
}

function getCurrentDungeonFloor(map) {
  return map?.floors?.[map.currentFloorIndex] || null;
}

function getTileKey(x, y) {
  return `${x},${y}`;
}

function isDiscovered(floor, x, y) {
  return floor.discovered.includes(getTileKey(x, y));
}

function getDungeonTile(floor, x, y) {
  if (!floor || x < 0 || x >= floor.width || y < 0 || y >= floor.height) {
    return "#";
  }

  return floor.rows[y]?.charAt(x) || "#";
}

function getDungeonCamera(map, floor) {
  const cols = map.viewport?.cols || 11;
  const rows = map.viewport?.rows || 9;
  const maxX = Math.max(0, floor.width - cols);
  const maxY = Math.max(0, floor.height - rows);
  const x = Math.max(0, Math.min(maxX, map.player.x - Math.floor(cols / 2)));
  const y = Math.max(0, Math.min(maxY, map.player.y - Math.floor(rows / 2)));

  return { x, y, cols, rows };
}

function getEncounterAt(floor, x, y) {
  const wild = floor.encounters.find((encounter) => {
    return !encounter.defeated && encounter.x === x && encounter.y === y;
  });

  if (wild) {
    return wild;
  }

  if (floor.boss && !floor.boss.defeated && floor.boss.x === x && floor.boss.y === y) {
    return floor.boss;
  }

  return null;
}

function getChestAt(floor, x, y) {
  return floor.chests.find((chest) => !chest.opened && chest.x === x && chest.y === y) || null;
}

function getSeenDungeonObjectType(floor, x, y) {
  if (getEncounterAt(floor, x, y)?.kind === "boss") return "boss";
  if (getEncounterAt(floor, x, y)) return "wild";
  if (getChestAt(floor, x, y)) return "chest";
  if (floor.portal && floor.portal.x === x && floor.portal.y === y) return "portal";
  if (floor.exit && floor.exit.x === x && floor.exit.y === y) return "exit";
  return "";
}

function renderDungeonEntity(entity) {
  if (!entity) {
    return "";
  }

  const species = getDigimonSpecies(entity.speciesId);
  const name = species?.name || entity.speciesId;
  const bossClass = entity.kind === "boss" ? " hunt-map__entity--boss" : "";

  return `
    <div class="hunt-map__entity hunt-map__entity--wild${bossClass}">
      <img src="${escapeHtml(species?.sprite || "")}" alt="${escapeHtml(name)}" onerror="this.style.display='none'" />
      <span>${escapeHtml(entity.kind === "boss" ? "Boss" : name)}</span>
    </div>
  `;
}

function renderDungeonObject(floor, x, y) {
  const encounter = getEncounterAt(floor, x, y);

  if (encounter) {
    return renderDungeonEntity(encounter);
  }

  const chest = getChestAt(floor, x, y);

  if (chest) {
    return '<div class="hunt-map__marker hunt-map__marker--chest">C</div>';
  }

  if (floor.portal && floor.portal.x === x && floor.portal.y === y) {
    return '<div class="hunt-map__marker hunt-map__marker--portal">P</div>';
  }

  if (floor.exit && floor.exit.x === x && floor.exit.y === y) {
    return '<div class="hunt-map__marker hunt-map__marker--exit">E</div>';
  }

  return "";
}

function renderHuntMapPlayer() {
  const leader = state.save.party.find((digimon) => (digimon.currentHP ?? 0) > 0) || state.save.party[0];
  const species = leader ? getDigimonSpecies(leader.speciesId) : null;

  return `
    <div
      class="hunt-map__entity hunt-map__entity--player hunt-map__entity--facing-${escapeHtml(state.huntSession.map?.player?.facing || "down")}"
      aria-label="Jogador"
    >
      <img
        src="${escapeHtml(species?.sprite || "")}"
        alt="${escapeHtml(species?.name || "Jogador")}"
        onerror="this.style.display='none'"
      />
    </div>
  `;
}

function renderDungeonViewport(map, floor) {
  const camera = getDungeonCamera(map, floor);
  const cells = [];

  for (let row = 0; row < camera.rows; row += 1) {
    for (let col = 0; col < camera.cols; col += 1) {
      const x = camera.x + col;
      const y = camera.y + row;
      const tile = getDungeonTile(floor, x, y);
      const isPlayer = map.player.x === x && map.player.y === y;
      const objectHtml = isPlayer ? renderHuntMapPlayer() : renderDungeonObject(floor, x, y);
      const objectType = getSeenDungeonObjectType(floor, x, y);

      cells.push(`
        <div
          class="hunt-map__cell hunt-map__cell--${tile === "#" ? "wall" : "floor"} ${objectType ? `hunt-map__cell--${objectType}` : ""}"
          data-x="${x}"
          data-y="${y}"
        >
          ${objectHtml}
        </div>
      `);
    }
  }

  return `
    <div
      class="hunt-map hunt-map--${escapeHtml(map.theme || "training")}"
      style="--map-cols:${camera.cols};--map-rows:${camera.rows};"
      aria-label="Janela da dungeon"
    >
      ${cells.join("")}
    </div>
  `;
}

function renderDungeonMinimap(map, floor) {
  const tiles = [];

  for (let y = 0; y < floor.height; y += 1) {
    for (let x = 0; x < floor.width; x += 1) {
      const discovered = isDiscovered(floor, x, y);
      const isPlayer = map.player.x === x && map.player.y === y;
      const tile = discovered ? getDungeonTile(floor, x, y) : "";
      const objectType = discovered ? getSeenDungeonObjectType(floor, x, y) : "";

      tiles.push(`
        <span
          class="hunt-minimap__tile ${discovered ? `hunt-minimap__tile--${tile === "#" ? "wall" : "floor"}` : "hunt-minimap__tile--hidden"} ${objectType ? `hunt-minimap__tile--${objectType}` : ""} ${isPlayer ? "hunt-minimap__tile--player" : ""}"
        ></span>
      `);
    }
  }

  return `
    <div class="hunt-minimap" style="--minimap-cols:${floor.width};" aria-label="Minimap">
      ${tiles.join("")}
    </div>
  `;
}

function renderHuntMapControls() {
  return `
    <div class="hunt-map-controls" aria-label="Movimento">
      <span></span>
      <button class="btn btn-secondary js-hunt-move" data-direction="up" aria-label="Mover para cima">&uarr;</button>
      <span></span>
      <button class="btn btn-secondary js-hunt-move" data-direction="left" aria-label="Mover para esquerda">&larr;</button>
      <span class="hunt-map-controls__core"></span>
      <button class="btn btn-secondary js-hunt-move" data-direction="right" aria-label="Mover para direita">&rarr;</button>
      <span></span>
      <button class="btn btn-secondary js-hunt-move" data-direction="down" aria-label="Mover para baixo">&darr;</button>
      <span></span>
    </div>
  `;
}

function renderHuntExplorationPanel() {
  const activeHunt = state.huntSession.huntId ? getHuntById(state.huntSession.huntId) : null;
  const map = state.huntSession.map;
  const floor = getCurrentDungeonFloor(map);

  if (!activeHunt || !map || !floor) {
    return `
      <section class="screen">
        <div class="panel">
          <h2>Hunt</h2>
          <p class="hunt-session__muted">Nao foi possivel carregar o mapa da hunt.</p>
          <div class="button-row">
            <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
          </div>
        </div>
      </section>
    `;
  }

  const remainingEnemies = floor.encounters.filter((encounter) => !encounter.defeated).length;
  const remainingChests = floor.chests.filter((chest) => !chest.opened).length;
  const floorLabel = `${map.currentFloorIndex + 1}/${map.floors.length}`;
  const bossLabel = floor.boss
    ? floor.boss.defeated
      ? "Guardiao derrotado"
      : "Guardiao ativo"
    : "Sem guardiao";

  return `
    <section class="screen">
      <div class="panel hunt-session-panel hunt-exploration-panel">
        <div class="hunt-session-panel__top">
          <div>
            <h2>${escapeHtml(activeHunt.name)}</h2>
            <p class="hunt-session__muted">${escapeHtml(floor.name)} - ${escapeHtml(map.message || "Explorando dungeon.")}</p>
          </div>
          <div class="button-row">
            <button class="btn btn-danger" id="btn-stop-session">Parar hunt</button>
            <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
          </div>
        </div>

        <div class="hunt-session-summary">
          <span class="status-pill">Andar: ${floorLabel}</span>
          <span class="status-pill">Vitorias: ${state.huntSession.totalWins}</span>
          <span class="status-pill">Batalhas: ${state.huntSession.totalBattles}</span>
          <span class="status-pill">Passos: ${map.steps}</span>
          <span class="status-pill">Baus: ${map.openedChests}</span>
          <span class="status-pill">Bits: ${state.huntSession.totalBitsEarned}</span>
          <span class="status-pill">EXP: ${state.huntSession.totalExpEarned}</span>
        </div>

        <div class="hunt-map-layout">
          ${renderDungeonViewport(map, floor)}

          <div class="hunt-map-sidebar">
            <div class="hunt-session-box">
              <h3>Controle</h3>
              ${renderHuntMapControls()}
            </div>

            <div class="hunt-session-box">
              <h3>Minimap</h3>
              ${renderDungeonMinimap(map, floor)}
            </div>

            <div class="hunt-session-box">
              <h3>Andar atual</h3>
              <div class="hunt-map-signal-list">
                <span class="hunt-drop-pill">Inimigos: ${remainingEnemies}</span>
                <span class="hunt-drop-pill">Baus: ${remainingChests}</span>
                <span class="hunt-drop-pill">${escapeHtml(bossLabel)}</span>
                ${
                  floor.portal
                    ? '<span class="hunt-drop-pill">Portal: oculto</span>'
                    : '<span class="hunt-drop-pill">Saida: encontre a sala final</span>'
                }
              </div>
            </div>

            <div class="hunt-session-box">
              <h3>Itens dropados</h3>
              ${renderDrops(state.huntSession.drops)}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderHuntSummaryPanel() {
  const summary = state.huntSession.summary;
  const hunt = summary?.huntId ? getHuntById(summary.huntId) : null;

  if (!summary) {
    return "";
  }

  const reasonText =
    summary.reason === "completed"
      ? "Dungeon concluida."
      : summary.reason === "defeat"
      ? "Seu time foi derrotado."
      : "A hunt foi encerrada manualmente.";

  const penaltyHtml = summary.penaltyBits
    ? `<p>Penalidade por derrota: -${summary.penaltyBits} Bits.</p>`
    : "";

  const healHtml = summary.healedDigimons.length
    ? `<p>Digimons recuperados para a proxima hunt: ${escapeHtml(summary.healedDigimons.join(", "))}.</p>`
    : "";

  return `
    <section class="screen">
      <div class="panel">
        <h2>Resumo da Hunt</h2>
        <p>${escapeHtml(hunt?.name || "Hunt")} encerrada. ${escapeHtml(reasonText)}</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Batalhas: ${summary.totalBattles}</span>
          <span class="status-pill">Vitorias: ${summary.totalWins}</span>
          <span class="status-pill">Derrotas: ${summary.totalDefeats}</span>
          ${summary.openedChests ? `<span class="status-pill">Baus: ${summary.openedChests}</span>` : ""}
          ${summary.reachedFloor ? `<span class="status-pill">Andar: ${summary.reachedFloor}</span>` : ""}
        </div>

        <div class="hunt-session-box" style="margin-bottom:16px;">
          <h3>Recompensas da sessao</h3>
          <p>Bits ganhos: ${summary.totalBitsEarned}</p>
          <p>EXP ganha: ${summary.totalExpEarned}</p>
          <p>Tamer EXP ganha: ${summary.totalTamerExpEarned || 0}</p>
          ${penaltyHtml}
          ${summary.message ? `<p>${escapeHtml(summary.message)}</p>` : ""}
          ${healHtml}
        </div>

        <div class="hunt-session-box" style="margin-bottom:16px;">
          <h3>Itens dropados</h3>
          ${renderDrops(summary.drops)}
        </div>

        <div class="button-row">
          <button class="btn btn-primary" id="btn-close-hunt-summary">Fechar resumo</button>
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

function renderActiveSessionPanel() {
  const activeHunt = state.huntSession.huntId ? getHuntById(state.huntSession.huntId) : null;

  if (!state.battle.active && state.huntSession.status === "exploring") {
    return renderHuntExplorationPanel();
  }

  return renderBattleSessionView({
    session: state.huntSession,
    title: "Hunt em andamento",
    subtitle: `${activeHunt?.name || "Area desconhecida"} · Status: ${state.huntSession.status}`,
    topSummaryItems: [
      `Vitorias: ${state.huntSession.totalWins}`,
      `Derrotas: ${state.huntSession.totalDefeats}`,
      `Bits: ${state.huntSession.totalBitsEarned}`,
      `EXP: ${state.huntSession.totalExpEarned}`,
      `Tamer EXP: ${state.huntSession.totalTamerExpEarned || 0}`
    ],
    stopButtonText: "Parar hunt",
    getEligibleItemTargets: getBattleItemEligibleTargets,
    onUpdateAutoItemSlot: updateAutoItemSlot,
    dropsTitle: "Itens dropados",
    drops: state.huntSession.drops,
    emptyDropsText: "Nenhum item dropado ate agora.",
    switchDescription: "Escolha outro Digimon vivo do time para entrar em combate. A troca consome o turno do jogador.",
    noBattleMessage: "Nenhuma batalha ativa neste momento.",
    noLiveBattleMessage: "Retornando para o mapa da hunt.",
    getPlaceholderEnemyState: (session) => ({
      name: session.status === "exploring" ? "Mapa da hunt" : "Inimigo",
      type: "Aguardando",
      element: "Standby",
      sprite: "",
      isPlaceholder: true,
      message: session.status === "exploring" ? "Explorando" : "Aguardando",
      detail: session.status === "exploring" ? "Mapa ativo" : "Resolvendo"
    })
  });
}

export function renderHuntsScreen() {
  const player = state.save.party[0];
  const playerLevel = player?.level || 1;

  if (state.huntSession.active) {
    return renderActiveSessionPanel();
  }

  if (state.huntSession.summary) {
    return renderHuntSummaryPanel();
  }

  const cards = HUNTS.map((hunt) => renderHuntCard(hunt, playerLevel)).join("");

  return `
    <section class="screen">
      <div class="panel">
        <h2>Hunts</h2>
        <p>Escolha uma area para explorar em uma hunt ativa.</p>
        ${renderTamerProgress(state.save, { compact: true })}

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Nivel do lider: ${playerLevel}</span>
          <span class="status-pill">Hunts concluidas: ${state.save.progress.huntsCompleted}</span>
          <span class="status-pill">Auto battle padrao: ${state.save.combat?.autoBattleEnabled !== false ? "Ligado" : "Desligado"}</span>
        </div>

        <div class="card-grid">
          ${cards}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

function clearHuntMapKeyHandler() {
  if (!huntMapKeyHandler) {
    return;
  }

  window.removeEventListener("keydown", huntMapKeyHandler);
  huntMapKeyHandler = null;
}

function tryMoveHuntPlayer(direction) {
  try {
    moveHuntPlayer(direction);
  } catch (error) {
    window.alert(error.message || "Nao foi possivel mover agora.");
  }
}

function bindHuntMapControls() {
  document.querySelectorAll(".js-hunt-move").forEach((button) => {
    button.addEventListener("click", () => {
      tryMoveHuntPlayer(button.dataset.direction);
    });
  });

  document.querySelectorAll(".js-hunt-map-encounter").forEach((button) => {
    button.addEventListener("click", () => {
      try {
        triggerHuntMapEncounter(button.dataset.encounterId);
      } catch (error) {
        window.alert(error.message || "Nao foi possivel iniciar o encontro.");
      }
    });
  });

  const keyToDirection = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right"
  };

  huntMapKeyHandler = (event) => {
    const direction = keyToDirection[event.key];

    if (!direction) {
      return;
    }

    const tagName = event.target?.tagName?.toLowerCase();

    if (["input", "select", "textarea"].includes(tagName)) {
      return;
    }

    event.preventDefault();
    tryMoveHuntPlayer(direction);
  };

  window.addEventListener("keydown", huntMapKeyHandler);
}

export function bindHuntsScreen() {
  clearHuntMapKeyHandler();

  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.getElementById("btn-close-hunt-summary")?.addEventListener("click", () => {
    clearHuntSummary();
  });

  if (state.huntSession.active && state.battle.active) {
    bindBattleSessionView({
      onStopSession: stopHuntSession,
      onToggleAutoBattle: toggleAutoBattleMode,
      onPerformManualAction: performManualBattleAction,
      onSwitchDigimon: switchBattleDigimonTurn,
      onUseItemTurn: useBattleItemTurn,
      onBeginItemTargetSelection: beginBattleItemTargetSelection,
      onCancelItemTargetSelection: cancelBattleItemTargetSelection,
      onUpdateAutoItemSlot: updateAutoItemSlot
    });
  }

  if (state.huntSession.active && !state.battle.active && state.huntSession.status === "exploring") {
    document.getElementById("btn-stop-session")?.addEventListener("click", () => {
      stopHuntSession();
    });

    bindHuntMapControls();
  }

  document.querySelectorAll(".js-start-hunt").forEach((button) => {
    button.addEventListener("click", () => {
      const huntId = button.dataset.huntId;

      try {
        startHuntSession(huntId);
      } catch (error) {
        window.alert(error.message || "Nao foi possivel iniciar a hunt.");
      }
    });
  });
}
