// App.js

import React, { useEffect } from 'react';
import AppNavigator from './src/navigations';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './src/contexts/UserContext';
import { configureRevenueCat } from './src/lib/revenuecat';


// Export queryClient so it can be used to clear cache on logout/delete
export const queryClient = new QueryClient();

export default function App() {
  useEffect(() => {
    configureRevenueCat(); // RevenueCat tek seferlik configure
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppNavigator />
      </UserProvider>
    </QueryClientProvider>
  );
}
