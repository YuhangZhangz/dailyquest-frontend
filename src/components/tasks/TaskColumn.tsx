import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import TaskCard from "./TaskCard";
import type { DailyTask, GrowthCategory, TaskType } from "../../types/task";

type TaskColumnProps = {
  title: string;
  addLabel: string;
  taskType: TaskType;
  tasks: DailyTask[];
  onAdd: () => void;
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
  onReorder: (taskType: TaskType, orderedIds: number[]) => void;

  // Optional because Habits do not use subtasks
  onAddSubTask?: (taskId: number, title: string) => void;
  onToggleSubTask?: (taskId: number, subTaskId: number) => void;
  onDeleteSubTask?: (taskId: number, subTaskId: number) => void;
  onReorderSubTask?: (taskId: number, orderedIds: number[]) => void;
  onEditSubTask?: (taskId: number, subTaskId: number, title: string) => void;
};

function TaskColumn({
  title,
  addLabel,
  taskType,
  tasks,
  onAdd,
  onComplete,
  onDelete,
  onUpdate,
  onRevert,
  onReorder,
  onAddSubTask,
  onDeleteSubTask,
  onToggleSubTask,
  onReorderSubTask,
  onEditSubTask,
}: TaskColumnProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const displayCount = title.includes("Todos")
    ? tasks.filter((task) => task.active).length
    : tasks.length;
  
    const displayTasks = tasks;
  
  useEffect(() => {
    if (!listRef.current) return;

    const sortable = Sortable.create(listRef.current, {
      animation: 150,

      // Each task's outer wrapper can be dragged.
      draggable: ".sortable-task-item",

      // Dragging across columns is not allowed.
      group: {
        name: `task-column-${taskType}`,
        pull: false,
        put: false,
      },

      // Dragging is not triggered when clicking buttons, input fields, links, or subtask preview
      filter:
        "button, input, textarea, select, a, [data-no-drag='true']",
      preventOnFilter: false,

      // Dragging feel
      swapThreshold: 0.30,
      invertSwap: false,
      direction: "vertical",

      // Auto-scrolling when dragging near edges
      scroll: true,
      scrollSensitivity: 80,
      scrollSpeed: 12,
      bubbleScroll: true,
      forceAutoScrollFallback: true,

      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",

      onEnd: () => {
        if (!listRef.current) return;

        const orderedIds = Array.from(
          listRef.current.querySelectorAll<HTMLElement>(".sortable-task-item")
        ).map((item) => Number(item.dataset.id));
        
        onReorder(taskType, orderedIds);
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [taskType, tasks.length, onReorder]);

  return (
    <section className="task-column">
      <div className="task-column-header">
        <div className="task-column-title-row">
          <h2>{title}</h2>
          {displayCount > 0 && (
            <span className="task-count-pill">{displayCount}</span>
          )}
        </div>

        <button className="column-add-btn" type="button" onClick={onAdd}>
          + {addLabel}
        </button>
      </div>

      <div className="task-column-body">
        {displayTasks.length > 0 ? (
          <div className="quest-list" ref={listRef}>
            {displayTasks.map((task) => (
              <div
                key={task.id}
                className={`sortable-task-item ${
                  isTaskCompleted(task) ? "completed-task" : ""
                }`}
                data-id={task.id}
              >
                <TaskCard
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onRevert={onRevert}
                  onAddSubTask={onAddSubTask}
                  onToggleSubTask={onToggleSubTask}
                  onDeleteSubTask={onDeleteSubTask}
                  onReorderSubTask={onReorderSubTask}
                  onEditSubTask={onEditSubTask}
                />
              </div>
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

function isTaskCompleted(task: DailyTask) {
  const today = new Date().toLocaleDateString("en-CA");

  if (task.taskType === "DAILY") {
    return task.lastCompletedDate === today;
  }

  if (task.taskType === "TODO") {
    return !task.active;
  }

  return false;
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
