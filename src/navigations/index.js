// src/navigations/rootnavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { useUser } from '../contexts/UserContext';
import useStatus from '../hooks/status';
import { L } from '../utils/logger';

import AuthNavigator from './authnavigations';
import MainNavigator from './mainnavigations';
import OnboardingNavigator from './onboardingnavigations';
import SubscriptionNavigator from './subscriptionnavigations';

import BlankSplash from '../screens/BlankSplash';

export default function RootNavigator() {
  // ---- Auth (yalnızca kimlik & token) ----
  const { isHydrated, accessToken } = useUser();

  // ---- Status (profil/abonelik gating) ----
  const {
    data: status,
    isLoading: statusLoading,
    isFetching: statusFetching,
    isError: statusError,
    error,
  } = useStatus();

  // 1) SecureStore hydration bitmeden hiçbir karar vermiyoruz
  if (!isHydrated) {
    L.nav('state: not hydrated → BlankSplash');
    return <BlankSplash />;
  }

  // 2) Auth yoksa → Auth flow (status hook zaten disabled olur)
  if (!accessToken) {
    L.nav('state: no accessToken → AuthNavigator');
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  // 3) Auth var → status yükleniyor/yenileniyor → geçiş ekranı
  if ((statusLoading || statusFetching) && !status) {
    L.nav('state: status loading/fetching → BlankSplash');
    return <BlankSplash />;
  }

  // Hata durumunu da logla (401’lerde interceptor signOut edeceği için geçici olabilir)
  if (statusError) {
    L.err('status error:', error?.message || error);
    // İstersen burada da BlankSplash göstermek mantıklı
    // return <BlankSplash />;
  }

  L.st('status snapshot:', JSON.stringify(status || {}));

  // 4) Profil tamam değilse → Onboarding
  if (status && !status.is_profile_completed) {
    L.nav('state: is_profile_completed=false → OnboardingNavigator');
    return (
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    );
  }

  // 5) Abonelik aktif değilse → Subscription
  if (status && !status.is_subscription_active) {
    L.nav('state: subscription inactive → SubscriptionNavigator');
    return (
      <NavigationContainer>
        <SubscriptionNavigator />
      </NavigationContainer>
    );
  }

  // 6) Her şey tamamsa → Main
  L.nav('state: all good → MainNavigator');
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
