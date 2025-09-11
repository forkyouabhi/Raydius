import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="welcome" options={{ title: 'Welcome to Raydius' }} />
      <Stack.Screen name="index" options={{ title: 'Welcome to Raydius' }} />
      <Stack.Screen name="login" options={{ title: 'Enter Your Email' }} />
      <Stack.Screen name="otp" options={{ title: 'Verify Your Code' }} />
    </Stack>
  );
}