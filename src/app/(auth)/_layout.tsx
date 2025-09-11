import { AuthProvider } from '@/context/AuthContext';
import RootNavigation from '@/components/RootNavigation';

/**
 * This is the root layout for the entire application.
 * It wraps all screens in the AuthProvider so that authentication
 * state (like whether the user is logged in) is available everywhere.
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      {/* The actual navigation stack logic is in the RootNavigation component.
        This is necessary because the component handling navigation needs to be *inside*
        the AuthProvider to be able to access the authentication context.
      */}
      <RootNavigation />
    </AuthProvider>
  );
}

