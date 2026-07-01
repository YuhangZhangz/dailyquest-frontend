import { useEffect, useRef, useState } from "react";
import EditTaskModal from "./EditTaskModal";
import {
  GROWTH_CATEGORY_OPTIONS,
  type DailyTask,
  type GrowthCategory,
  type TaskType,
} from "../../types/task";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Circle,
  GitFork,
  Square,
  MoreVertical,
} from "lucide-react";
import fireLogo from "../../assets/fire_logo.png";

type TaskCardProps = {
  task: DailyTask;
  onComplete: (id: number, baseXp?: number, x?: number, y?: number) => void;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    difficulty: string,
    taskType: TaskType,
    dueDate: string | null,
    growthCategory: GrowthCategory
  ) => void;
  onRevert: (id: number) => void;

  onAddSubTask?: (taskId: number, title: string) => void;
  onToggleSubTask?: (taskId: number, subTaskId: number) => void;
  onDeleteSubTask?: (taskId: number, subTaskId: number) => void;
  onReorderSubTask?: (taskId: number, orderedIds: number[]) => void;
  onEditSubTask?: (taskId: number, subTaskId: number, title: string) => void;
};

function TaskCard({
  task,
  onComplete,
  onDelete,
  onUpdate,
  onRevert,
  onAddSubTask,
  onDeleteSubTask,
  onToggleSubTask,
  onReorderSubTask,
  onEditSubTask,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [areSubTasksExpanded, setAreSubTasksExpanded] = useState(() => {
    const savedValue = localStorage.getItem(
      `task-subtasks-expanded-${task.id}`
    );

    return savedValue === null ? true : savedValue === "true";
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const today = new Date().toLocaleDateString("en-CA");

  const isDailyCompletedToday =
    task.taskType === "DAILY" && task.lastCompletedDate === today;

  const isCompleted =
    task.taskType === "TODO"
      ? !task.active
      : task.taskType === "DAILY"
      ? isDailyCompletedToday
      : false;

  const showCompleteCircle = task.taskType === "DAILY";

  const hasSubTasks =
    task.taskType !== "HABIT" && task.subTasks && task.subTasks.length > 0;

  function handleToggleSubTasks() {
    if (!hasSubTasks) return;

    const nextExpandedState = !areSubTasksExpanded;
    setAreSubTasksExpanded(nextExpandedState);
    localStorage.setItem(
      `task-subtasks-expanded-${task.id}`,
      String(nextExpandedState)
    );
  }

  return (
    <article
      className={`quest-card quest-card-${task.taskType.toLowerCase()} ${
        isCompleted ? "quest-card-completed" : ""
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
            <MoreVertical size={18} strokeWidth={2.5} />
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
        {showCompleteCircle && (
          <button
            type="button"
            className={`task-complete-circle ${isCompleted ? "completed" : ""}`}
            data-no-drag="true"
            onClick={(event) => {
              event.stopPropagation();

              if (isCompleted) {
                onRevert(task.id);
                return;
              }

              onComplete(task.id, task.baseXp, event.clientX, event.clientY);
            }}
            aria-label={isCompleted ? "Undo completion" : "Complete task"}
          >
            {isCompleted && <Check size={14} strokeWidth={3.2} />}
          </button>
        )}

        <h2>{task.title}</h2>

        {task.taskType === "DAILY" && task.growthCategory !== "NONE" && (
          <span className="growth-category-hint">
            🌱 {getGrowthCategoryLabel(task.growthCategory)}
          </span>
        )}

        <div className="task-inline-meta">
          <span
            className={`difficulty-pill difficulty-${task.difficulty.toLowerCase()}`}
          >
            {getDifficultyLabel(task.difficulty)}
          </span>

          <span className="meta-separator">·</span>

          <span className="task-xp-text">{task.baseXp} XP</span>

          {task.taskType === "DAILY" && (
            <span className="task-coin-text">
              <img className="task-fire-icon" src={fireLogo} alt="" />
              <span>{task.completedCount}</span>
            </span>
          )}
        </div>
      </div>

      {task.description && <p>{task.description}</p>}

      {task.taskType === "TODO" && task.dueDate && (
        <p className="task-meta">Due: {task.dueDate}</p>
      )}

      {hasSubTasks && <div className="task-divider" />}

      {hasSubTasks && (
        <button
          className="task-subtasks-header"
          type="button"
          data-no-drag="true"
          onClick={handleToggleSubTasks}
          aria-expanded={areSubTasksExpanded}
          aria-controls={`task-subtasks-${task.id}`}
        >
          <span className="task-subtasks-header-label">
            <GitFork size={18} strokeWidth={2.4} />
            <span>
              Subtasks (
              {task.subTasks.filter((subTask) => subTask.completed).length}/
              {task.subTasks.length})
            </span>
          </span>

          {areSubTasksExpanded ? (
            <ChevronDown size={20} strokeWidth={2.5} />
          ) : (
            <ChevronRight size={20} strokeWidth={2.5} />
          )}
        </button>
      )}

      {hasSubTasks && areSubTasksExpanded && (
        <div
          id={`task-subtasks-${task.id}`}
          className="task-subtask-preview"
        >
          {[...(task.subTasks ?? [])]
            .sort(
              (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id
            )
            .map((subTask) => (
              <div
                key={subTask.id}
                className="task-subtask-preview-item"
                data-no-drag="true"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleSubTask?.(task.id, subTask.id);
                }}
              >
                <span
                  className={
                    subTask.completed ? "preview-check completed" : "preview-check"
                  }
                >
                  {subTask.completed ? (
                    <Check size={11} strokeWidth={3.2} />
                  ) : (
                    <Square size={20} strokeWidth={2.3} />
                  )}
                </span>

                <span
                  className={
                    subTask.completed
                      ? "preview-title completed"
                      : "preview-title"
                  }
                >
                  {subTask.title}
                </span>
              </div>
            ))}
        </div>
      )}

      {task.taskType === "HABIT" && (
        <div className="quest-buttons">
          <div className="habit-counter-actions">
            <button
              className="habit-counter-btn habit-minus-btn"
              type="button"
              onClick={() => onRevert(task.id)}
            >
              −
            </button>

            <span className="habit-counter-number">
              {task.completedCount ?? 0}
            </span>

            <button
              className="habit-counter-btn habit-plus-btn"
              type="button"
              onClick={() => onComplete(task.id)}
            >
              +
            </button>
          </div>
        </div>
      )}

      {task.taskType === "TODO" && (
        <div className="quest-buttons">
          {task.active ? (
            <button
              className="complete-btn todo-complete-btn"
              type="button"
              onClick={(event) => {
                onComplete(task.id, task.baseXp, event.clientX, event.clientY);
              }}
            >
              <span className="todo-complete-icon">
                <Circle size={18} strokeWidth={2.4} />
              </span>
              Complete
            </button>
          ) : (
            <button
              className="complete-btn todo-complete-btn todo-complete-btn-completed"
              type="button"
              onClick={() => onRevert(task.id)}
            >
              <span className="todo-complete-icon completed">
                <Check size={14} strokeWidth={3.2} />
              </span>
              Complete
            </button>
          )}
        </div>
      )}

      {isEditing && (
        <EditTaskModal
          task={task}
          onClose={() => setIsEditing(false)}
          onUpdate={onUpdate}
          onAddSubTask={onAddSubTask}
          onToggleSubTask={onToggleSubTask}
          onDeleteSubTask={onDeleteSubTask}
          onReorderSubTask={onReorderSubTask}
            onEditSubTask={onEditSubTask}
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

function getGrowthCategoryLabel(growthCategory: GrowthCategory) {
  return (
    GROWTH_CATEGORY_OPTIONS.find(
      (option) => option.value === growthCategory
    )?.label ?? growthCategory
  );
}

export default TaskCard;
