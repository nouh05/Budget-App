import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/selecthabit");
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
        backgroundColor: '#e9fcf9',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    appName: {
        fontSize: 54,
        fontWeight: '800',
        color: '#003333',
        textAlign: 'center',
        letterSpacing: -2,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 18,
        color: '#006666',
        fontWeight: '400',
        textAlign: 'center',
        letterSpacing: 3,
        textTransform: 'uppercase',
    },
});
