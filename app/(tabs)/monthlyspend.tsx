import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@user_data';

type HabitData = {
  monthlySpend: number;
  streak: number;
  totalSaved: number;
  lastLoggedDate: string | null;
};

type UserData = {
  selectedHabit?: string;
  habits?: { [habitName: string]: HabitData };
};

export default function HabitSpendInput() {
  const [amount, setAmount] = useState('');
  const { habit: habitParam } = useLocalSearchParams();
  const habit = Array.isArray(habitParam) ? habitParam[0] : habitParam; // ✅ ensure string

  useEffect(() => {
    const loadSpend = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData && habit) {
          const parsedData: UserData = JSON.parse(storedData);
          const existingSpend = parsedData.habits?.[habit]?.monthlySpend;
          if (existingSpend) {
            setAmount(existingSpend.toString());
          }
        }
      } catch (error) {
        console.error('Error loading monthly spend:', error);
      }
    };

    loadSpend();
  }, [habit]);

  const handleContinue = async () => {
    if (!habit) return;

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      let userData: UserData = storedData ? JSON.parse(storedData) : {};

      if (!userData.habits) {
        userData.habits = {};
      }

      if (!userData.habits[habit]) {
        userData.habits[habit] = {
          monthlySpend: 0,
          streak: 0,
          totalSaved: 0,
          lastLoggedDate: null,
        };
      }

      userData.habits[habit].monthlySpend = parseFloat(amount) || 0;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      router.push({
        pathname: '/age',
        params: { habit, monthlySpend: amount },
      });
    } catch (error) {
      console.error('Error saving monthly spend:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How much do you spend monthly on {habit}?</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
      />
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
