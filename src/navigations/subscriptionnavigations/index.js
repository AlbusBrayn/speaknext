import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ekranlar
import SubscriptionScreen from "../../screens/SubscriptionScreen";

const Stack = createNativeStackNavigator();

export default function SubscriptionNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SubscriptionScreen" component={SubscriptionScreen} />
    </Stack.Navigator>
  );
}
