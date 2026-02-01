// App.js

import React, { useEffect } from 'react';
import AppNavigator from './src/navigations';
import { QueryClientProvider } from '@tanstack/react-query';
import { UserProvider } from './src/contexts/UserContext';
import { configureRevenueCat } from './src/lib/revenuecat';
import { queryClient } from './src/lib/queryClient';


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
