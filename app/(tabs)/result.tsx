import { calculateInvestmentReturn } from '@/utils/calculateReturn';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function calcResult() {
  const { age, monthlySpend, habit } = useLocalSearchParams();
  const numericAge = Number(age);
  const spend = Number(monthlySpend);

  const oneYearReturn = calculateInvestmentReturn(spend, numericAge, numericAge + 1, 0.08);
  const fiveYearReturn = calculateInvestmentReturn(spend, numericAge, numericAge + 5, 0.08);
  const tenYearReturn = calculateInvestmentReturn(spend, numericAge, numericAge + 10, 0.08);
  const sixtyFiveReturn = calculateInvestmentReturn(spend, numericAge, 65, 0.08);

  const handleStartTracking = () => {
    router.push('/dashboard');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.habitText}>
        If you quit <Text style={styles.highlight}>{habit}</Text> today...
      </Text>
      <Text style={styles.header}>Here’s what you’re missing out on</Text>

      {/* Cards Grid */}
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

      {/* Motivational Nudge */}
      <Text style={styles.nudge}>You don’t need to quit, just save 1% to start.</Text>

      {/* CTA Button */}
      <TouchableOpacity style={styles.trackButton} onPress={handleStartTracking}>
        <Text style={styles.trackButtonText}>Start Tracking Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#e9fcf9',
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  habitText: {
    fontSize: 20,
    color: '#004040',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  highlight: {
    color: '#004040',
    fontWeight: '900',
  },
  header: {
    fontSize: 18,
    color: '#004040',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
    width: '100%',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '48%',
    paddingVertical: 20,
    marginBottom: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#004040',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#004040',
    textAlign: 'center',
  },
  nudge: {
    fontSize: 16,
    color: '#004040',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  trackButton: {
    backgroundColor: '#004040',
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
