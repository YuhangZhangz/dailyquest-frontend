import { useState } from "react";

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
  dueDate: string | null;
};

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
};

function EditTaskModal({ task, onClose, onUpdate }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [difficulty, setDifficulty] = useState(task.difficulty);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    onUpdate(task.id, title, description, difficulty, task.taskType, task.taskType === "TODO" ? dueDate : null);
    onClose();
  }

  return (
    <div className="edit-modal-backdrop">
      <form className="edit-task-modal" onSubmit={handleSubmit}>
        <div className="edit-modal-header">
          <h2>Edit Quest</h2>
          <button className="cancel-btn" type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <label>
          Title *
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="T1">🟢 T1 - Easy</option>
            <option value="T2">🟡 T2 - Normal</option>
            <option value="T3">🔵 T3 - Hard</option>
            <option value="T4">🔴 T4 - Elite</option>
            <option value="BOSS">👑 Boss</option>
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
    </div>
  );
}

export default EditTaskModal;