export type TaskType = "HABIT" | "DAILY" | "TODO";

export type SubTask = {
  id: number;
  title: string;
  completed: boolean;
};

export type DailyTask = {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  taskType: TaskType;
  baseXp: number;
  active: boolean;
  createdAt: string;
  completedCount: number;
  lastCompletedDate: string | null;
  dueDate: string | null;
  sortOrder: number;
  subTasks: SubTask[];
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