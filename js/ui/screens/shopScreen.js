import { goToScreen } from "../../core/router.js";
import { state } from "../../core/state.js";
import { getShopEntries } from "../../data/shopCatalog.js";
import { buyItem, buyItemBulk } from "../../systems/shopSystem.js";
import { getInventoryEntry } from "../../systems/itemSystem.js";
import { escapeHtml } from "../../core/utils.js";

/**
 * Estado local da tela da loja.
 *
 * Mantém a quantidade escolhida por item.
 */
const shopViewState = {
  quantities: {}
};

/**
 * Retorna a quantidade atualmente selecionada para um item.
 *
 * @param {string} itemId
 * @returns {number}
 */
function getSelectedQuantity(itemId) {
  return Math.max(1, Number(shopViewState.quantities[itemId]) || 1);
}

/**
 * Define a quantidade selecionada para um item.
 *
 * @param {string} itemId
 * @param {number} quantity
 */
function setSelectedQuantity(itemId, quantity) {
  shopViewState.quantities[itemId] = Math.max(1, Number(quantity) || 1);
}

/**
 * Renderiza a tela da loja.
 *
 * Funcionalidades:
 * - mostra preço
 * - mostra quantidade possuída
 * - permite aumentar/diminuir quantidade antes da compra
 */
export function renderShopScreen() {
  const entries = getShopEntries();

  const itemsHtml = entries.length
    ? entries
        .map((entry) => {
          const { item, price } = entry;
          const selectedQuantity = getSelectedQuantity(item.id);
          const totalPrice = price * selectedQuantity;
          const inventoryEntry = getInventoryEntry(state.save, item.id);
          const ownedQuantity = inventoryEntry?.quantity ?? 0;

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

              <p>Preço unitário: ${price} Bits</p>
              <p>Você possui: ${ownedQuantity}</p>

              <div class="button-row" style="align-items:center; margin: 12px 0;">
                <button
                  class="btn btn-secondary js-shop-minus"
                  data-item-id="${escapeHtml(item.id)}"
                  aria-label="Diminuir quantidade"
                >
                  -
                </button>

                <span class="status-pill">
                  Quantidade: ${selectedQuantity}
                </span>

                <button
                  class="btn btn-secondary js-shop-plus"
                  data-item-id="${escapeHtml(item.id)}"
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              <p><strong>Total:</strong> ${totalPrice} Bits</p>

              <div class="button-row" style="margin-top:12px;">
                <button
                  class="btn btn-primary js-buy-item"
                  data-item-id="${escapeHtml(item.id)}"
                >
                  Comprar
                </button>
              </div>
            </article>
          `;
        })
        .join("")
    : '<p class="empty-state">Nenhum item disponível na loja.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <h2>Loja</h2>
        <p>Compre itens de cura usando seus Bits.</p>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Bits atuais: ${state.save.bits}</span>
        </div>

        <div id="shopFeedback" class="hunt-action-banner" style="display:none; margin-bottom:16px;"></div>

        <div class="card-grid">
          ${itemsHtml}
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

/**
 * Eventos da tela da loja.
 */
export function bindShopScreen() {
  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-shop-minus").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const currentQuantity = getSelectedQuantity(itemId);
      setSelectedQuantity(itemId, Math.max(1, currentQuantity - 1));
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.querySelectorAll(".js-shop-plus").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const currentQuantity = getSelectedQuantity(itemId);
      setSelectedQuantity(itemId, currentQuantity + 1);
      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });

  document.querySelectorAll(".js-buy-item").forEach((button) => {
    button.addEventListener("click", () => {
      const itemId = button.dataset.itemId;
      const feedback = document.getElementById("shopFeedback");
      const quantity = getSelectedQuantity(itemId);

      const result =
        quantity > 1
          ? buyItemBulk(itemId, quantity)
          : buyItem(itemId);

      if (feedback) {
        feedback.style.display = "block";
        feedback.textContent = result.message;
      }

      window.dispatchEvent(new Event("digilegends:rerender"));
    });
  });
}
