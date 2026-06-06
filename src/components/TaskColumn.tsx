import TaskCard from "./TaskCard";

type TaskType = "HABIT" | "DAILY" | "TODO";

type DailyTask = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  taskType: TaskType;
  baseXp: number;
  active: boolean;
  createdAt: string;
};

type TaskColumnProps = {
  title: string;
  tasks: DailyTask[];
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    difficulty: string,
    taskType: TaskType
  ) => void;
  onRevert: (id: number) => void;
};

function TaskColumn({
  title,
  tasks,
  onComplete,
  onDelete,
  onUpdate,
  onRevert,
}: TaskColumnProps) {
  return (
    <section className="task-column">
      <div className="task-column-header">
        <h2>{title}</h2>
        <span className="task-count-pill">{tasks.length}</span>
      </div>

      <div className="task-column-body">
        {tasks.length > 0 ? (
          <div className="quest-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
                onUpdate={onUpdate}
                onRevert={onRevert}
              />
            ))}
          </div>
        ) : (
          <div className="task-section-empty">
            <div className="empty-icon">＋</div>
            <h3>{getEmptyTitle(title)}</h3>
            <p>{getEmptyDescription(title)}</p>
          </div>
        )}
      </div>
    </section>
  );
}

function getEmptyTitle(title: string) {
  if (title.includes("Habits")) return "No habits yet";
  if (title.includes("Dailies")) return "No dailies yet";
  if (title.includes("Todos")) return "No todos yet";
  return "No tasks yet";
}

function getEmptyDescription(title: string) {
  if (title.includes("Habits")) {
    return "Habits are repeatable actions you want to build.";
  }

  if (title.includes("Dailies")) {
    return "Dailies are tasks you want to complete every day.";
  }

  if (title.includes("Todos")) {
    return "Todos are one-time tasks you can finish and clear.";
  }

  return "Add a quest when you are ready.";
}

export default TaskColumn;