import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TaskType } from "../../types/task";
import { X } from "lucide-react";
import  SubTaskInputList from "./SubTaskInputList";

type AddTaskModalProps = {
  taskType: TaskType;
  onClose: () => void;
  onCreate: (
    title: string,
    description: string,
    difficulty: string,
    dueDate: string | null,
    subTaskTitles: string[]
  ) => void | Promise<void>;
};

function AddTaskModal({ taskType, onClose, onCreate }: AddTaskModalProps) {
  // Load saved draft from localStorage
  const draftKey = `add-task-draft-${taskType}`;
  const savedDraft = localStorage.getItem(draftKey);
  const parsedDraft = savedDraft ? JSON.parse(savedDraft) : null;

  const [title, setTitle] = useState(parsedDraft?.title || "");
  const [description, setDescription] = useState(parsedDraft?.description || "");
  const [difficulty, setDifficulty] = useState(parsedDraft?.difficulty || "T1");
  const [dueDate, setDueDate] = useState(parsedDraft?.dueDate || "");
  const [titleError, setTitleError] = useState("");

  // Add modal does not have a task id yet, so subtasks are kept locally first.
  const [subTaskInput, setSubTaskInput] = useState("");
  const [subTaskTitles, setSubTaskTitles] = useState<string[]>(
    parsedDraft?.subTaskTitles || []
  );

  useEffect(() => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        title,
        description,
        difficulty,
        dueDate,
        subTaskTitles,
      })
    );
  }, [draftKey, title, description, difficulty, dueDate, subTaskTitles]);

  function handleAddSubTask() {
    const trimmedTitle = subTaskInput.trim();

    if (!trimmedTitle) return;

    setSubTaskTitles((prev) => [...prev, trimmedTitle]);
    setSubTaskInput("");
  }

  function handleDeleteSubTask(indexToDelete: number) {
    setSubTaskTitles((prev) =>
      prev.filter((_, index) => index !== indexToDelete)
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
      taskType === "TODO" ? dueDate || null : null,
      taskType === "HABIT" ? [] : subTaskTitles
    );

    // Clear draft from localStorage and close modal after creating the task.
    localStorage.removeItem(draftKey);
    onClose();
  }

  return createPortal(
    <div className="edit-modal-backdrop">
      <form className="edit-task-modal" onSubmit={handleSubmit}>
        <div className="edit-modal-header">
          <h2>Add Quest</h2>

          <button className="cancel-btn" type="button" onClick={onClose}>
            <X size={18} strokeWidth={3} />
          </button>
        </div>

        <label>
          <span>
            Title <span className="required-star">*</span>
          </span>

          <input
            className={titleError ? "input-error" : ""}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            placeholder="Enter task name"
          />
        </label>

        {titleError && <div className="modal-field-error">{titleError}</div>}

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </label>

        {taskType !== "HABIT" && (
          <div className="subtask-field">
            <span className="subtask-field-label">Subtask</span>

            < SubTaskInputList
              subTaskInput={subTaskInput}
              subTaskTitles={subTaskTitles}
              onInputChange={setSubTaskInput}
              onAdd={handleAddSubTask}
              onDelete={handleDeleteSubTask}
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

        <button className="save-edit-btn" type="submit">
          Save
        </button>
      </form>
    </div>,
    document.body
  );
}

export default AddTaskModal;