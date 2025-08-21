import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function Dashboard() {
  const [habits, setHabits] = useState<{ [key: string]: HabitData }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [currentHabit, setCurrentHabit] = useState<string | null>(null);
  const [saveAmount, setSaveAmount] = useState('');
  const [userData, setUserData] = useState<UserData | null>(null);

  // Load habits from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: UserData = JSON.parse(stored);
          setUserData(parsed);
          setHabits(parsed.habits || {});
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      }
    };
    loadData();
  }, []);

  const handleLogPress = (habit: string) => {
    setCurrentHabit(habit);
    setSaveAmount((habits[habit]?.monthlySpend / 30).toFixed(2)); // default daily save
    setModalVisible(true);
  };

  const handleSubmitSave = async () => {
    if (!currentHabit) return;

    const amount = parseFloat(saveAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid number');
      return;
    }

    const today = new Date().toDateString();
    const habitData = habits[currentHabit] || {
      monthlySpend: 0,
      streak: 0,
      totalSaved: 0,
      lastLoggedDate: null,
    };

    let newStreak = habitData.streak;
    if (habitData.lastLoggedDate !== today) {
      newStreak = habitData.streak + 1;
    }

    const updatedHabit = {
      ...habitData,
      streak: newStreak,
      totalSaved: habitData.totalSaved + amount,
      lastLoggedDate: today,
    };

    const updatedHabits = { ...habits, [currentHabit]: updatedHabit };
    setHabits(updatedHabits);

    // Update storage
    try {
      const updatedData: UserData = { ...userData, habits: updatedHabits };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      setUserData(updatedData);
    } catch (e) {
      console.error('Failed to save user data', e);
    }

    setModalVisible(false);
    setCurrentHabit(null);
    setSaveAmount('');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {Object.keys(habits).map(habit => {
          const data = habits[habit];
          const dailyGoal = (data.monthlySpend / 30).toFixed(2);
          return (
            <View key={habit} style={styles.card}>
              <Text style={styles.habitName}>{habit}</Text>
              <Text style={styles.dailyGoal}>Daily Goal: ${dailyGoal}</Text>
              <Text style={styles.streakText}>Streak: {data.streak} days</Text>
              <Text style={styles.totalSaved}>Saved: ${data.totalSaved.toFixed(2)}</Text>
              <TouchableOpacity style={styles.logButton} onPress={() => handleLogPress(habit)}>
                <Text style={styles.logButtonText}>Log Today's Save</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Savings for {currentHabit}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={saveAmount}
              onChangeText={setSaveAmount}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitSave}>
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#e9fcf9' },
  scrollContainer: { paddingHorizontal: 24, paddingVertical: 32 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#004040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  habitName: { fontSize: 20, fontWeight: '700', color: '#004040', marginBottom: 8 },
  dailyGoal: { fontSize: 16, color: '#007070', marginBottom: 4 },
  streakText: { fontSize: 16, color: '#007070', marginBottom: 4 },
  totalSaved: { fontSize: 16, color: '#007070', marginBottom: 12 },
  logButton: { backgroundColor: '#007070', padding: 12, borderRadius: 12, alignItems: 'center' },
  logButtonText: { color: '#fff', fontWeight: '700' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,64,64,0.4)' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 16, width: '90%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 2, borderColor: '#bcebe3', borderRadius: 12, padding: 12, fontSize: 16, marginBottom: 16, textAlign: 'center' },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#f0f9f7', marginRight: 8, alignItems: 'center' },
  cancelButtonText: { color: '#007070', fontWeight: '600' },
  submitButton: { flex: 1, padding: 12, borderRadius: 12, backgroundColor: '#007070', marginLeft: 8, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontWeight: '700' },
});
