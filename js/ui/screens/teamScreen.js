import { state } from "../../core/state.js";
import { goToScreen } from "../../core/router.js";
import { saveGame } from "../../core/saveManager.js";
import { getDigimonSpecies } from "../../data/digimons.js";
import { getEvolutionRule } from "../../data/evolutionRules.js";
import { getItemById } from "../../data/items.js";
import { evolveDigimon } from "../../systems/evolutionSystem.js";
import {
  clearEvolutionAnimation,
  showEvolutionAnimation
} from "../../systems/evolutionAnimationSystem.js";
import {
  moveDigimonToParty,
  moveDigimonToStorage,
  PARTY_LIMIT,
  setPartyLeader
} from "../../systems/storageSystem.js";
import { renderTeamCard } from "../components/teamCard.js";

function buildEvolutionAnimationData({
  previousSpecies,
  nextSpecies,
  rule,
  partnerDigimon,
  partnerSpecies,
  requiredItem
}) {
  const animation = {
    heading: "Evolucao completa",
    subheading: `${previousSpecies.name} agora e ${nextSpecies.name}`,
    mode: "standard",
    from: {
      name: previousSpecies.name,
      sprite: previousSpecies.sprite
    },
    to: {
      name: nextSpecies.name,
      sprite: nextSpecies.sprite
    }
  };

  if (rule?.type === "dna" && partnerSpecies) {
    const partnerName =
      partnerDigimon?.nickname?.trim() || partnerSpecies.name;

    animation.mode = "dna";
    animation.heading = "DNA Evolution completa";
    animation.subheading = `${previousSpecies.name} e ${partnerName} se fundiram em ${nextSpecies.name}`;
    animation.sources = [
      {
        label: "Base 1",
        name: previousSpecies.name,
        sprite: previousSpecies.sprite
      },
      {
        label: "Base 2",
        name: partnerName,
        sprite: partnerSpecies.sprite
      }
    ];
  }

  if (rule?.type === "armor" && requiredItem) {
    animation.mode = "armor";
    animation.heading = "Armor Evolution completa";
    animation.subheading = `${previousSpecies.name} despertou ${nextSpecies.name} com ${requiredItem.name}`;
    animation.sources = [
      {
        label: "Base",
        name: previousSpecies.name,
        sprite: previousSpecies.sprite
      },
      {
        label: "Digi-Ovo",
        name: requiredItem.name,
        sprite: requiredItem.sprite || ""
      }
    ];
  }

  return animation;
}

export function renderTeamScreen() {
  const partyCards = state.save.party.length
    ? state.save.party
        .map((digimon, index) =>
          renderTeamCard(digimon, {
            context: "party",
            isLeader: index === 0,
            save: state.save
          })
        )
        .join("")
    : '<p class="empty-state">Seu time está vazio.</p>';

  const storageCards = state.save.storage.length
    ? state.save.storage
        .map((digimon) =>
          renderTeamCard(digimon, {
            context: "storage",
            isLeader: false,
            save: state.save
          })
        )
        .join("")
    : '<p class="empty-state">Seu storage está vazio.</p>';

  return `
    <section class="screen">
      <div class="panel">
        <div class="team-header">
          <h2>Digimons</h2>
          <p>Gerencie seu time ativo e os Digimons armazenados.</p>
        </div>

        <div class="button-row" style="margin-bottom:16px;">
          <span class="status-pill">Time: ${state.save.party.length}/${PARTY_LIMIT}</span>
          <span class="status-pill">Storage: ${state.save.storage.length}</span>
          ${
            state.save.party[0]
              ? `<span class="status-pill">Líder: ${state.save.party[0].nickname?.trim() || state.save.party[0].speciesId}</span>`
              : ""
          }
        </div>

        <div class="team-section">
          <h3 style="margin-bottom:10px;">Time ativo</h3>
          <div class="team-card-grid">
            ${partyCards}
          </div>
        </div>

        <div class="team-section" style="margin-top:20px;">
          <h3 style="margin-bottom:10px;">Storage</h3>
          <div class="team-card-grid">
            ${storageCards}
          </div>
        </div>

        <div class="button-row" style="margin-top:18px;">
          <button class="btn btn-secondary" id="btn-back-home">Voltar</button>
        </div>
      </div>
    </section>
  `;
}

export function bindTeamScreen() {
  document.querySelectorAll(".js-close-evolution-modal").forEach((button) => {
    button.addEventListener("click", () => {
      clearEvolutionAnimation();
    });
  });

  document.getElementById("btn-back-home")?.addEventListener("click", () => {
    goToScreen("home");
  });

  document.querySelectorAll(".js-evolve-digimon").forEach((button) => {
    button.addEventListener("click", () => {
      const digimonUid = button.dataset.digimonUid;
      const targetSpeciesId = button.dataset.targetSpeciesId;
      const partnerSelectId = button.dataset.partnerSelectId;

      const playerDigimon = state.save.party.find(
        (digimon) => digimon.uid === digimonUid
      );

      if (!playerDigimon) {
        window.alert("Não foi possível localizar o Digimon selecionado.");
        return;
      }

      const partnerUid = partnerSelectId
        ? document.getElementById(partnerSelectId)?.value || ""
        : "";

      try {
        const previousSpecies = getDigimonSpecies(playerDigimon.speciesId);
        const rule = getEvolutionRule(playerDigimon.speciesId, targetSpeciesId);
        const partnerDigimon = partnerUid
          ? state.save.party.find((digimon) => digimon.uid === partnerUid) ||
            state.save.storage.find((digimon) => digimon.uid === partnerUid) ||
            null
          : null;
        const partnerSpecies = rule?.partnerSpeciesId
          ? getDigimonSpecies(rule.partnerSpeciesId)
          : null;
        const requiredItem = rule?.requiredItemId
          ? getItemById(rule.requiredItemId)
          : null;

        if (targetSpeciesId === "omnimon") {
          const partnerSelect = partnerSelectId
            ? document.getElementById(partnerSelectId)
            : null;
          const partnerLabel =
            partnerSelect?.selectedOptions?.[0]?.textContent?.trim() ||
            "parceiro selecionado";
          const confirmed = window.confirm(
            `A DNA Evolution para Omnimon vai consumir ${partnerLabel}. Deseja continuar?`
          );

          if (!confirmed) {
            return;
          }
        }

        evolveDigimon(playerDigimon, targetSpeciesId, state.save, { partnerUid });
        const nextSpecies = getDigimonSpecies(playerDigimon.speciesId);
        saveGame(state.save);
        const animationData = buildEvolutionAnimationData({
          previousSpecies,
          nextSpecies,
          rule,
          partnerDigimon,
          partnerSpecies,
          requiredItem
        });
        showEvolutionAnimation(animationData);
        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        window.alert(error.message || "Não foi possível evoluir o Digimon.");
      }
    });
  });

  document.querySelectorAll(".js-send-to-storage").forEach((button) => {
    button.addEventListener("click", () => {
      const digimonUid = button.dataset.digimonUid;

      try {
        moveDigimonToStorage(state.save, digimonUid);
        saveGame(state.save);
        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        window.alert(error.message || "Não foi possível enviar o Digimon ao storage.");
      }
    });
  });

  document.querySelectorAll(".js-send-to-party").forEach((button) => {
    button.addEventListener("click", () => {
      const digimonUid = button.dataset.digimonUid;

      try {
        moveDigimonToParty(state.save, digimonUid);
        saveGame(state.save);
        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        window.alert(error.message || "Não foi possível adicionar o Digimon ao time.");
      }
    });
  });

  document.querySelectorAll(".js-set-party-leader").forEach((button) => {
    button.addEventListener("click", () => {
      const digimonUid = button.dataset.digimonUid;

      try {
        setPartyLeader(state.save, digimonUid);
        saveGame(state.save);
        window.dispatchEvent(new Event("digilegends:rerender"));
      } catch (error) {
        window.alert(error.message || "Não foi possível definir o líder.");
      }
    });
  });
}
