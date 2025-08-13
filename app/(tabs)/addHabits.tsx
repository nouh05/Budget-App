import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const habits = ['DoorDash', 'Impulse Amazon', 'Uber', 'Thrift fits', 'Crypto coins'];

export default function AddHabitsScreen() {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [spendValues, setSpendValues] = useState<{ [key: string]: string }>({});

  const handleSelectHabit = (habit: string) => {
    if (selectedHabits.includes(habit)) {
      setSelectedHabits(selectedHabits.filter(h => h !== habit));
      const newSpends = { ...spendValues };
      delete newSpends[habit];
      setSpendValues(newSpends);
    } else if (selectedHabits.length < 2) {
      setSelectedHabits([...selectedHabits, habit]);
      setSpendValues({ ...spendValues, [habit]: '' });
    }
  };

  const handleSpendChange = (habit: string, value: string) => {
    setSpendValues({
      ...spendValues,
      [habit]: value.replace(/[^0-9]/g, ''),
    });
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

  const handleContinue = () => {
    router.push({
      pathname: '/dashboard',
      params: {
        selectedHabits: JSON.stringify(selectedHabits),
        monthlySpends: JSON.stringify(spendValues),
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step 2 of 3</Text>
      <Text style={styles.title}>Double down 🌱</Text>
      <Text style={styles.question}>Pick up to 2 more guilty habits and their monthly cost:</Text>

      <View style={styles.optionsContainer}>
        {habits.map(habit => {
          const isSelected = selectedHabits.includes(habit);
          return (
            <View key={habit} style={styles.habitContainer}>
              <TouchableOpacity
                style={[styles.optionButton, isSelected && styles.selectedOptionButton]}
                onPress={() => handleSelectHabit(habit)}
              >
                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                  {habit}
                </Text>
              </TouchableOpacity>

              {isSelected && (
                <View style={styles.spendInputContainer}>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.dollarSign}>$</Text>
                    <TextInput
                      style={styles.spendInput}
                      placeholder="0"
                      keyboardType="numeric"
                      value={spendValues[habit] || ''}
                      onChangeText={(text) => handleSpendChange(habit, text)}
                    />
                  </View>
                  <Text style={styles.roast}>{getRoast(habit)}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {selectedHabits.length > 0 &&
        Object.keys(spendValues).length === selectedHabits.length && (
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueText}>Complete Setup</Text>
          </TouchableOpacity>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e9fcf9', paddingHorizontal: 24, paddingTop: 60 },
  header: { fontSize: 14, fontWeight: '600', color: '#004040', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', color: '#004040', marginBottom: 8 },
  question: { fontSize: 20, fontWeight: '700', color: '#004040', marginBottom: 32 },
  optionsContainer: { width: '100%', alignItems: 'center' },
  habitContainer: { width: '100%', marginBottom: 16 },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: '100%',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedOptionButton: { backgroundColor: '#e0f7f5', borderColor: '#007070' },
  optionText: { fontSize: 16, color: '#111111', fontWeight: '700' },
  selectedOptionText: { color: '#007070' },
  spendInputContainer: { marginTop: 12, paddingLeft: 12 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#bcebe3',
  },
  dollarSign: { fontSize: 16, fontWeight: '700', color: '#007070', marginRight: 8 },
  spendInput: { flex: 1, fontSize: 16, fontWeight: '700', color: '#111111' },
  roast: { fontSize: 15, color: '#004040', marginTop: 8, fontStyle: 'italic' },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    alignSelf: 'center',
    marginTop: 20,
  },
  continueText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
