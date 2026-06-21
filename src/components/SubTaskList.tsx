import { useState } from "react";
import type { SubTask } from "../types/task";
import { Square, SquareCheck, X } from "lucide-react";

// Props means the data and functions passed from parent component.
type SubTaskListProps = {
  // Parent task id, used when adding/toggling/deleting subtasks
  taskId: number;

  // Subtasks that belong to this task
  subTasks: SubTask[];

  // Add a new subtask to this task
  onAddSubTask: (taskId: number, title: string) => void;

  // Toggle subtask completed status
  onToggleSubTask: (taskId: number, subTaskId: number) => void;

  // Delete a subtask from this task
  onDeleteSubTask: (taskId: number, subTaskId: number) => void;
};

function SubTaskList({
  taskId,
  subTasks,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
}: SubTaskListProps) {
  // Store the input value for the new subtask title
  const [newTitle, setNewTitle] = useState("");

  function handleAdd() {
    // Remove extra spaces before and after the title
    const trimmedTitle = newTitle.trim();

    // Do not allow empty subtask titles
    if (!trimmedTitle) {
      return;
    }

    // Ask parent component to create the subtask
    onAddSubTask(taskId, trimmedTitle);

    // Clear input after adding
    setNewTitle("");
  }

  return (
    <div className="subtask-list">
      {/* Render each subtask */}
      {[...subTasks]
      .sort((a, b) => a.id - b.id)
      .map((subTask) => (
          <div key={subTask.id} className="subtask-item">
          {/* Toggle completed / not completed */}
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
              <SquareCheck size={20} strokeWidth={2.5} />
            ) : (
              <Square size={20} strokeWidth={2.5} />
            )}
          </button>

          {/* Show subtask title */}
          <span
              className={
              subTask.completed ? "subtask-title completed" : "subtask-title"
              }
          >
              {subTask.title}
          </span>

          {/* Delete subtask */}
          <button
              type="button"
              className="subtask-delete"
              onClick={() => onDeleteSubTask(taskId, subTask.id)}
          >
              <X size={18} strokeWidth={3} />
          </button>
          </div>
      ))}

      {/* Add new subtask */}
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