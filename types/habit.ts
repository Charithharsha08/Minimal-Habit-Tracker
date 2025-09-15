export interface Habit {
  id?: string;
  title: string;
  description?: string;
  frequency: "Daily" | "Weekly" | "Monthly";
  createdAt?: Date;
}

export interface CompletedHabit {
  id?: string;
  habitId: string;
  completedAt: Date;
}
