import { useEffect, useRef } from "react";
import Sortable from "sortablejs";
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
  completedCount: number;
  lastCompletedDate: string | null;
  dueDate: string | null;
};

type TaskColumnProps = {
  title: string;
  addLabel: string;
  taskType: TaskType;
  tasks: DailyTask[];
  onAdd: () => void;
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
  onReorder: (taskType: TaskType, orderedIds: number[]) => void;
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
}: TaskColumnProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const displayCount = title.includes("Todos")
    ? tasks.filter((task) => task.active).length
    : tasks.length;

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

      // Dragging is not triggered when clicking buttons, input fields, or links.
      filter: "button, input, textarea, select, a",
      preventOnFilter: false,

      // Dragging feel
      swapThreshold: 0.30,
      invertSwap: false,
      direction: "vertical",

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
          <span className="task-count-pill">{displayCount}</span>
        </div>

        <button className="column-add-btn" type="button" onClick={onAdd}>
          + {addLabel}
        </button>
      </div>

      <div className="task-column-body">
        {tasks.length > 0 ? (
          <div className="quest-list" ref={listRef}>
            {tasks.map((task) => (
              <div
                key={task.id}
                className="sortable-task-item"
                data-id={task.id}
              >
                <TaskCard
                  task={task}
                  onComplete={onComplete}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onRevert={onRevert}
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