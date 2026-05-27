type PlayerStatusPanelProps = {
  level: number;
  totalXp: number;
  dailyStreak: number;
};

const labels = {
  achievement: "\u6210\u5C31 \u25B6",
  day: "\u5929",
  exportJson: "\u5BFC\u51FA JSON",
  history: "\u5386\u53F2\u8BB0\u5F55",
  importJson: "\u5BFC\u5165 JSON",
  last: "\u4E0A\u6B21:",
  progress: "\u89D2\u8272\u8FDB\u5EA6",
  recalculate: "\u91CD\u7B97",
  streak: "\u8FDE\u51FB",
  theme: "\u4E3B\u9898: \u65F6\u95F4\u8DDF\u968F",
  total: "\u7D2F\u8BA1",
};

function PlayerStatusPanel({
  level,
  totalXp,
  dailyStreak,
}: PlayerStatusPanelProps) {
  const xpToNextLevel = level * 250;
  const currentLevelXp = totalXp % xpToNextLevel;
  const progressPercent = Math.round((currentLevelXp / xpToNextLevel) * 100);
  const lastUpdated = new Date().toLocaleString();

  return (
    <section className="player-panel" aria-label="Player status">
      <div className="player-panel-header">
        <div className="player-status-grid">
          <article className="player-status-card player-level-card">
            <span>Player Level</span>
            <strong>Lv.{level}</strong>
          </article>

          <article className="player-status-card player-streak-card">
            <strong>
              <span aria-hidden="true">{"\uD83D\uDD25"}</span> {labels.streak}{" "}
              <em>{dailyStreak}</em> {labels.day}
            </strong>
          </article>

          <article className="player-status-card player-xp-card">
            <span>Current XP</span>
            <strong>
              {currentLevelXp}/{xpToNextLevel} XP
            </strong>
          </article>
        </div>

        <nav className="player-actions" aria-label="Player actions">
          <button type="button">{labels.theme}</button>
          <button type="button">English</button>
          <button type="button">{labels.history}</button>
          <button type="button">{labels.recalculate}</button>
          <button type="button">{labels.exportJson}</button>
          <button type="button">{labels.importJson}</button>
        </nav>
      </div>

      <div className="player-progress-header">
        <span>{labels.progress}</span>
        <span>
          {labels.total} {totalXp}
        </span>
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

      <div className="player-panel-footer">
        <button className="player-achievement" type="button">
          {labels.achievement}
        </button>

        <p className="player-last-updated">
          {labels.last} {lastUpdated}
        </p>
      </div>
    </section>
  );
}

export default PlayerStatusPanel;
