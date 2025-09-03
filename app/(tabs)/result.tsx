import { calculateInvestmentReturn } from '@/utils/calculateReturn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const STORAGE_KEY = '@user_data';

type HabitData = {
  monthlySpend: number;
  streak: number;
  totalSaved: number;
  lastLoggedDate: string | null;
  perUseSpend: number;
};

type UserData = {
  habits?: { [habitName: string]: HabitData };
  age?: number;
  totalSaved?: number;
  streak?: number;
  lastLoggedDate?: string | null;
};

export default function CalcResult() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadError, setLoadError] = useState('');
  
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoadError('Something went wrong loading your data.');
      }
    };
    loadUserData();
  }, []);

  if (!userData || !userData.habits || Object.keys(userData.habits).length === 0 || !userData.age) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Loading...</Text>
        {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}
      </ScrollView>
    );
  }

  // Get the first habit instead of looking for selectedHabit
  const habitNames = Object.keys(userData.habits);
  const habit = habitNames[0];
  const habitData = userData.habits[habit];
  
  if (!habitData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          We couldn't find your habit data. Please go back and try again.
        </Text>
        <TouchableOpacity style={styles.trackButton} onPress={() => router.push('/addHabits')}>
          <Text style={styles.trackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  const monthlySpend = habitData.monthlySpend || 0;
  const age = userData.age;

  const oneYearReturn = calculateInvestmentReturn(monthlySpend, age, age + 1, 0.08);
  const fiveYearReturn = calculateInvestmentReturn(monthlySpend, age, age + 5, 0.08);
  const tenYearReturn = calculateInvestmentReturn(monthlySpend, age, age + 10, 0.08);
  const sixtyFiveReturn = calculateInvestmentReturn(monthlySpend, age, 65, 0.08);

  const handleStartTracking = () => {
    router.push('/addHabits');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.habitText}>
        If you quit <Text style={styles.highlight}>{habit}</Text> today...
      </Text>
      <Text style={styles.header}>Here's what you're missing out on</Text>

      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardAmount}>${oneYearReturn.toLocaleString()}</Text>
          <Text style={styles.cardLabel}>In 1 Year</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardAmount}>${fiveYearReturn.toLocaleString()}</Text>
          <Text style={styles.cardLabel}>In 5 Years</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardAmount}>${tenYearReturn.toLocaleString()}</Text>
          <Text style={styles.cardLabel}>In 10 Years</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardAmount}>${sixtyFiveReturn.toLocaleString()}</Text>
          <Text style={styles.cardLabel}>By Age 65</Text>
        </View>
      </View>

      <Text style={styles.nudge}>You don't need to quit, just save 1% to start.</Text>

      <TouchableOpacity style={styles.trackButton} onPress={handleStartTracking}>
        <Text style={styles.trackButtonText}>Start Tracking Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// KEEP ALL YOUR ORIGINAL STYLES EXACTLY AS THEY WERE
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#003333',
    marginBottom: 12,
    textAlign: 'center',
  },
  habitText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#005555',
    marginBottom: 24,
    textAlign: 'center',
  },
  highlight: {
    color: '#007070',
    fontWeight: '700',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007070',
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    color: '#006666',
  },
  nudge: {
    fontSize: 16,
    color: '#005555',
    marginBottom: 32,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  trackButton: {
    backgroundColor: '#007070',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: 'center',
  },
  trackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  errorText: {
    color: '#FF4D4D',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 16,
  },
}); 
