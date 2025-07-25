import { calculateInvestmentReturn } from '@/utils/calculateReturn';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function calcResult() {
  const { age, monthlySpend, habit } = useLocalSearchParams();
  const numericAge = Number(age);
  const spend = Number(monthlySpend);
  const totalReturn = calculateInvestmentReturn(spend, numericAge, 65, 0.08);

  const handleStartTracking = () => {
    router.push('/dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.habitText}>
        If you quit <Text style={styles.highlight}>{habit}</Text> today...
      </Text>
      <Text style={styles.header}>You're missing out on</Text>
      <Text style={styles.amount}>${totalReturn.toLocaleString()}</Text>
      <Text style={styles.subtext}>by the time you're 65</Text>

      {/* Motivational Nudge */}
      <Text style={styles.nudge}>You don’t need to quit, just save 1% to start 🚀</Text>

      {/* CTA Button */}
      <TouchableOpacity style={styles.trackButton} onPress={handleStartTracking}>
        <Text style={styles.trackButtonText}>Start Tracking Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitText: {
    fontSize: 20,
    color: '#004040',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  highlight: {
    color: '#007070',
    fontWeight: '900',
  },
  header: {
    fontSize: 18,
    color: '#004040',
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'center',
  },
  amount: {
    fontSize: 44,
    fontWeight: '900',
    color: '#007070',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#004040',
    fontWeight: '500',
    textAlign: 'center',
  },
  nudge: {
    fontSize: 16,
    color: '#007070',
    fontWeight: '600',
    marginTop: 32,
    marginBottom: 16,
    textAlign: 'center',
  },
  trackButton: {
    backgroundColor: '#007070',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
