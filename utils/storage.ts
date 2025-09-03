import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const useSecureStore = typeof window === "undefined";

export async function setItem(key: string, value: string) {
  if (useSecureStore) {
    await SecureStore.setItemAsync(key, value);
  } else {
    await AsyncStorage.setItem(key, value);
  }
}

export async function getItem(key: string): Promise<string | null> {
  if (useSecureStore) {
    return await SecureStore.getItemAsync(key);
  } else {
    return await AsyncStorage.getItem(key);
  }
}

export async function removeItem(key: string) {
  if (useSecureStore) {
    await SecureStore.deleteItemAsync(key);
  } else {
    await AsyncStorage.removeItem(key);
  }
}
