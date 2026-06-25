import { CircleHelp } from "lucide-react";
import levelLogo from "../assets/level_logo.png";
import fireLogo from "../assets/fire_logo.png";
import coinLogo from "../assets/coin_logo.png";
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
  const xpRemaining = Math.max(xpToNextLevel - currentLevelXp, 0);

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
        <article className="player-status-card player-level-card">
          <img className="level-logo" src={levelLogo} alt="Level badge" />

          <div className="level-card-content">
            <span>LEVEL</span>
            <strong>Lv. {level}</strong>
            <small>Next: {xpRemaining} XP</small>
          </div>

          <div
            className="level-progress-ring"
            style={
              {
                "--level-progress": `${progressPercent}%`,
                "--level-angle": `${progressPercent * 3.6}deg`,
              } as React.CSSProperties
            }
            aria-label={`Level progress ${progressPercent}%`}
          />
        </article>

        {/* Current level XP card */}
        <article className="player-status-card xp-status-card">
          <span>CURRENT XP</span>

          <strong className="xp-card-value">
            <span className="xp-current">{currentLevelXp}</span>
            <span className="xp-total">/ {xpToNextLevel} XP</span>
          </strong>

          <small className="xp-card-hint">
            Lifetime: {totalXp} XP
          </small>
        </article>

        {/* Daily streak card */}
        <article className="player-status-card streak-card">
          <div className="streak-logo-frame">
            <img className="streak-logo" src={fireLogo} alt="Streak flame" />
          </div>

          <div className="streak-card-content">
            <span className="streak-label">STREAK</span>
              <strong className="streak-value">
                <span className="streak-number">{dailyStreak}</span>
                <span className="streak-unit">days</span>
              </strong>
            <small>Keep going!</small>
          </div>
        </article>

        {/* Coin balance card */}
        <article className="player-status-card player-coins-card">
          <img className="coin-logo" src={coinLogo} alt="Coins" />

          <div className="coin-card-content">
            <span>COINS</span>
            <strong className="coin-value">{coinBalance}</strong>
            <small>Keep earning!</small>
          </div>
        </article>
        {/* Weekly Score card */}
        {/* Coming Soon */}
        <article className="player-status-card weekly-score-card">
          <span>WEEKLY SCORE</span>
          <strong className="weekly-score-value">Coming Soon</strong>
          <small className="weekly-score-hint">Weekly review</small>
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