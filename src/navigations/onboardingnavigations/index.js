import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ekranlar
import OnboardingNameScreen from "../../screens/OnboardingNameScreen";
import OnboardingEnglishLevelScreen from "../../screens/OnboardingEnglishLevelScreen";
import OnboardingReferralScreen from "../../screens/OnboardingReferralScreen";

const Stack = createNativeStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="OnboardingNameScreen" component={OnboardingNameScreen} />
      <Stack.Screen name="OnboardingEnglishLevelScreen" component={OnboardingEnglishLevelScreen} />
      <Stack.Screen name="OnboardingReferralScreen" component={OnboardingReferralScreen} />
    </Stack.Navigator>
  );
}
