import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AuthChoice() {
  const handleSignIn = () => {
    router.push('/dashboard');
  };

  const handleSignUp = () => {
    router.push('/selecthabit');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>UnBudget</Text>
      <Text style={styles.tagline}>Take control of your habits</Text>

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>
        <Text style={styles.buttonPrimaryText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonSecondary} onPress={handleSignIn}>
        <Text style={styles.buttonSecondaryText}>Already have an account?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',  // Unified lighter mint background
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  appName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#004040',  // Unified dark teal text
    letterSpacing: 1,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 20,
    color: '#007070',  // Accent color for subtext
    marginTop: 12,
    marginBottom: 40,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#007070',  // Accent button color
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonPrimaryText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  buttonSecondary: {
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#007070',  // Border matches accent
    width: '100%',
    alignItems: 'center',
  },
  buttonSecondaryText: {
    color: '#007070',  // Accent text color
    fontSize: 16,
    fontWeight: '600',
  },
});

