import { getItem } from '@/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { ConfirmationResult, signInWithPhoneNumber } from 'firebase/auth';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../firebase/config';
// --- Helpers to track OTP requests in AsyncStorage ---
const MAX_ATTEMPTS = 5;
const OTP_KEY = "otpAttempts";

// Get OTP count for today
async function getOtpCount(): Promise<number> {
  const today = new Date().toDateString();
  const stored = await AsyncStorage.getItem(OTP_KEY);
  if (!stored) return 0;

  const parsed = JSON.parse(stored);
  if (parsed.date !== today) {
    // Reset if day changed
    await AsyncStorage.setItem(OTP_KEY, JSON.stringify({ date: today, count: 0 }));
    return 0;
  }
  return parsed.count;
}

// Increment OTP count
async function incrementOtpCount(): Promise<number> {
  const today = new Date().toDateString();
  const stored = await AsyncStorage.getItem(OTP_KEY);
  let newCount = 1;

  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.date === today) {
      newCount = (parsed.count || 0) + 1;
    }
  }

  await AsyncStorage.setItem(OTP_KEY, JSON.stringify({ date: today, count: newCount }));
  return newCount;
}

// --- Main Component ---
export default function PhoneSignIn() {
  const [message, setMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendLoading, setResendLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otpDigits];
    newOtp[index] = value;
    setOtpDigits(newOtp);
    setOtp(newOtp.join(''));

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
    if (errorMessage) setErrorMessage('');
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && otpDigits[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    const loadPhoneNumber = async () => {
      const savedNumber = await getItem("userPhoneNumber");
      if (savedNumber) {
        const hasOnboarded = await AsyncStorage.getItem(`${savedNumber}:hasOnboarded`);
        router.push(hasOnboarded === 'true' ? '/dashboard' : '/selecthabit');
      }
    };
    loadPhoneNumber();
  }, []);

  useEffect(() => {
    if (resendCooldown > 0 && timer.current === null) {
      timer.current = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            if (timer.current !== null) {
              clearInterval(timer.current);
              timer.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer.current !== null) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [resendCooldown]);

  const handleContinue = async () => {
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMessage("Please enter a valid phone number");
      return;
    }
    const formattedPhone = '+1' + digitsOnly;

    const currentCount = await getOtpCount();
    if (currentCount >= MAX_ATTEMPTS) {
      setErrorMessage("You've reached the daily OTP request limit");
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, formattedPhone);
      setConfirmationResult(result);
      setIsOtpSent(true);
      await incrementOtpCount();
    } catch (e) {
      setErrorMessage("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage("Please enter the OTP you received");
      return;
    }
    if (otp.length !== 6) {
      setErrorMessage("OTP must be 6 digits");
      return;
    }
    if (!confirmationResult) {
      setErrorMessage("No OTP session found. Please try again");
      return;
    }

    setLoading(true);
    try {
      await confirmationResult.confirm(otp);
      await SecureStore.setItemAsync('userPhoneNumber', phoneNumber);
      await AsyncStorage.setItem(`${phoneNumber}:hasOnboarded`, 'false');
      router.push('/dashboard');
    } catch (e) {
      console.error('Error verifying OTP:', e);
      setErrorMessage("Invalid OTP, please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    const currentCount = await getOtpCount();
    if (currentCount >= MAX_ATTEMPTS) {
      setErrorMessage("You've reached the daily OTP request limit");
      return;
    }

    setResendLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, '+1' + phoneNumber.replace(/\D/g, ''));
      setConfirmationResult(result);
      setResendCooldown(30);
      await incrementOtpCount();
    } catch (e) {
      setErrorMessage("Error resending OTP");
    } finally {
      setResendLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-2 text-gray-600">Please wait...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let's Get Started</Text>

      {!isOtpSent ? (
        <>
          <Text style={styles.title}>Enter your phone number</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="+1 555 123 4567"
            placeholderTextColor="#a0a0a0"
            value={phoneNumber}
            onChangeText={text => {
              setPhoneNumber(text);
              if (errorMessage) setErrorMessage('');
            }}
            editable={!loading}
          />
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
          <TouchableOpacity
            style={[styles.continueButton, loading && { opacity: 0.5 }]}
            onPress={handleContinue}
            disabled={loading}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Enter the OTP sent to your phone</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            {otpDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { otpRefs.current[index] = ref; }}
                style={styles.otpBox}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={value => handleOtpChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                editable={!loading}
              />
            ))}
          </View>
          {errorMessage !== '' && <Text style={styles.errorText}>{errorMessage}</Text>}
          <TouchableOpacity
            style={[styles.continueButton, loading && { opacity: 0.5 }]}
            onPress={handleVerifyOtp}
            disabled={loading}
          >
            <Text style={styles.continueText}>Verify</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              (resendCooldown > 0 || resendLoading) && { opacity: 0.5 }
            ]}
            onPress={handleResend}
            disabled={resendCooldown > 0 || resendLoading}
          >
            <Text style={styles.continueText}>
              {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9fcf9',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004040',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#004040',
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: '#007070',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  continueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  input: {
    borderWidth: 2,
    borderColor: '#bcebe3',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 20,
    fontWeight: '600',
    color: '#007070',
    backgroundColor: '#ffffff',
    marginBottom: 24,
  },
  otpBox: {
    width: 40,
    height: 50,
    borderWidth: 2,
    borderColor: '#bcebe3',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#007070',
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: '#FF4D4D',       
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
});
