import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Define your stack param list (replace with your actual navigation types)
type RootStackParamList = {
  Loading: undefined;
  Home: undefined;
  // Add other screens here as needed
};

type Props = StackScreenProps<RootStackParamList, 'Loading'>;

export default function LoadingScreen({ navigation }: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace('Home');
        }, 2500);
        
        return () => clearTimeout(timer);
    }, [navigation]); // Add navigation to dependency array

    return (
        <View style={styles.container}>
            <Text style={styles.appName}>BudgetBuddy 🌱</Text>
            <Text style={styles.tagline}>Track. Save. Thrive. </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d0f0ea', 
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,  
    },
    appName: {
        fontSize: 52,
        fontWeight: '900',
        color: '#155e59',
        letterSpacing: 1,        
        textAlign: 'center',
    },
    tagline: {
        fontSize: 30,
        color: '#155e59',
        marginTop: 24,           
        textAlign: 'center',
    },
});
