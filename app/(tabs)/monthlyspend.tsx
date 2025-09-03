import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getDefaultPerUseSpend } from '../../utils/habitUtils';
import { UserData } from '../../utils/types';

const STORAGE_KEY = '@user_data';

export default function HabitSpendInput() {
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { habit: habitParam } = useLocalSearchParams();
  const habit = Array.isArray(habitParam) ? habitParam[0] : habitParam;

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
        setErrorMessage('Failed to load monthly spend. Please try again.');
      }
    };

    loadSpend();
  }, [habit]);

  const handleInputChange = (text: string) => {
    // Only allow digits (no decimals, no letters)
    if (/^\d*$/.test(text)) {
      setAmount(text);
      setErrorMessage('');
    } else {
      setErrorMessage('Please enter numbers only (no decimals).');
    }
  };

  const handleContinue = async () => {
    if (!habit) {
      setErrorMessage('No habit selected. Please go back and select a habit.');
      return;
    }
    if (!amount.trim()) {
      setErrorMessage('Please enter a monthly amount.');
      return;
    }
    const numericAmount = parseInt(amount, 10);
    if (isNaN(numericAmount)) {
      setErrorMessage('Please enter a valid whole number.');
      return;
    }
    if (numericAmount <= 0) {
      setErrorMessage('Please enter an amount greater than 0.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      let userData: UserData = storedData ? JSON.parse(storedData) : {};

      if (!userData.habits) {
        userData.habits = {};
      }

      const existingHabit = userData.habits[habit];

      userData.habits[habit] = {
        perUseSpend: existingHabit?.perUseSpend ?? getDefaultPerUseSpend(habit),
        monthlySpend: numericAmount,
        streak: existingHabit?.streak ?? 0,
        totalSaved: existingHabit?.totalSaved ?? 0,
        lastLoggedDate: existingHabit?.lastLoggedDate ?? null,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      setErrorMessage('');
      router.push({
        pathname: '/age',
        params: { habit, monthlySpend: amount },
      });
    } catch (error) {
      console.error('Error saving monthly spend:', error);
      setErrorMessage('Error saving monthly spend. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>STEP 2 OF 3</Text>
      <Text style={styles.title}>
        How much do you spend monthly on {habit}? 💸
      </Text>

      <TextInput
        style={[
          styles.input,
          errorMessage ? { borderColor: '#FF4D4D' } : null,
        ]}
        keyboardType="numeric"
        value={amount}
        onChangeText={handleInputChange}
        placeholder="150"
        placeholderTextColor="#6e928c"
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Next Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006666',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#003333',
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#bcebe3',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 24,
    fontWeight: '600',
    color: '#007070',
    backgroundColor: '#ffffff',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 16,
    shadowColor: '#007070',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
});
