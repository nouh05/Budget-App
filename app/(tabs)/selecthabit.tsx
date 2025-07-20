import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const habits = ['DoorDash', 'Impulse Amazon', 'Uber', 'Thrift fits', 'Crypto coins'];

export type RootStackParamList = {
  SelectHabit: undefined;
  NextScreen: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SelectHabit'>;
};

export default function SelectHabitScreen({ navigation }: Props) {
  const [selectedHabit, setSelectedHabit] = useState('');
  const [showButton, setShowButton] = useState(false);

  const handleSelect = (habit: string) => {
    setSelectedHabit(habit);
    setShowButton(true);
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

      {selectedHabit && (
        <>
          <Text style={styles.roast}>{getRoast(selectedHabit)}</Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('NextScreen')}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#d6f5f0',
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    header: {
      fontSize: 14,
      fontWeight: '600',
      color: '#004d4d',
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: '#004d4d',
      marginBottom: 8,
    },
    question: {
      fontSize: 20,
      fontWeight: '700',
      color: '#102020',
      marginBottom: 32,
    },
    optionsContainer: {
      width: '100%',
      alignItems: 'flex-start',
    },
    optionButton: {
      backgroundColor: '#ffffff',
      borderRadius: 16,
      paddingVertical: 14,
      paddingHorizontal: 20,
      marginBottom: 16,
      width: '85%',
      borderWidth: 2,
      borderColor: '#ffffff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
      transform: [{ translateX: 8 }],
    },
    selectedOptionButton: {
      backgroundColor: '#e0f7f5',
      borderColor: '#007f7f',
    },
    optionText: {
      fontSize: 16,
      color: '#111111',
      fontWeight: '700',
    },
    selectedOptionText: {
      color: '#007f7f',
    },
    roast: {
      fontSize: 15,
      color: '#333333',
      marginTop: 32,
      marginBottom: 24,
      paddingHorizontal: 4,
      fontStyle: 'italic',
      alignSelf: 'flex-start',
    },
    continueButton: {
      backgroundColor: '#025E5E',
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
  })
  