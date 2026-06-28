import { CakeSlice, Film, Gift, Gamepad, Soup } from "lucide-react";
import type { RewardIconMap } from "../types/reward";

export const rewardIconMap: RewardIconMap = {
  gift: Gift,
  movie: Film,
  hotpot: Soup,
  game: Gamepad,
  dessert: CakeSlice,
};
