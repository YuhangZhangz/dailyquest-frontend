import { useEffect, useRef, useState } from "react";
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
  completedCount: number;
  lastCompletedDate: string | null;
  dueDate: string | null;
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
    taskType: TaskType,
    dueDate: string | null
  ) => void;
  onRevert: (id: number) => void;
};

function TaskCard({
  task,
  onComplete,
  onDelete,
  onUpdate,
  onRevert,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  
  // Check if the daily task has already been completed today
  const today = new Date().toLocaleDateString("en-CA");

  const isDailyCompletedToday =
    task.taskType === "DAILY" && task.lastCompletedDate === today;

    return (
    <article
      className={`quest-card quest-card-${task.taskType.toLowerCase()} ${
        !task.active ? "quest-card-completed" : ""
      }`}
    >
      {task.active && (
        <div className="task-menu" ref={menuRef}>
          <button
            className="edit-corner-btn"
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open task menu"
          >
            ⋯
          </button>

          {menuOpen && (
            <div className="task-menu-dropdown">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setMenuOpen(false);
                }}
              >
                Edit
              </button>

              <button
                type="button"
                className="menu-delete-btn"
                onClick={() => {
                  onDelete(task.id);
                  setMenuOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}

      <div className="quest-card-title-row">
        <h2>{task.title}</h2>

        <span className="difficulty-pill">
          {getDifficultyLabel(task.difficulty)} · {task.baseXp} XP
        </span>
      </div>

      {task.description && <p>{task.description}</p>}

      {task.taskType === "HABIT" && (
        <p className="task-meta">Completed {task.completedCount} times</p>
      )}
      
      {task.taskType === "DAILY" && (
        <p className="task-meta">
          Completed {task.completedCount} {task.completedCount === 1 ? "day" : "days"}
        </p>
      )}

      {task.taskType === "TODO" && task.dueDate && (
        <p className="task-meta">Due: {task.dueDate}</p>
      )}

      <div className="quest-buttons">
        {task.taskType === "HABIT" ? (
          <div className="habit-split-actions">
            <button
              className="habit-side-btn habit-minus-btn"
              type="button"
              onClick={() => {
                console.log("Habit plus clicked:", task.id);
                onRevert(task.id);}}
            >
              −
            </button>

            <button
              className="habit-side-btn habit-plus-btn"
              type="button"
              onClick={() => {
                console.log("Habit plus clicked:", task.id);
                onComplete(task.id);}}
            >
              +
            </button>
          </div>
          ) : isDailyCompletedToday ? (
            <button
              className="revert-btn"
              type="button"
              onClick={() => onRevert(task.id)}
            >
              Undo
            </button>
          ) : task.active ? (
          <button
            className="complete-btn"
            type="button"
            onClick={() => onComplete(task.id)}
          >
            Complete
          </button>
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
          onUpdate={onUpdate}
        />
      )}
    </article>
  );
}

function getDifficultyLabel(difficulty: string) {
  switch (difficulty) {
    case "T1":
      return "🟢 Easy";
    case "T2":
      return "🟡 Normal";
    case "T3":
      return "🔵 Hard";
    case "T4":
      return "🔴 Elite";
    case "BOSS":
      return "👑 Boss";
    default:
      return difficulty;
  }
}

export default TaskCard;