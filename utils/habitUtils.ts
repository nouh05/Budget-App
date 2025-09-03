import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitData, UserData } from './types';

const STORAGE_KEY = '@user_data';

// Default per-use spend amounts for each habit
const DEFAULT_PER_USE_SPEND: { [key: string]: number } = {
  'DoorDash': 25,      // Average food delivery order
  'Impulse Amazon': 15, // Average impulse buy
  'Uber': 12,          // Average short ride
  'Thrift fits': 30,   // Average thrift store purchase
  'Crypto coins': 50   // Average crypto "investment"
};

export const ensureMaxHabits = async (maxHabits: number = 3): Promise<UserData | null> => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: UserData = JSON.parse(stored);
        
        if (parsed.habits && Object.keys(parsed.habits).length > maxHabits) {
          const habitNames = Object.keys(parsed.habits);
          const habitsToKeep = habitNames.slice(-maxHabits);
          
          const newHabits: { [key: string]: HabitData } = {};
          habitsToKeep.forEach(habit => {
            newHabits[habit] = parsed.habits![habit];
          });
          
          const updatedData: UserData = {
            ...parsed,
            habits: newHabits
          };
          
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
          console.log(`Enforced max habits: kept ${habitsToKeep.length} habits`);
          return updatedData; // Return the updated data
        }
        return parsed; // Return original data if no changes
      }
      return null;
    } catch (e) {
      console.error('Failed to ensure max habits:', e);
      return null;
    }
  };

export const getDefaultPerUseSpend = (habitName: string): number => {
  return DEFAULT_PER_USE_SPEND[habitName] || 10; // Default fallback
};

export const initializeHabitWithDefaults = (habitName: string): HabitData => {
  return {
    perUseSpend: getDefaultPerUseSpend(habitName),
    monthlySpend: 0,
    streak: 0,
    totalSaved: 0,
    lastLoggedDate: null,
  };
};

export const getHabitsCount = async (): Promise<number> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: UserData = JSON.parse(stored);
      return parsed.habits ? Object.keys(parsed.habits).length : 0;
    }
    return 0;
  } catch (e) {
    console.error('Failed to get habits count:', e);
    return 0;
  }
};