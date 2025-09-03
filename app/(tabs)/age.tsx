import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
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
  age?: number;
};

export default function UserAge() {
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const rawHabit = useLocalSearchParams().habit;
  const habit = Array.isArray(rawHabit) ? rawHabit[0] : rawHabit;
  const { monthlySpend } = useLocalSearchParams();

  const handleInputChange = (text: string) => {
    // allow only digits, no decimals, no letters
    if (/^\d*$/.test(text)) {
      setAmount(text);
      setErrorMessage('');
    } else {
      setErrorMessage('Age must be whole numbers only.');
    }
  };

  const handleContinue = async () => {
    if (!amount.trim()) {
      setErrorMessage('Please enter your age.');
      return;
    }

    const numericAge = parseInt(amount, 10); // force whole number

    if (isNaN(numericAge)) {
      setErrorMessage('Age must be a number.');
      return;
    }

    if (numericAge <= 0 || numericAge > 120) {
      setErrorMessage('Please enter a valid age between 1 and 120.');
      return;
    }

    try {
      const storedData = await AsyncStorage.getItem(STORAGE_KEY);
      let userData: UserData = storedData ? JSON.parse(storedData) : {};

      if (!userData.habits) {
        userData.habits = {};
      }

      if (habit && !userData.habits[habit]) {
        userData.habits[habit] = {
          monthlySpend: Number(monthlySpend) || 0,
          streak: 0,
          totalSaved: 0,
          lastLoggedDate: null,
        };
      }

      userData.age = numericAge;

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

      router.push({
        pathname: '/result',
        params: { age: numericAge.toString(), monthlySpend, habit },
      });
    } catch (error) {
      console.error('Error saving age:', error);
      setErrorMessage('Something went wrong while saving. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>STEP 3 OF 3</Text>
      <Text style={styles.subHeader}>LAST QUESTION</Text>
      <Text style={styles.title}>How old are you? 🎂</Text>

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      <TextInput
        style={[styles.input, errorMessage ? { borderColor: '#FF4D4D' } : null]}
        keyboardType="numeric"
        placeholder="23"
        placeholderTextColor="#6e928c"
        value={amount}
        onChangeText={handleInputChange}
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
    fontSize: 12,
    fontWeight: '700',
    color: '#006666',
    letterSpacing: 1,
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 12,
    fontWeight: '500',
    color: '#004040',
    letterSpacing: 1,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#003333',
    marginBottom: 24,
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
    marginBottom: 24,
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
    marginBottom: 16,
    letterSpacing: 0.2,
  },
});
