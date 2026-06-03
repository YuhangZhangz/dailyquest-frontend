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

type TaskCardProps = {
  task: DailyTask;
  onComplete: (id: number) => void;
  onDelete: (id: number) => void;
};

function TaskCard({ task, onComplete, onDelete }: TaskCardProps) {
  return (
    <article className={`quest-card ${!task.active ? "quest-card-completed" : ""}`}>
    <h2>{task.title}</h2>

    {task.description && <p>{task.description}</p>}

    <p>+{task.baseXp} XP</p>

    <div className="quest-buttons">
        {task.active ? (
        <>
            <button
            className="complete-btn"
            type="button"
            onClick={() => onComplete(task.id)}
            >
            Complete
            </button>

            <button
            className="delete-btn"
            type="button"
            onClick={() => onDelete(task.id)}
            >
            Delete
            </button>
        </>
        ) : (
        <span className="completed-label">Completed</span>
        )}
    </div>
    </article>
  );
}

export default TaskCard;