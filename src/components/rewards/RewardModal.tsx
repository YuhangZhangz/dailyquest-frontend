import type { Reward, RewardPayload } from "../../types/reward";

type RewardModalProps = {
  open: boolean;
  editingReward: Reward | null;
  title: string;
  description: string;
  cost: number;
  iconKey: string;
  titleError: string;
  costError: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (payload: RewardPayload) => void;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCostChange: (value: number) => void;
  onIconKeyChange: (value: string) => void;
};

function RewardModal({
  open,
  editingReward,
  title,
  description,
  cost,
  iconKey,
  titleError,
  costError,
  saving,
  onClose,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
  onCostChange,
  onIconKeyChange,
}: RewardModalProps) {
  const buttonText = editingReward ? "Save Changes" : "Create Reward";

  const isOpen = open;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="edit-modal-backdrop">
      <form
        className="reward-modal"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({ title: title.trim(), description: description.trim(), cost, iconKey });
        }}
      >
        <div className="edit-modal-header">
          <div>
            <h2>{editingReward ? "Edit Reward" : "Create Reward"}</h2>
            <p className="modal-subtitle">Manage your reward details and cost.</p>
          </div>
          <button
            className="cancel-btn"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <label>
          <span>
            Title <span className="required-star">*</span>
          </span>
          <input
            className={titleError ? "input-error" : ""}
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            placeholder="Enter reward name"
          />
        </label>
        {titleError && <div className="modal-field-error">{titleError}</div>}

        <label>
          <span>Description</span>
          <textarea
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            placeholder="Optional reward details"
          />
        </label>

        <label>
          <span>
            Cost <span className="required-star">*</span>
          </span>
          <input
            type="number"
            min={1}
            value={cost}
            onChange={(event) => onCostChange(Number(event.target.value))}
            placeholder="Enter coin cost"
          />
        </label>
        {costError && <div className="modal-field-error">{costError}</div>}

        <label>
          <span>Icon</span>
          <select value={iconKey} onChange={(event) => onIconKeyChange(event.target.value)}>
            <option value="gift">Gift</option>
            <option value="movie">Movie</option>
            <option value="hotpot">Hotpot</option>
            <option value="game">Game</option>
            <option value="dessert">Dessert</option>
          </select>
        </label>

        <button className="save-edit-btn" type="submit" disabled={saving}>
          {buttonText}
        </button>
      </form>
    </div>
  );
}

export default RewardModal;
