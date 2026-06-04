import { useState } from "react";
import EditTaskModal from "./EditTaskModal";

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
  onUpdate: (
    id: number,
    title: string,
    description: string,
    difficulty: string,
    taskType: TaskType
  ) => void;
  onRevert: (id: number) => void;
};

function TaskCard({ task, onComplete, onDelete, onUpdate, onRevert }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <article
      className={`quest-card quest-card-${task.taskType.toLowerCase()} ${
        !task.active ? "quest-card-completed" : ""
      }`}
    >
      {task.active && (
        <button
          className="edit-corner-btn"
          type="button"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
      )}

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
          <button
            className="revert-btn"
            type="button"
            onClick={() => onRevert(task.id)}
          >
            Undo
          </button>
        )}
      </div>

      {isEditing && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          onSave={onUpdate}
        />
      )}
    </article>
  );
}

export default TaskCard;