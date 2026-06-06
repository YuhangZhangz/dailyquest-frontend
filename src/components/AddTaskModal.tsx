import { useState } from "react";

type TaskType = "HABIT" | "DAILY" | "TODO";

type AddTaskModalProps = {
  taskType: TaskType;
  onClose: () => void;
  onCreate: (
    title: string,
    description: string,
    difficulty: string,
    dueDate: string | null
  ) => void;
};

function AddTaskModal({ taskType, onClose, onCreate }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("T1");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!title.trim()) return;

    onCreate(
      title,
      description,
      difficulty,
      taskType === "TODO" ? dueDate : null
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="add-task-modal">
        <h2>Add {taskType}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Task Name
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task name"
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
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

          {taskType === "TODO" && (
            <label>
              Due Date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </label>
          )}

          <div className="add-task-form-actions">
            <button type="submit">Save Quest</button>
            <button
              type="button"
              className="cancel-task-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;