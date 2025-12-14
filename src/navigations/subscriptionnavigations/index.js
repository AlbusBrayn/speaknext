import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ekranlar
import SubscriptionScreen_v2 from "../../screens/SubscriptionScreen/subs_v2";

const Stack = createNativeStackNavigator();

export default function SubscriptionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SubscriptionScreen_v2" component={SubscriptionScreen_v2} />
    </Stack.Navigator>
  );
}
