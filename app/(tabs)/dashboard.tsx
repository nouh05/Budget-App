import { getUserData, saveUserData } from '@/utils/userDataStorage';
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

export default function Dashboard() {
  const [streak, setStreak] = useState(0);
  const [totalSaved, setTotalSaved] = useState(0);
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [lastLoggedDate, setLastLoggedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [saveAmount, setSaveAmount] = useState('');

  useEffect(() => {
    const loadUserData = async () => {
      const data = await getUserData();
      if (data) {
        setStreak(data.streak);
        setTotalSaved(data.totalSaved);
        setMonthlySpend(data.monthlySpend);
        setLastLoggedDate(data.lastLoggedDate || null);
      }
    };
    loadUserData();
  }, []);

  const handleLogPress = () => {
    setModalVisible(true);
  };

  const handleSubmitSave = async () => {
    const amount = parseFloat(saveAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid number');
      return;
    }

    const today = new Date().toDateString();
    let newStreak = streak;

    if (lastLoggedDate !== today) {
      newStreak = streak + 1;
      setStreak(newStreak);
      setLastLoggedDate(today);
    }

    const newTotalSaved = totalSaved + amount;
    setTotalSaved(newTotalSaved);

    await saveUserData({
      streak: newStreak,
      totalSaved: newTotalSaved,
      monthlySpend: monthlySpend,
      age: 0,
      lastLoggedDate: today,
    });

    setModalVisible(false);
    setSaveAmount('');
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.contentContainer}>
          {/* Progress Cards */}
          <View style={styles.cardsContainer}>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Current Streak</Text>
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>{streak}</Text>
                <Text style={styles.streakUnit}>days</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Saved</Text>
              <Text style={styles.savedText}>${totalSaved.toFixed(2)}</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, (streak / 7) * 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {streak >= 7 ? '🔥 Perfect Week!' : `${7 - streak} days to weekly goal`}
          </Text>

          {/* Log Button */}
          <TouchableOpacity style={styles.logButton} onPress={handleLogPress}>
            <Text style={styles.logButtonText}>➕ Log Today's Savings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Amount Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>How Much Did You Save Today?</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="$0.00"
              placeholderTextColor="#9ab5b0"
              value={saveAmount}
              onChangeText={setSaveAmount}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={handleSubmitSave}
              >
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
  safeContainer: {
    flex: 1,
    backgroundColor: '#e9fcf9',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#004040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 16,
    color: '#6e928c',
    fontWeight: '600',
    marginBottom: 8,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakText: {
    fontSize: 32,
    color: '#007070',
    fontWeight: '800',
    marginRight: 4,
  },
  streakUnit: {
    fontSize: 16,
    color: '#007070',
    fontWeight: '600',
  },
  savedText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#007070',
  },
  progressBarContainer: {
    backgroundColor: '#d0f0ea',
    height: 12,
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007070',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#004040',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  logButton: {
    backgroundColor: '#007070',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#004040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  logButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,64,64,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004040',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: '#bcebe3',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#007070',
    width: '100%',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f9f7',
    borderWidth: 1,
    borderColor: '#bcebe3',
  },
  cancelButtonText: {
    color: '#007070',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#007070',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
