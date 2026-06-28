import type { ComponentType } from "react";

export type Reward = {
  id: number;
  title: string;
  description: string;
  cost: number;
  iconKey: string;
};

export type RewardSummary = {
  availableCoins: number;
  rewardsUnlocked: number;
};

export type Suggestion = {
  title: string;
  description: string;
  cost: number;
  iconKey: string;
};

export type RewardPayload = {
  title: string;
  description: string;
  cost: number;
  iconKey: string;
};

export type RewardIconMap = Record<string, ComponentType<{ size?: number }>>;
