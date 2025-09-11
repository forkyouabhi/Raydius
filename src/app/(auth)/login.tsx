import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import apiClient from '@/api/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRequestOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your university email.');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Call the backend to send the OTP email
      await apiClient.post('/api/auth/request-otp', { email });
      
      // Step 2: Securely store the email on the device for the next screen
      await AsyncStorage.setItem('loginEmail', email);

      Alert.alert('Success', 'A login code has been sent to your email.');
      
      // Step 3: Navigate to the static OTP screen without exposing the email
      router.push('./otp');

    } catch (error: any) {
      // Log the full error for debugging purposes
      console.error("Login Error:", error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter your university email to begin:</Text>
      <TextInput
        style={styles.input}
        placeholder="name@university.edu"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Send Code" onPress={handleRequestOtp} />
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
    marginBottom: 10,
    color: '#333',
  },
  input: { 
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: '#ddd', 
    paddingVertical: Platform.OS === 'ios' ? 15 : 12,
    paddingHorizontal: 15,
    borderRadius: 8, 
    marginBottom: 20, 
    fontSize: 16, 
  },
});

