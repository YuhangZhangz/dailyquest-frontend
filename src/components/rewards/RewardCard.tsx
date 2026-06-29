import { Edit3, Trash2, ChevronRight } from "lucide-react";
import type { Reward, RewardIconMap } from "../../types/reward";
import coinLogo from "../../assets/coin_logo.png";

type RewardCardProps = {
  reward: Reward;
  availableCoins: number;
  iconMap: RewardIconMap;
  onEdit: (reward: Reward) => void;
  onDelete: (rewardId: number) => void;
  onRedeem: (reward: Reward) => void;
};

function RewardCard({
  reward,
  availableCoins,
  iconMap,
  onEdit,
  onDelete,
  onRedeem,
}: RewardCardProps) {
  const Icon = iconMap[reward.iconKey] ?? iconMap.gift;
  const affordable = availableCoins >= reward.cost;
  const missingCoins = Math.max(reward.cost - availableCoins, 0);

  return (
    <article className="reward-card card">
      <div className="reward-card-left">
        <div className="reward-icon-shell">
          <Icon size={22} />
        </div>

        <div className="reward-card-title">
          <h4>{reward.title}</h4>
          <p>{reward.description}</p>
        </div>
      </div>

      <span className="reward-cost">
        <img src={coinLogo} alt="Coins" />
        <span className="cost-number">{reward.cost}</span>
        <span className="cost-label">Coins</span>
      </span>

      <div className="reward-card-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={() => onEdit(reward)}
        >
          <Edit3 size={16} /> Edit
        </button>

        <button
          className="danger-button"
          type="button"
          onClick={() => onDelete(reward.id)}
        >
          <Trash2 size={16} /> Delete
        </button>

        <button
          type="button"
          className="primary-button"
          disabled={!affordable}
          onClick={() => onRedeem(reward)}
        >
          Redeem
          <ChevronRight size={16} />
        </button>

        {!affordable && (
          <span className="reward-need-text">
            Need {missingCoins} more coins
          </span>
        )}
      </div>
    </article>
  );
}

export default RewardCard;