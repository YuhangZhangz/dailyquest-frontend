const habitGrowthItems = [
  { name: "Reading", days: 8, goal: 21 },
  { name: "Fitness", days: 12, goal: 21 },
  { name: "English", days: 10, goal: 21 },
  { name: "Sleep", days: 5, goal: 21 },
];

function HabitGrowthPanel() {
  return (
    <section className="habit-growth-panel" aria-labelledby="habit-growth-title">
      <div className="habit-growth-header">
        <span className="section-kicker">PROGRESS</span>
        <h2 id="habit-growth-title">Habit Growth</h2>
        <p>Unlocked automatically from your daily consistency</p>
      </div>

      <div className="habit-growth-grid">
        {habitGrowthItems.map((habit) => {
          const progress = Math.round((habit.days / habit.goal) * 100);

          return (
            <article className="habit-growth-card" key={habit.name}>
              <div className="habit-growth-card-heading">
                <h3>{habit.name}</h3>
                <strong>
                  {habit.days}/{habit.goal} days
                </strong>
              </div>

              <div
                className="habit-growth-track"
                role="progressbar"
                aria-label={`${habit.name} habit growth`}
                aria-valuemin={0}
                aria-valuemax={habit.goal}
                aria-valuenow={habit.days}
              >
                <span style={{ width: `${progress}%` }} />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default HabitGrowthPanel;
