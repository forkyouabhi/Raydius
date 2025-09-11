import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

/**
 * This component handles the root navigation logic. It determines whether to show 
 * the authentication flow or the main application tabs based on the user's
 * authentication state.
 */
export default function RootNavigation() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication state has been loaded from storage.
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // If the user is authenticated and currently in the auth flow (e.g., on the login screen),
    // redirect them to the main part of the app.
    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/feed');
    } 
    // If the user is not authenticated and is trying to access a screen outside the auth flow,
    // redirect them back to the welcome screen to log in.
    else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // While we are checking for the user's token, show a loading spinner.
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Once the auth state is known, render the main navigation stack.
  return (
    <Stack>
      {/* Defines the layout for the authentication screens (e.g., welcome, login, otp). */}
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      {/* Defines the layout for the main app screens with tabs (e.g., feed, profile). */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* Defines any modal screens you might add later. */}
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
