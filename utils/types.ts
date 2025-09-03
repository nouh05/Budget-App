export type HabitData = {
    perUseSpend: number;
    streak: number;
    totalSaved: number;
    lastLoggedDate: string | null;
    monthlySpend?: number;
  };
  
  export type UserData = {
    selectedHabit?: string;
    habits?: { [habitName: string]: HabitData };
    totalSaved?: number;
    streak?: number;
    lastLoggedDate?: string | null;
    age?: number;
  };