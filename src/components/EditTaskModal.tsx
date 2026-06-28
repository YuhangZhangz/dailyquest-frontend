import { useState } from "react";
import { createPortal } from "react-dom";
import type { DailyTask, TaskType } from "../types/task";
import SubTaskList from "./SubTaskList";
import { X } from "lucide-react";

type EditTaskModalProps = {
  task: DailyTask;
  onClose: () => void;
  onUpdate: (
    id: number,
    title: string,
    description: string,
    difficulty: string,
    taskType: TaskType,
    dueDate: string | null
  ) => void;

  onAddSubTask?: (taskId: number, title: string) => void;
  onToggleSubTask?: (taskId: number, subTaskId: number) => void;
  onDeleteSubTask?: (taskId: number, subTaskId: number) => void;
};

function EditTaskModal({ 
  task, 
  onClose, 
  onUpdate,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask 
}: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    onUpdate(
      task.id,
      title,
      description,
      difficulty,
      task.taskType,
      task.taskType === "TODO" ? dueDate : null
    );

    onClose();
  }

  return createPortal(
    <div className="edit-modal-backdrop">
      <form className="edit-task-modal" onSubmit={handleSubmit}>
        <div className="edit-modal-header">
          <h2>Edit Quest</h2>

          <button className="cancel-btn" type="button" onClick={onClose}>
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <label>
          <span>
            Title <span className="required-star">*</span>
          </span>

          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        {task.taskType !== "HABIT" &&
          onAddSubTask &&
          onToggleSubTask &&
          onDeleteSubTask && (
            <div className="subtask-field">
              <span className="subtask-field-label">Subtask</span>

              <SubTaskList
                taskId={task.id}
                subTasks={task.subTasks ?? []}
                onAddSubTask={onAddSubTask}
                onToggleSubTask={onToggleSubTask}
                onDeleteSubTask={onDeleteSubTask}
              />
            </div>
          )}     

        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="T1">🟢 T1 - Easy (2 Coins)</option>
            <option value="T2">🟡 T2 - Normal (5 Coins)</option>
            <option value="T3">🔵 T3 - Hard (10 Coins)</option>
            <option value="T4">🔴 T4 - Elite (20 Coins)</option>
            <option value="BOSS">👑 Boss (50 Coins)</option>
          </select>
        </label>

        {task.taskType === "TODO" && (
          <label>
            Due Date
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </label>
        )}

        <button className="save-edit-btn" type="submit">
          Save
        </button>
      </form>
    </div>,
    document.body
  );
}

export default EditTaskModal;