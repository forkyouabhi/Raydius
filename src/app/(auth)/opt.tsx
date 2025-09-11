import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '@/api/apiClient';
import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFetchingEmail, setIsFetchingEmail] = useState(true);
  const { login } = useAuth();
  const router = useRouter();

  // On component mount, fetch the email that was stored by the login screen
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem('loginEmail');
        if (storedEmail) {
          setEmail(storedEmail);
        } else {
          // This case handles if the user somehow lands here without an email.
          Alert.alert("Error", "Could not find your email for verification. Please start over.");
          router.replace('./login');
        }
      } catch (error) {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
        router.replace('./login');
      } finally {
        setIsFetchingEmail(false);
      }
    };

    fetchEmail();
  }, []);

  const handleVerifyOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Verification email not found. Please go back.');
      return;
    }
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code sent to your email.');
      return;
    }

    setLoading(true);
    try {
      // Step 1: Send the email and OTP to the backend for verification
      const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
      const { token, user } = response.data;

      // Step 2: Call the login function from AuthContext to save the session
      await login(token, user);

      // Step 3: Clean up the temporarily stored email
      await AsyncStorage.removeItem('loginEmail');

      // The root layout will now automatically redirect the user to the main app
    } catch (error: any) {
      console.error("OTP Verification Error:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || 'Verification failed. Please try again.';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Display a loading indicator while we fetch the email from storage
  if (isFetchingEmail) {
    return <View style={styles.container}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>A 6-digit code was sent to:</Text>
      <Text style={styles.emailText}>{email}</Text>
      <TextInput
        style={styles.input}
        placeholder="123456"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        textAlign="center"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Verify and Log In" onPress={handleVerifyOtp} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      justifyContent: 'center', 
      padding: 20,
      backgroundColor: '#f5f5f5',
    },
    label: { 
      fontSize: 18, 
      textAlign: 'center', 
      marginBottom: 5,
      color: '#333',
    },
    emailText: { 
      fontSize: 20, 
      fontWeight: 'bold', 
      textAlign: 'center', 
      marginBottom: 20 
    },
    input: { 
      backgroundColor: 'white',
      borderWidth: 1, 
      borderColor: '#ddd', 
      paddingVertical: Platform.OS === 'ios' ? 15 : 12,
      paddingHorizontal: 15,
      borderRadius: 8, 
      marginBottom: 20, 
      fontSize: 22, 
      fontWeight: 'bold',
      letterSpacing: 8, // Adds spacing between the numbers
    },
});

