import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const habits = ['DoorDash', 'Impulse Amazon', 'Uber', 'Thrift fits', 'Crypto coins'];

export default function SelectHabitScreen() {
  const [selectedHabit, setSelectedHabit] = useState('');

  const handleSelect = (habit: string) => {
    setSelectedHabit(habit);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step 1 of 3</Text>
      <Text style={styles.title}>Time to come clean 🌱</Text>
      <Text style={styles.question}>What’s your guilty spending habit?</Text>

      <View style={styles.optionsContainer}>
        {habits.map((habit) => {
          const isSelected = selectedHabit === habit;
          return (
            <TouchableOpacity
              key={habit}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOptionButton,
              ]}
              onPress={() => handleSelect(habit)}
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
          );
        })}
      </View>

      {selectedHabit !== '' && (
        <>
          <Text style={styles.roast}>{getRoast(selectedHabit)}</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() =>
              router.push({
                pathname: '/monthlyspend',
                params: { habit: selectedHabit },
              })
            }
          >
            <Text style={styles.continueText}>Next Question</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',  // Unified mint background
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004040',  // Dark teal
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#004040',
    marginBottom: 8,
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004040',
    marginBottom: 32,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOptionButton: {
    backgroundColor: '#e0f7f5',
    borderColor: '#007070',
  },
  optionText: {
    fontSize: 16,
    color: '#111111',
    fontWeight: '700',
  },
  selectedOptionText: {
    color: '#007070',
  },
  roast: {
    fontSize: 15,
    color: '#004040',
    marginTop: 32,
    marginBottom: 24,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    alignSelf: 'center',
    marginTop: 10,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
