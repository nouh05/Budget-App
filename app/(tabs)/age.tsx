import { saveUserData } from '@/utils/userDataStorage';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
export default function UserAge() {
    const [amount, setAmount] = useState('');
    const { habit, monthlySpend } = useLocalSearchParams();
    const handleContinue = () => {
      console.log('Amount entered:', amount);
      // navigate to next screen or save to session
      if (!amount || isNaN(Number(amount))) {
        Alert.alert('Please enter a valid age');
        return;
      }
    
      const userData = {
        monthlySpend: Number(monthlySpend),
        age: Number(amount),
        streak: 0, 
        totalSaved: 0, 
      };
    
      saveUserData(userData);
      router.push({
        pathname: '/result',
        params: { age: amount,
        monthlySpend,
        habit },
      });
    };
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Step 3 of 3</Text>
            <Text style={styles.header}>LAST QUESTION</Text>
            <Text style={styles.title}>
                How old are you? 💸
            </Text>
    
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
      backgroundColor: '#e9fcf9', // lighter mint background
      paddingHorizontal: 24,
      paddingTop: 60,
    },
    header: {
      fontSize: 14,
      fontWeight: '600',
      color: '#004040', // softened dark teal
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: '#004040', // matches header
      marginBottom: 8,
    },
    continueButton: {
      backgroundColor: '#007070', // more vibrant than #025E5E
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
      borderColor: '#bcebe3', // lighter border to match bg
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 18,
      fontSize: 20,
      fontWeight: '600',
      color: '#007070', // matches button
      backgroundColor: '#ffffff',
      marginBottom: 24,
    },
  });
  