import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HabitSpendInput() {
  const [amount, setAmount] = useState('');
  const { habit } = useLocalSearchParams();

  const handleContinue = () => {
    console.log('Amount entered:', amount);
    router.push({
      pathname: '/age',
      params: { habit, monthlySpend: amount },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Step 2 of 3</Text>
      <Text style={styles.title}>Be real</Text>
      <Text style={styles.question}>
        How much do you spend on it each month? 💸
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="$0.00"
        placeholderTextColor="#a0a0a0"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Last Question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',  // Lighter mint
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004040',
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#004040',
    marginBottom: 8,
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004040',
    marginBottom: 32,
    textAlign: 'center',
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
    width: '100%',
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
