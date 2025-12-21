import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeDashboardScreen from "../../screens/homePage";
import BlankSplash from "../../screens/BlankSplash";
import ProfileScreen from "../../screens/profile";
import GrammarScreen from "../../screens/grammar";
import SpeakingResultScreen from "../../screens/speakingResult";
import SpeakingFeedbackScreen from "../../screens/speakingFeedback";
import SpeakingIntroScreen from "../../screens/speakingIntro";
import SpeakingStartScreen from "../../screens/speakingStart";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const stackScreenOptions = {
  headerShown: false,
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#4460cd",
        tabBarInactiveTintColor: "#8a8a92",
        tabBarStyle: {
          backgroundColor: "#1E1E2E",
          borderTopColor: "#1E1E2E",
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconName =
            route.name === "Home"
              ? focused
                ? "home"
                : "home-outline"
              : focused
              ? "person"
              : "person-outline";
          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeDashboardScreen}
        options={{ title: "Home" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="BlankSplash" component={BlankSplash} />
      <Stack.Screen name="GrammarScreen" component={GrammarScreen} />
      <Stack.Screen name="SpeakingResult" component={SpeakingResultScreen} />
      <Stack.Screen name="SpeakingFeedback" component={SpeakingFeedbackScreen} />
      <Stack.Screen name="SpeakingIntroScreen" component={SpeakingIntroScreen} />
      <Stack.Screen name="SpeakingStartScreen" component={SpeakingStartScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
