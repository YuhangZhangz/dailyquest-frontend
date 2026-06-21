import { useEffect, useState } from "react";
import type { TaskType } from "../types/task";

type AddTaskModalProps = {
  taskType: TaskType;
  onClose: () => void;
  onCreate: (
    title: string,
    description: string,
    difficulty: string,
    dueDate: string | null
  ) => void | Promise<void>;
};

function AddTaskModal({ taskType, onClose, onCreate }: AddTaskModalProps) {
  // Load saved draft from localStorage
  const draftKey = `add-task-draft-${taskType}`;
  const savedDraft = localStorage.getItem(draftKey);
  const parsedDraft = savedDraft    ? JSON.parse(savedDraft) : null;

  const [title, setTitle] = useState(parsedDraft?.title || "");
  const [description, setDescription] = useState(parsedDraft?.description || "");
  const [difficulty, setDifficulty] = useState(parsedDraft?.difficulty || "T1");
  const [dueDate, setDueDate] = useState(parsedDraft?.dueDate || "");
  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        title,
        description,
        difficulty,
        dueDate,
      })
    );
  }, [draftKey, title, description, difficulty, dueDate]);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    setTitleError("");

    if (!title.trim()) {
      setTitleError("Task name is required.");
      return;
    }

    await onCreate(
      title.trim(),
      description.trim(),
      difficulty,
      taskType === "TODO" ? dueDate || null : null
    );

    // Clear draft from localStorage and reset form
    localStorage.removeItem(draftKey);
  }

  return (
    <div className="modal-backdrop">
      <div className="add-task-modal">
        <h2>Add {taskType}</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Task Name *
            <input
              className={titleError ? "input-error" : ""}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");}}
              placeholder="Enter task name"
            />
          </label>
          
          {titleError && (
            <div className="modal-field-error">
              {titleError}
            </div>
          )}

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