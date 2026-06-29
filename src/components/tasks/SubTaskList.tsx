import { useEffect, useRef, useState } from "react";
import Sortable from "sortablejs";
import type { SubTask } from "../../types/task";
import { Check, GripVertical, Square, X } from "lucide-react";

type SubTaskListProps = {
  taskId: number;
  subTasks: SubTask[];
  onAddSubTask: (taskId: number, title: string) => void;
  onToggleSubTask: (taskId: number, subTaskId: number) => void;
  onDeleteSubTask: (taskId: number, subTaskId: number) => void;
  onEditSubTask?: (taskId: number, subTaskId: number, title: string) => void;
  onReorderSubTask?: (taskId: number, orderedIds: number[]) => void;
};

function SubTaskList({
  taskId,
  subTasks,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  onEditSubTask,
  onReorderSubTask,
}: SubTaskListProps) {
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
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

  function startEditSubTask(subTask: SubTask) {
    if (!onEditSubTask) return;

    setEditingId(subTask.id);
    setEditTitle(subTask.title);
  }

  function cancelEditSubTask() {
    setEditingId(null);
    setEditTitle("");
  }

  function saveEditSubTask(subTask: SubTask) {
    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      cancelEditSubTask();
      return;
    }

    if (trimmedTitle !== subTask.title && onEditSubTask) {
      onEditSubTask(taskId, subTask.id, trimmedTitle);
    }

    cancelEditSubTask();
  }

  return (
    <div className="subtask-list">
      <div className="subtask-add-row">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAdd();
            }

            if (e.key === "Escape") {
              e.preventDefault();
              setNewTitle("");
            }
          }}
          placeholder="Add subtask"
          className="subtask-input"
        />

        <button type="button" onClick={handleAdd} className="subtask-add-button">
          Add
        </button>
      </div>

      <div ref={listRef} className="subtask-list-items">
        {sortedSubTasks.map((subTask) => {
          const isEditing = editingId === subTask.id;

          return (
            <div
              key={subTask.id}
              className="subtask-item"
              data-id={subTask.id}
            >
              <span
                className="subtask-drag-handle"
                aria-label="Reorder subtask"
              >
                <GripVertical size={14} strokeWidth={2.2} />
              </span>

              <button
                type="button"
                className={
                  subTask.completed
                    ? "subtask-check completed"
                    : "subtask-check"
                }
                onClick={() => onToggleSubTask(taskId, subTask.id)}
              >
                {subTask.completed ? (
                  <Check size={13} strokeWidth={3.2} />
                ) : (
                  <Square size={20} strokeWidth={2.5} />
                )}
              </button>

              {isEditing ? (
                <input
                  className="subtask-edit-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => {
                    // Blur only cancels editing.
                    cancelEditSubTask();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveEditSubTask(subTask);
                    }

                    if (e.key === "Escape") {
                      e.preventDefault();
                      cancelEditSubTask();
                    }
                  }}
                  autoFocus
                />
              ) : (
                <span
                  className={
                    subTask.completed
                      ? "subtask-title completed"
                      : "subtask-title"
                  }
                  onClick={() => startEditSubTask(subTask)}
                >
                  {subTask.title}
                </span>
              )}

              <button
                type="button"
                className="subtask-delete"
                onMouseDown={(e) => {
                  // Prevent blur before cancel click.
                  if (isEditing) {
                    e.preventDefault();
                  }
                }}
                onClick={() => {
                  if (isEditing) {
                    cancelEditSubTask();
                    return;
                  }

                  onDeleteSubTask(taskId, subTask.id);
                }}
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubTaskList;