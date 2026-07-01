export type TaskType = "HABIT" | "DAILY" | "TODO";

export type GrowthCategory =
  | "NONE"
  | "WORK"
  | "SCHOOL"
  | "HEALTH"
  | "PERSONAL";

export const GROWTH_CATEGORY_OPTIONS: ReadonlyArray<{
  value: GrowthCategory;
  label: string;
}> = [
  { value: "WORK", label: "Work" },
  { value: "SCHOOL", label: "School" },
  { value: "HEALTH", label: "Health" },
  { value: "PERSONAL", label: "Personal" },
];

export function toGrowthCategory(value: string): GrowthCategory {
  const supportedCategory = GROWTH_CATEGORY_OPTIONS.find(
    (option) => option.value === value
  );

  return supportedCategory?.value ?? "NONE";
}

export type SubTask = {
  id: number;
  title: string;
  completed: boolean;
  sortOrder: number;
};

export type DailyTask = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  taskType: TaskType;
  growthCategory: GrowthCategory;
  baseXp: number;
  active: boolean;
  createdAt: string;
  completedCount: number;
  lastCompletedDate: string | null;
  dueDate: string | null;
  sortOrder: number;
  subTasks: SubTask[];
};

export type DailyTaskResponse = Omit<DailyTask, "growthCategory"> & {
  growthCategory?: GrowthCategory | null;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  totalXp: number;
  level: number;
  dailyStreak: number;
  coinBalance: number;
};
