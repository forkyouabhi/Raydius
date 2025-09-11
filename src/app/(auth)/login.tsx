import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Alert, 
  ActivityIndicator, 
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
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
      
      // Step 3: Navigate to the static OTP screen using a relative path
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Raydius</Text>
          <Text style={styles.label}>Enter your university email to get started.</Text>
          <TextInput
            style={styles.input}
            placeholder="name@university.edu"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholderTextColor="#999"
          />
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleRequestOtp}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Send Code</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: { 
    flex: 1, 
    justifyContent: 'center', 
  },
  content: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 15,
  },
  label: { 
    fontSize: 18, 
    marginBottom: 25,
    color: '#6E6E73',
    textAlign: 'center',
    lineHeight: 24,
  },
  input: { 
    backgroundColor: '#F7F7F7',
    borderWidth: 1, 
    borderColor: '#E0E0E0', 
    paddingVertical: Platform.OS === 'ios' ? 18 : 14,
    paddingHorizontal: 20,
    borderRadius: 12, 
    marginBottom: 20, 
    fontSize: 16, 
    color: '#1C1C1E',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

