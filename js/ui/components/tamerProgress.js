import { escapeHtml, clamp } from "../../core/utils.js";
import {
  getTamerExpToNextLevel,
  getTamerProgress,
  TAMER_MAX_LEVEL
} from "../../systems/tamerProgressionSystem.js";

export function renderTamerProgress(save, options = {}) {
  const tamer = getTamerProgress(save);
  const expToNextLevel = getTamerExpToNextLevel(tamer.level);
  const isMaxLevel = tamer.level >= TAMER_MAX_LEVEL;
  const progressPercent = isMaxLevel
    ? 100
    : clamp((tamer.exp / expToNextLevel) * 100, 0, 100);
  const playerName = save.playerName?.trim() || "Sem nome";

  return `
    <div class="tamer-progress ${options.compact ? "tamer-progress--compact" : ""}">
      <div class="tamer-progress__top">
        <div>
          <span class="tamer-progress__eyebrow">Tamer</span>
          <strong>${escapeHtml(playerName)} · Lv. ${tamer.level}</strong>
        </div>
        <span>${isMaxLevel ? "MAX" : `${tamer.exp}/${expToNextLevel}`}</span>
      </div>
      <div class="tamer-progress__bar">
        <span style="width:${progressPercent}%;"></span>
      </div>
    </div>
  `;
}
