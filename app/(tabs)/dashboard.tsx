import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ensureMaxHabits } from '../../utils/habitUtils';
import { HabitData, UserData } from '../../utils/types';

const STORAGE_KEY = '@user_data';
const { width: screenWidth } = Dimensions.get('window');

export default function Dashboard() {
  const [habits, setHabits] = useState<{ [key: string]: HabitData }>({});
  const [userData, setUserData] = useState<UserData | null>(null);
  const [animations] = useState<{ [key: string]: Animated.Value }>({});

  useEffect(() => {
    Object.keys(habits).forEach((habit) => {
      if (!animations[habit]) {
        animations[habit] = new Animated.Value(0);
      }
    });
  }, [habits]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed: UserData = JSON.parse(stored);
          setUserData(parsed);
          setHabits(parsed.habits || {});
          await ensureMaxHabits(3);
        }
      } catch (e) {
        console.error('Failed to load user data', e);
      }
    };
    loadData();
  }, []);

  const getSavingTier = (streak: number) => {
    if (streak >= 30) return { tier: 'Platinum', color: '#8B7355', bgColor: '#f8f7f5', icon: '💎' };
    if (streak >= 21) return { tier: 'Gold', color: '#D4AF37', bgColor: '#fffef8', icon: '🏆' };
    if (streak >= 7) return { tier: 'Silver', color: '#8C92AC', bgColor: '#f9f9fa', icon: '🥈' };
    return { tier: 'Bronze', color: '#CD7F32', bgColor: '#faf8f5', icon: '🥉' };
  };

  const getNextTierProgress = (streak: number) => {
    if (streak >= 30) return { current: streak, target: 30, percentage: 100 };
    if (streak >= 21) return { current: streak, target: 30, percentage: ((streak - 21) / 9) * 100 };
    if (streak >= 7) return { current: streak, target: 21, percentage: ((streak - 7) / 14) * 100 };
    return { current: streak, target: 7, percentage: (streak / 7) * 100 };
  };

  const getHabitIcon = (habit: string) => {
    switch (habit) {
      case 'DoorDash': return '🍔';
      case 'Starbucks': return '☕';
      case 'Uber': return '🚗';
      case 'Energy Drinks': return '⚡';
      case 'Dunkin': return '🥯';
      default: return '💸';
    }
  };

  const handleLogSave = async (habit: string) => {
    if (!userData) return;

    const habitData = habits[habit];
    if (!habitData) return;

    const amount = habitData.perUseSpend ?? 0;
    const today = new Date().toDateString();

    if (habitData.lastLoggedDate === today) {
      Alert.alert(
        'Already Logged', 
        `You already logged avoiding ${habit} today. Come back tomorrow to continue your streak!`,
        [{ text: 'Got it', style: 'default' }]
      );
      return;
    }

    // Trigger animation
    if (animations[habit]) {
      Animated.sequence([
        Animated.timing(animations[habit], {
          toValue: 1,
          duration: 150,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animations[habit], {
          toValue: 0,
          duration: 150,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }

    const currentStreak = userData.streak ?? 0;
    let newStreak = currentStreak;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    if (userData.lastLoggedDate === yesterdayString) {
      newStreak = currentStreak + 1;
    } else if (userData.lastLoggedDate !== today) {
      newStreak = 1;
    }

    const updatedHabits = {
      ...habits,
      [habit]: {
        ...habitData,
        lastLoggedDate: today,
        totalSaved: (habitData.totalSaved ?? 0) + amount,
      },
    };
    
    const updatedData: UserData = {
      ...userData,
      habits: updatedHabits,
      totalSaved: (userData.totalSaved ?? 0) + amount,
      streak: newStreak,
      lastLoggedDate: today,
    };
    
    setUserData(updatedData);
    setHabits(updatedHabits);
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      const tier = getSavingTier(newStreak);
      let message = `You saved $${amount.toFixed(2)} by avoiding ${habit}!\n\n`;
      message += `Total saved: $${(updatedData.totalSaved ?? 0).toFixed(2)}\n`;
      message += `Current streak: ${newStreak} days`;
      
      if (newStreak === 7 || newStreak === 21 || newStreak === 30) {
        message += `\n\n🎉 Level up! You've reached ${tier.tier} status!`;
      }
      
      Alert.alert('Well done!', message, [{ text: 'Keep going!', style: 'default' }]);
    } catch (e) {
      console.error('Failed to save user data', e);
      Alert.alert('Error', 'Unable to save your progress. Please try again.');
    }
  };

  const currentStreak = userData?.streak ?? 0;
  const totalSaved = userData?.totalSaved ?? 0;
  const tierInfo = getSavingTier(currentStreak);
  const progressInfo = getNextTierProgress(currentStreak);
  const habitsList = Object.keys(habits);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Your Progress</Text>
          <Text style={styles.subtitle}>Track your spending habits and build streaks</Text>
        </View>

        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{currentStreak}</Text>
              <Text style={styles.fireEmoji}>🔥</Text>
            </View>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>${totalSaved.toFixed(0)}</Text>
              <Text style={styles.moneyEmoji}>💰</Text>
            </View>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
        </View>

        {/* Tier Progress */}
        <View style={[styles.tierCard, { backgroundColor: tierInfo.bgColor }]}>
          <View style={styles.tierHeader}>
            <Text style={styles.tierIcon}>{tierInfo.icon}</Text>
            <View style={styles.tierTextContainer}>
              <Text style={[styles.tierTitle, { color: tierInfo.color }]}>
                {tierInfo.tier}
              </Text>
              <Text style={styles.tierSubtitle}>Current Level</Text>
            </View>
          </View>
          
          {currentStreak < 30 && (
            <View style={styles.progressSection}>
              <Text style={styles.nextTierText}>
                {progressInfo.target - currentStreak} more days to {getSavingTier(progressInfo.target).tier}
              </Text>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
                    { 
                      width: `${Math.max(progressInfo.percentage, 8)}%`,
                      backgroundColor: tierInfo.color 
                    }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Habits Section */}
        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          
          {habitsList.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎯</Text>
              <Text style={styles.emptyTitle}>No habits added yet</Text>
              <Text style={styles.emptyDescription}>
                Add a spending habit to start tracking your progress
              </Text>
            </View>
          ) : (
            <View style={[
              styles.habitsGrid,
              habitsList.length === 1 && styles.singleHabit,
              habitsList.length === 2 && styles.twoHabits,
              habitsList.length === 3 && styles.threeHabits,
            ]}>
              {habitsList.map((habit) => {
                const data = habits[habit];
                const isLoggedToday = data?.lastLoggedDate === new Date().toDateString();
                
                const animatedScale = animations[habit]?.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.96],
                });

                return (
                  <Animated.View
                    key={habit}
                    style={[
                      styles.habitCard,
                      isLoggedToday && styles.habitCardCompleted,
                      { transform: [{ scale: animatedScale || 1 }] }
                    ]}
                  >
                    <View style={styles.habitTop}>
                      <Text style={styles.habitIcon}>{getHabitIcon(habit)}</Text>
                      <Text style={styles.habitName}>{habit}</Text>
                      <Text style={styles.habitCost}>${(data?.perUseSpend ?? 0).toFixed(2)}</Text>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.actionButton,
                        isLoggedToday && styles.actionButtonCompleted
                      ]}
                      onPress={() => handleLogSave(habit)}
                      disabled={isLoggedToday}
                    >
                      <Text style={[
                        styles.actionButtonText,
                        isLoggedToday && styles.actionButtonTextCompleted
                      ]}>
                        {isLoggedToday ? 'Completed Today' : 'I Avoided This'}
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',
  },
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#003333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#006666',
    textAlign: 'center',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#003333',
    marginRight: 4,
  },
  fireEmoji: {
    fontSize: 20,
  },
  moneyEmoji: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006666',
  },
  tierCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tierIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  tierTextContainer: {
    flex: 1,
  },
  tierTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  tierSubtitle: {
    fontSize: 14,
    color: '#006666',
    fontWeight: '500',
  },
  progressSection: {
    alignItems: 'center',
  },
  nextTierText: {
    fontSize: 14,
    color: '#006666',
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e0f7f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  habitsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003333',
    marginBottom: 16,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#005555',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#006666',
    textAlign: 'center',
    lineHeight: 20,
  },
  habitsGrid: {
    gap: 16,
  },
  singleHabit: {
    alignItems: 'center',
  },
  twoHabits: {
    flexDirection: screenWidth > 400 ? 'row' : 'column',
  },
  threeHabits: {
    // Keep as column for better readability on mobile
  },
  habitCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#007070',
  },
  habitCardCompleted: {
    backgroundColor: '#f0f9f7',
    borderLeftColor: '#00a080',
  },
  habitTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003333',
    flex: 1,
  },
  habitCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007070',
    backgroundColor: '#e0f7f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionButton: {
    backgroundColor: '#007070',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonCompleted: {
    backgroundColor: '#00a080',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextCompleted: {
    color: '#ffffff',
  },
});