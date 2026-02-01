import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useUser } from "../contexts/UserContext";
import useStatus from '../hooks/status';
import { L } from '../utils/logger';




import AuthNavigator from "./authnavigations";
import MainNavigator from "./mainnavigations";
// Navigators
import OnboardingNavigator from "./onboardingnavigations";
import SubscriptionNavigator from "./subscriptionnavigations";

// Splash Screen
import BlankSplash from "../screens/BlankSplash";

// API helper
export default function RootNavigator() {
  const {
    accessToken,
    isHydrated,
  } = useUser();

  const { data: status, isLoading: statusLoading, isFetching } = useStatus();
  


  

     // 1) AsyncStorage hydration bitmeden karar verme
  if (!isHydrated) return <BlankSplash />;
  L.nav('state: not hydrated → BlankSplash');

  // 2) Auth yoksa → Auth akışı
  if (!accessToken) {
    L.nav('state: no accessToken → AuthNavigator');
    return (
      <NavigationContainer>
        <AuthNavigator />
      </NavigationContainer>
    );
  }

  // 3) Auth var → status yüklenirken geçiş ekranı
  if (statusLoading || isFetching) {
    L.nav('state: status loading → BlankSplash');
    return <BlankSplash />;
  }
  L.nav('status snapshot:', status);


  // 4) Profil tamam değilse → Onboarding
  if (!status?.is_profile_completed) {
    L.nav('state: is_profile_completed=false → OnboardingNavigator');
    return (
      <NavigationContainer>
        <OnboardingNavigator />
      </NavigationContainer>
    );
  }

  // 5) (Geçici) Abonelik guard'ını kapatıyoruz (emülatörde satın alma yok)
  // if (!status?.is_subscription_active) {
  //   L.nav('state: subscription inactive → SubscriptionNavigator');
  //   return (
  //     <NavigationContainer>
  //       <SubscriptionNavigator />
  //     </NavigationContainer>
  //   );
  // }

  // 6) Her şey tamamsa → Main
  L.nav('state: all good → MainNavigator');
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
}
