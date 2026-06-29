import type { ComponentType } from "react";

type RewardSummaryCardProps = {
  label: string;
  value: number;
  description: string;
  Icon: ComponentType<{ size?: number }>;
  imageSrc?: string;
  imageAlt?: string;
  iconSize?: number;
};

function RewardSummaryCard({
  label,
  value,
  description,
  Icon,
  imageSrc,
  imageAlt = "",
  iconSize = 34,
}: RewardSummaryCardProps) {
  return (
    <article className="summary-card">
      <div className="summary-icon-shell">
        {imageSrc ? (
          <img src={imageSrc} alt={imageAlt} />
        ) : (
          <Icon size={iconSize} />
        )}
      </div>

      <div className="summary-card-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}

export default RewardSummaryCard;