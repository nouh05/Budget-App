import { useState } from 'react';

export default function HabitSpendInput() {
    const [amount, setAmount] = useState('');
  
    const handleContinue = () => {
      console.log('Amount entered:', amount);
      // navigate to next screen or save to session
    };
    return (
        <View style={styles.container}>
            <Text style={StyleSheet.header}>Let's get real 💸</Text>
            
        </View>
    )


