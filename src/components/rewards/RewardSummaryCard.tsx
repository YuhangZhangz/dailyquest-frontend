import type { ComponentType } from "react";

type RewardSummaryCardProps = {
  label: string;
  value: number;
  description: string;
  Icon: ComponentType<{ size?: number }>;
};

function RewardSummaryCard({ label, value, description, Icon }: RewardSummaryCardProps) {
  return (
    <article className="summary-card">
      <div className="summary-card-top">
        <span>{label}</span>
        <Icon size={22} />
      </div>
      <strong>{value}</strong>
      <p>{description}</p>
    </article>
  );
}

export default RewardSummaryCard;
