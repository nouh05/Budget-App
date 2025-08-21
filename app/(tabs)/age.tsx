import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
  age?: number;
};

export default function UserAge() {
  const [amount, setAmount] = useState('');

  // Ensure habit is always a string
  const rawHabit = useLocalSearchParams().habit;
  const habit = Array.isArray(rawHabit) ? rawHabit[0] : rawHabit;

  const { monthlySpend } = useLocalSearchParams();

  const handleContinue = async () => {
    if (!amount || isNaN(Number(amount))) {
      Alert.alert('Please enter a valid age');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      let userData: UserData = storedData ? JSON.parse(storedData) : {};

      // Initialize habits if not present
      if (!userData.habits) {
        userData.habits = {};
      }

      // Initialize the specific habit if not present
      if (habit && !userData.habits[habit]) {
        userData.habits[habit] = {
          monthlySpend: Number(monthlySpend) || 0,
          streak: 0,
          totalSaved: 0,
          lastLoggedDate: null,
        };
      }

      // Save the age
      userData.age = Number(amount);

      // Save back to AsyncStorage
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      router.push({
        pathname: '/result',
        params: { age: amount, monthlySpend, habit },
      });
    } catch (error) {
      console.error('Error saving age:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step 3 of 3</Text>
      <Text style={styles.header}>LAST QUESTION</Text>
      <Text style={styles.title}>How old are you? 💸</Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="23"
        placeholderTextColor="#6e928c"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>See the damage</Text>
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
    fontSize: 14,
    fontWeight: '600',
    color: '#004040',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#004040',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 2,
    borderColor: '#bcebe3',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 20,
    fontWeight: '600',
    color: '#007070',
    backgroundColor: '#ffffff',
    marginBottom: 24,
  },
});
