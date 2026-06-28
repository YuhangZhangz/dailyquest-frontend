import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";
import type { SubTask } from "../types/task";
import { Check, GripVertical, Square, X } from "lucide-react";

type SubTaskListProps = {
  taskId: number;
  subTasks: SubTask[];
  onAddSubTask: (taskId: number, title: string) => void;
  onToggleSubTask: (taskId: number, subTaskId: number) => void;
  onDeleteSubTask: (taskId: number, subTaskId: number) => void;
  onReorderSubTask?: (taskId: number, orderedIds: number[]) => void;
};

function SubTaskList({
  taskId,
  subTasks,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onReorderSubTask,
}: SubTaskListProps) {
  const [newTitle, setNewTitle] = useState("");
  const listRef = useRef<HTMLDivElement | null>(null);

  const sortedSubTasks = [...subTasks].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.id - b.id
  );

  useEffect(() => {
    if (!listRef.current) return;

    const sortable = Sortable.create(listRef.current, {
      animation: 150,
      draggable: ".subtask-item",
      handle: ".subtask-drag-handle",
      group: {
        name: `subtask-list-${taskId}`,
        pull: false,
        put: false,
      },
      filter: "button, input, textarea, select, a",
      preventOnFilter: false,
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      onEnd: () => {
        if (!listRef.current) return;

        const orderedIds = Array.from(
          listRef.current.querySelectorAll<HTMLElement>(".subtask-item")
        ).map((item) => Number(item.dataset.id));

        if (orderedIds.length === 0) return;

        onReorderSubTask?.(taskId, orderedIds);
      },
    });

    return () => {
      sortable.destroy();
    };
  }, [onReorderSubTask, taskId]);

  function handleAdd() {
    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) return;

    onAddSubTask(taskId, trimmedTitle);
    setNewTitle("");
  }

  return (
    <div className="subtask-list">
      <div ref={listRef} className="subtask-list-items">
        {sortedSubTasks.map((subTask) => (
          <div key={subTask.id} className="subtask-item" data-id={subTask.id}>
            <span className="subtask-drag-handle" aria-label="Reorder subtask">
              <GripVertical size={14} strokeWidth={2.2} />
            </span>

            <button
              type="button"
              className={
                subTask.completed ? "subtask-check completed" : "subtask-check"
              }
              onClick={() => onToggleSubTask(taskId, subTask.id)}
            >
              {subTask.completed ? (
                <Check size={13} strokeWidth={3.2} />
              ) : (
                <Square size={20} strokeWidth={2.5} />
              )}
            </button>

            <span
              className={
                subTask.completed ? "subtask-title completed" : "subtask-title"
              }
            >
              {subTask.title}
            </span>

            <button
              type="button"
              className="subtask-delete"
              onClick={() => onDeleteSubTask(taskId, subTask.id)}
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>

      <div className="subtask-add-row">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add subtask"
          className="subtask-input"
        />

        <button type="button" onClick={handleAdd} className="subtask-add-button">
          Add
        </button>
      </div>
    </div>
  );
}

export default SubTaskList;