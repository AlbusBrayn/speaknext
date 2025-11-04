import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Ekranlar
import LoginScreen from "../../screens/registerScreen";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}
