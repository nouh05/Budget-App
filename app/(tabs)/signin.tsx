import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PhoneSignIn() {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Please enter a valid phone number');
      return;
    }

    try {
      await AsyncStorage.setItem('userPhone', phoneNumber);
      console.log('Phone number saved:', phoneNumber);
      router.push('/dashboard');  // Navigate to Dashboard page
    } catch (e) {
      console.error('Failed to save phone number:', e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's Get Started</Text>
      <Text style={styles.title}>Enter your phone number</Text>

      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="+1 555 123 4567"
        placeholderTextColor="#a0a0a0"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
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
