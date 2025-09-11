import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import apiClient from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';

export default function OtpScreen() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { email } = useLocalSearchParams<{ email: string }>();
  const { login } = useAuth();

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
      const { token, user } = response.data;
      await login(token, user);
      // The root layout will automatically redirect to the main app now
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      Alert.alert('Verification Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
      />
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Verify and Log In" onPress={handleVerifyOtp} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    label: { fontSize: 16, textAlign: 'center', marginBottom: 5 },
    emailText: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 20, textAlign: 'center' },
});