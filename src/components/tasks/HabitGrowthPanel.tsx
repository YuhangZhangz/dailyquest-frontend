import {
  GROWTH_CATEGORY_OPTIONS,
  type DailyTask,
  type GrowthCategory,
} from "../../types/task";

type HabitGrowthPanelProps = {
  dailyTasks: DailyTask[];
};

function HabitGrowthPanel({ dailyTasks }: HabitGrowthPanelProps) {
  const linkedDailyCounts = dailyTasks.reduce(
    (counts, task) => {
      if (task.growthCategory !== "NONE") {
        counts[task.growthCategory] = (counts[task.growthCategory] ?? 0) + 1;
      }

      return counts;
    },
    {} as Partial<Record<GrowthCategory, number>>
  );

  const growthCategories = GROWTH_CATEGORY_OPTIONS.filter(
    (option) => linkedDailyCounts[option.value]
  );

  return (
    <section className="habit-growth-panel" aria-labelledby="habit-growth-title">
      <div className="habit-growth-header">
        <span className="section-kicker">PROGRESS</span>
        <h2 id="habit-growth-title">Habit Growth</h2>
        <p>Growth categories linked to your Dailies</p>
      </div>

      {growthCategories.length > 0 ? (
        <div className="habit-growth-grid">
          {growthCategories.map((category) => {
            const linkedCount = linkedDailyCounts[category.value] ?? 0;

            return (
              <article className="habit-growth-card" key={category.value}>
                <div className="habit-growth-card-heading">
                  <h3>{category.label}</h3>
                  <strong>
                    {linkedCount} {linkedCount === 1 ? "daily" : "dailies"}{" "}
                    linked
                  </strong>
                </div>

                <p className="habit-growth-status">Ready to track</p>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="habit-growth-empty">
          <h3>No growth categories yet</h3>
          <p>
            Assign Habit Growth categories to your Dailies to start building
            long-term habits.
          </p>
        </div>
      )}
    </section>
  );
}

export default HabitGrowthPanel;
