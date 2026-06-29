import { X } from "lucide-react";

type SubTaskInputListProps = {
  subTaskInput: string;
  subTaskTitles: string[];
  onInputChange: (value: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
};

function SubTaskInputList({
  subTaskInput,
  subTaskTitles,
  onInputChange,
  onAdd,
  onDelete,
}: SubTaskInputListProps) {
  return (
    <div className="subtask-list">
      <div className="subtask-add-row">
        <input
          className="subtask-input"
          value={subTaskInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Add subtask"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAdd();
            }

            if (e.key === "Escape") {
              e.preventDefault();
              onInputChange("");
            }
          }}
        />

        <button type="button" className="subtask-add-button" onClick={onAdd}>
          Add
        </button>
      </div>

      <div className="subtask-list-items">
        {subTaskTitles.map((subTaskTitle, index) => (
          <div key={`${subTaskTitle}-${index}`} className="subtask-item">
            <span className="subtask-title">{subTaskTitle}</span>

            <button
              type="button"
              className="subtask-delete"
              onClick={() => onDelete(index)}
              aria-label="Delete subtask"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubTaskInputList;