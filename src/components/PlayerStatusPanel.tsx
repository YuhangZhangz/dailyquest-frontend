import { CircleHelp, Coins } from "lucide-react";
import "../styles/Tasks.css";

// Props type: data received from the parent component
type PlayerStatusPanelProps = {
  level: number;
  totalXp: number;
  dailyStreak: number;
  coinBalance: number;
};

function PlayerStatusPanel({
  level,
  totalXp,
  dailyStreak,
  coinBalance,
}: PlayerStatusPanelProps) {
  // XP required to move from the current level to the next level
  const xpToNextLevel = getRequiredXpForLevel(level);

  // XP earned within the current level
  // totalXp is lifetime XP, so we subtract the XP required to reach this level
  const currentLevelXp = totalXp - getXpRequiredToReachLevel(level);

  // Current level progress percentage
  // Math.min prevents the progress from going over 100%
  const progressPercent = Math.round(
    Math.min((currentLevelXp / xpToNextLevel) * 100, 100)
  );

  return (
    <section className="player-panel" aria-label="Player status">
      {/* Top player status cards */}
      <div className="player-status-grid">
        {/* Player level card */}
        <article className="player-status-card">
          <span>PLAYER LEVEL</span>
          <strong>Lv. {level}</strong>
        </article>

        {/* Daily streak card */}
        <article className="player-status-card">
          <span>STREAK</span>
          <strong>
            🔥 <em>{dailyStreak}</em> days
          </strong>
        </article>

        {/* Current level XP card */}
        <article className="player-status-card">
          <span>CURRENT XP</span>
          <strong>
            {currentLevelXp}/{xpToNextLevel} XP
          </strong>
        </article>

        {/* Coin balance card */}
        <article className="player-status-card player-coins-card">
          <span>COINS</span>

          <strong className="coin-value">
            <Coins size={18} strokeWidth={2.2} />
            {coinBalance}
          </strong>
        </article>
      </div>

      {/* Character progress card */}
      <div className="character-progress-card">
        <div className="character-progress-label">
          <span>Character Progress</span>
          <CircleHelp size={14} strokeWidth={2.4} />
        </div>

        <div
          className="xp-progress"
          role="progressbar"
          aria-label="XP progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
        >
          <div
            className="xp-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="character-progress-meta">
          <strong>{progressPercent}%</strong>
        </div>
      </div>
    </section>
  );
}

// Calculate how much XP is needed to level up from the current level
// Example: Lv.1 = 100, Lv.2 = 150, Lv.3 = 200
function getRequiredXpForLevel(level: number) {
  return 100 + (level - 1) * 50;
}

// Calculate the total XP required to reach the current level
// Example: to reach Lv.3, the user needs Lv.1 XP + Lv.2 XP
function getXpRequiredToReachLevel(level: number) {
  let total = 0;

  for (let currentLevel = 1; currentLevel < level; currentLevel++) {
    total += getRequiredXpForLevel(currentLevel);
  }

  return total;
}

export default PlayerStatusPanel;