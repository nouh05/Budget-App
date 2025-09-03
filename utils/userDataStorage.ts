// utils/userData.ts
import { getItem, removeItem, setItem } from "./storage";


const USER_DATA_KEY = "USER_DATA";

export type UserData = {
  streak: number;
  totalSaved: number;
  monthlySpend: number;
  age: number;
  lastLoggedDate?: string;
};

export const saveUserData = async (data: UserData) => {
  try {
    await setItem(USER_DATA_KEY, JSON.stringify(data));
    console.log("User data saved:", data);
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

export const getUserData = async () => {
  try {
    const jsonValue = await getItem(USER_DATA_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Error reading user data:", error);
    return null;
  }
};

export const clearUserData = async () => {
  try {
    await removeItem(USER_DATA_KEY);
    console.log("User data cleared");
  } catch (error) {
    console.error("Error clearing user data:", error);
  }
};
