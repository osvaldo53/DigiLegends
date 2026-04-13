import { state } from "../../core/state.js";
import { goToScreen } from "../../core/router.js";
import { saveGame } from "../../core/saveManager.js";
import { getItemById } from "../../data/items.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { useItemOnDigimon } from "../../systems/itemSystem.js";
import { escapeHtml } from "../../core/utils.js";

let selectedMenuItemId = null;
let selectedMenuTargetUid = "";

function getAllOwnedDigimons() {
  return [...state.save.party, ...state.save.storage];
}

function getEligibleMenuTargets(item) {
  if (!item?.usableInMenu) {
    return [];
  }

  return getAllOwnedDigimons().filter((digimon) => (digimon.currentHP ?? 0) > 0);
}

function renderItemStatus(item) {
  if (item.usableInMenu) {
    return '<span class="status-pill">Uso no menu</span>';
  }

  return `<span class="status-pill">${
    item.category === "evolution"
      ? "Usado em evolucoes"
      : item.category === "training"
        ? "Usado no treinamento"
      : item.category === "boss"
        ? "Item raro de boss"
        : "Uso apenas em batalha"
  }</span>`;
}

function renderTargetPicker(item) {
  if (!item?.usableInMenu || selectedMenuItemId !== item.id) {
    return "";
  }

  const targets = getEligibleMenuTargets(item);

  if (!targets.length) {
    return `
      <div class="items-target-picker">
        <p class="empty-state">Nao ha Digimon elegivel para receber este item.</p>
      </div>
    `;
  }

  const defaultTargetUid = selectedMenuTargetUid || targets[0]?.uid || "";

  return `
    <div class="items-target-picker">
      <h4>Escolha o Digimon alvo</h4>
      <select
        class="items-target-picker__select"
        id="items-target-select-${escapeHtml(item.id)}"
        data-item-id="${escapeHtml(item.id)}"
      >
        ${targets
          .map((digimon) => {
            const species = getDigimonSpecies(digimon.speciesId);
            const displayName = digimon.nickname?.trim() || species?.name || digimon.speciesId;
            const location = state.save.party.includes(digimon) ? "Time" : "Storage";

            return `
              <option
                value="${escapeHtml(digimon.uid)}"
                ${defaultTargetUid === digimon.uid ? "selected" : ""}
              >
                ${escapeHtml(`${displayName} · Lv. ${digimon.level} · ${location}`)}
              </option>
            `;
          })
          .join("")}
      </select>

      <div class="button-row" style="margin-top:12px;">
        <button
          class="btn btn-primary js-confirm-item-use"
          data-item-id="${escapeHtml(item.id)}"
        >
          Confirmar uso
        </button>
        <button class="btn btn-secondary js-cancel-item-selection">Cancelar</button>
      </div>
    </div>
  `;
}

export function renderItemsScreen() {
  const inventoryHtml = state.save.inventory.length
    ? state.save.inventory
        .map((entry) => {
          const item = getItemById(entry.itemId);
          if (!item) return "";

          const actionHtml = item.usableInMenu
            ? `
                <button
                  class="btn btn-primary js-select-menu-item"
                  data-item-id="${escapeHtml(item.id)}"
                  ${getEligibleMenuTargets(item).length ? "" : "disabled"}
                >
                  ${selectedMenuItemId === item.id ? "Escolhendo alvo" : "Usar"}
                </button>
              `
            : renderItemStatus(item);

          return `
            <article class="hunt-session-box">
              ${
                item.sprite
                  ? `
                    <img
                      class="item-mini-sprite"
                      src="${escapeHtml(item.sprite)}"
                      alt="${escapeHtml(item.name)}"
                      onerror="this.style.display='none'"
                    />
                  `
                  : ""
              }
              <h3>${escapeHtml(item.name)}</h3>
              <p class="hunt-session__muted">${escapeHtml(item.description)}</p>
              <p>Quantidade: ${entry.quantity}</p>

              <div class="button-row" style="margin-top:12px;">
                ${actionHtml}
              </div>

              ${renderTargetPicker(item)}
            </article>
          `;
        })
        .join("")
    : '<p class="hunt-session__muted">Seu inventario esta vazio.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <h2>Itens</h2>
        <p>Escolha um item, selecione o alvo na lista e confirme o uso.</p>

        <div id="itemsFeedback" class="hunt-action-banner" style="display:none; margin-bottom:16px;"></div>

        <div class="card-grid">
          ${inventoryHtml}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindItemsScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    selectedMenuItemId = null;
    selectedMenuTargetUid = "";
    goToScreen("home");
  });

  document.querySelectorAll(".js-select-menu-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      selectedMenuItemId = selectedMenuItemId === itemId ? null : itemId;
      selectedMenuTargetUid = "";
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.querySelectorAll(".js-cancel-item-selection").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMenuItemId = null;
      selectedMenuTargetUid = "";
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.querySelectorAll(".items-target-picker__select").forEach((select) => {
    select.addEventListener("change", () => {
      selectedMenuTargetUid = select.value || "";
    });
  });

  document.querySelectorAll(".js-confirm-item-use").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const select = document.getElementById(`items-target-select-${itemId}`);
      const digimonUid = select?.value || selectedMenuTargetUid;
      const feedback = document.getElementById("itemsFeedback");
      const targetDigimon = getAllOwnedDigimons().find(
        (digimon) => digimon.uid === digimonUid
      );

      if (!targetDigimon) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = "Nao foi possivel localizar o Digimon alvo.";
        }
        return;
      }

      const item = getItemById(itemId);
      const species = getDigimonSpecies(targetDigimon.speciesId);
      const displayName = targetDigimon.nickname?.trim() || species?.name || "Digimon";
      const confirmed = window.confirm(
        `Deseja usar ${item?.name || itemId} em ${displayName}?`
      );

      if (!confirmed) {
        return;
      }

      try {
        const result = useItemOnDigimon({
          save: state.save,
          itemId,
          targetDigimon,
          context: "menu"
        });

        saveGame(state.save);
        selectedMenuItemId = null;
        selectedMenuTargetUid = "";

        const levelMessage =
          result.progression?.gainedLevels > 0
            ? ` ${displayName} subiu ${result.progression.gainedLevels} nivel(is).`
            : "";

        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = `${result.item.name} usado com sucesso em ${displayName}.${levelMessage}`;
        }

        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        if (feedback) {
          feedback.style.display = "block";
          feedback.textContent = error.message || "Nao foi possivel usar o item.";
        }
      }
    });
  });
}
