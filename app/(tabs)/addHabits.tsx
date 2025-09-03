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
import { HabitData, UserData } from '../../utils/types';
const HABITS = ['DoorDash', 'Impulse Amazon', 'Uber', 'Thrift fits', 'Crypto coins'];
const STORAGE_KEY = '@user_data';

export default function AddHabitsScreen() {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const maxHabitsSelected = selectedHabits.length >= 2;

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          const parsed: UserData = JSON.parse(storedData);
          setUserData(parsed);
        }
      } catch (e) {
        console.error('Failed to load user data', e);
        setErrorMessage('Something went wrong loading your data.');
      }
    };
    loadData();
  }, []);
  

  const handleSelectHabit = (habit: string) => {
    setErrorMessage('');
    if (selectedHabits.includes(habit)) {
      setSelectedHabits(selectedHabits.filter(h => h !== habit));
    } else if (!maxHabitsSelected) {
      setSelectedHabits([...selectedHabits, habit]);
    }
  };

  const getRoast = (habit: string) => {
    switch (habit) {
      case 'DoorDash': return "C'mon at least drive there yourself";
      case 'Impulse Amazon': return "Congrats, you own 4 milk frothers.";
      case 'Uber': return "No license? Walking too difficult?";
      case 'Thrift fits': return "You bought vintage… from Shein.";
      case 'Crypto coins': return "Your 'investment' is worth $0.73.";
      default: return '';
    }
  };

  const handleContinue = async () => {
    if (selectedHabits.length === 0) {
      setErrorMessage('Please select at least one habit to continue.');
      return;
    }
  
    try {
      let updatedHabits: { [key: string]: HabitData } = { ...(userData?.habits || {}) }; // Change to 'let'
  
      selectedHabits.forEach(h => {
        if (!updatedHabits[h]) {
          updatedHabits[h] = initializeHabitWithDefaults(h);
        }
      });
  
      // ENSURE MAX 3 HABITS TOTAL
      const allHabitNames = Object.keys(updatedHabits);
      if (allHabitNames.length > 3) {
        const habitsToKeep = allHabitNames.slice(-3);
        const trimmedHabits: { [key: string]: HabitData } = {};
        habitsToKeep.forEach(habit => {
          trimmedHabits[habit] = updatedHabits[habit];
        });
        updatedHabits = trimmedHabits; // This line was causing the error
      }
  
      const updatedData: UserData = {
        ...userData,
        habits: updatedHabits,
        totalSaved: userData?.totalSaved || 0,
        streak: userData?.streak || 0,
        lastLoggedDate: userData?.lastLoggedDate || null,
      };
  
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      router.push('/dashboard');
    } catch (e) {
      console.error('Failed to save habits', e);
      setErrorMessage('Failed to save your habits. Please try again.');
    }
  };

  const skipStep = () => {
    router.push('/dashboard');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.header}>OPTIONAL STEP</Text>
        <Text style={styles.title}>Add more habits? 🌱</Text>
        <Text style={styles.question}>Pick up to 2 more habits</Text>
        
        <Text style={styles.counter}>{selectedHabits.length}/2 selected</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.optionsContainer}>
          {HABITS.map(habit => {
            const isSelected = selectedHabits.includes(habit);
            const isDisabled = maxHabitsSelected && !isSelected;

            return (
              <View key={habit} style={styles.habitContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOptionButton,
                    isDisabled && styles.disabledOptionButton
                  ]}
                  onPress={() => !isDisabled && handleSelectHabit(habit)}
                  disabled={isDisabled}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                    isDisabled && styles.disabledOptionText
                  ]}>
                    {habit}
                  </Text>
                </TouchableOpacity>

                {isSelected && (
                  <View style={styles.inputContainer}>
                    <Text style={styles.roast}>{getRoast(habit)}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          {selectedHabits.length > 0 && (
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>Complete Setup</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.skipButton} onPress={skipStep}>
            <Text style={styles.skipText}>Skip this step</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006666',
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#003333',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    color: '#005555',
    marginBottom: 24,
    letterSpacing: 0.2,
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007070',
    marginBottom: 32,
    textAlign: 'center',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  habitContainer: {
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#f0f9f7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedOptionButton: {
    backgroundColor: '#e0f7f5',
    borderColor: '#007070',
  },
  disabledOptionButton: {
    backgroundColor: '#f8f8f8',
    borderColor: '#e0e0e0',
    opacity: 0.6,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  selectedOptionText: {
    color: '#005555',
    fontWeight: '700',
  },
  disabledOptionText: {
    color: '#999999',
  },
  inputContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  roast: {
    fontSize: 14,
    color: '#006666',
    marginTop: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    gap: 16,
  },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
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
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    color: '#006666',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});