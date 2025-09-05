import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { initializeHabitWithDefaults } from '../../utils/habitUtils';
import { UserData } from '../../utils/types';
const HABITS = ['DoorDash', 'Impulse Amazon', 'Uber', 'Thrift fits', 'Crypto coins'];
const STORAGE_KEY = '@user_data';

export default function SelectHabitScreen() {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadHabit = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const data: UserData = JSON.parse(json);
          // Check if there's a selected habit
          if (data.habits && Object.keys(data.habits).length > 0) {
            const habitName = Object.keys(data.habits)[0];
            setSelectedHabit(habitName);
          }
        }
      } catch (e) {
        console.error('Failed to load habit from storage', e);
      }
    };
    loadHabit();
  }, []);

  const handleSelectHabit = (habit: string) => {
    setSelectedHabit(habit);
    setErrorMessage('');
  };

  // const getRoast = (habit: string) => {
  //   switch (habit) {
  //     case 'DoorDash': return "C'mon at least drive there yourself";
  //     case 'Impulse Amazon': return "Congrats, you own 4 milk frothers.";
  //     case 'Uber': return "No license? Walking too difficult?";
  //     case 'Thrift fits': return "You bought vintage… from Shein.";
  //     case 'Crypto coins': return "Your 'investment' is worth $0.73.";
  //     default: return '';
  //   }
  // };

  const handleContinue = async () => {
    if (!selectedHabit) {
      setErrorMessage('Please select a habit to continue.');
      return;
    }
  
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const data: UserData = json ? JSON.parse(json) : {};
  
      const updatedData: UserData = {
        ...data,
        habits: {
          ...(data.habits || {}),
          [selectedHabit]: initializeHabitWithDefaults(selectedHabit),
        },
        totalSaved: data.totalSaved || 0,
        streak: data.streak || 0,
        lastLoggedDate: data.lastLoggedDate || null,
      };
  
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      router.push({
        pathname: '/monthlyspend',
        params: { habit: selectedHabit }
      });
    } catch (e) {
      console.error('Failed to save', e);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>STEP 1 OF 3</Text>
        <Text style={styles.title}>Time to come clean 🌱</Text>
        <Text style={styles.question}>Pick your guilty habit</Text>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        {HABITS.map((habit) => {
          const isSelected = selectedHabit === habit;
          return (
            <View key={habit} style={styles.habitContainer}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedOptionButton,
                ]}
                onPress={() => handleSelectHabit(habit)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {habit}
                </Text>
              </TouchableOpacity>

              {/* {isSelected && (
                <View style={styles.inputContainer}>
                  <Text style={styles.roast}>{getRoast(habit)}</Text>
                </View>
              )} */}
            </View>
          );
        })}

        <View style={styles.buttonContainer}>
          {selectedHabit && (
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>Next Question →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9fcf9' },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { fontSize: 12, fontWeight: '700', color: '#006666', marginBottom: 4 },
  title: { fontSize: 32, fontWeight: '800', color: '#003333', marginBottom: 12 },
  question: { fontSize: 18, fontWeight: '600', color: '#005555', marginBottom: 24 },
  errorText: {
    color: '#FF4D4D',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  habitContainer: { marginBottom: 16 },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#f0f9f7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedOptionButton: { backgroundColor: '#e0f7f5', borderColor: '#007070' },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  selectedOptionText: { color: '#005555', fontWeight: '700' },
  inputContainer: { marginTop: 16, alignItems: 'center' },
  roast: {
    fontSize: 14,
    color: '#006666',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: { alignItems: 'center', marginTop: 24 },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#007070',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  continueText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});