import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/authChoice");
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>UnBudget 🌱</Text>
            <Text style={styles.tagline}>Track. Save. Thrive.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e9fcf9',  // Unified background
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    appName: {
        fontSize: 48,  // Slightly smaller to match rest of app
        fontWeight: '900',
        color: '#004040',  // Unified text color
        textAlign: 'center',
    },
    tagline: {
        fontSize: 20,
        color: '#007070',  // Subtle highlight color
        marginTop: 20,
        fontWeight: '600',
        textAlign: 'center',
    },
});
