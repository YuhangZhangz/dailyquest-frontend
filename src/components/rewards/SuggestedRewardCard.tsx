import type { Suggestion, RewardIconMap } from "../../types/reward";

type SuggestedRewardCardProps = {
  suggestion: Suggestion;
  iconMap: RewardIconMap;
  onUse: (suggestion: Suggestion) => void;
};

function SuggestedRewardCard({ suggestion, iconMap, onUse }: SuggestedRewardCardProps) {
  const Icon = iconMap[suggestion.iconKey] ?? iconMap.gift;

  return (
    <article className="suggestion-card card">
      <div className="suggestion-icon-shell">
        <Icon size={20} />
      </div>
      <div className="suggestion-content">
        <h4>{suggestion.title}</h4>
        <p>{suggestion.description}</p>
      </div>
      <div className="suggestion-footer">
        <span>{suggestion.cost} Coins</span>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onUse(suggestion)}
        >
          Use Idea
        </button>
      </div>
    </article>
  );
}

export default SuggestedRewardCard;
