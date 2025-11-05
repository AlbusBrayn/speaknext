import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens (örnek: şimdilik SpeakingResults, ileride HomePage eklenecek)
import HomeDashboardScreen from "../../screens/homePage";
import BlankSplash from "../../screens/BlankSplash"; 
//import GrammarScreen from "../../screens/grammar"; 
//import VocabularyFeedbackScreen from "../../screens/VocabularyFeedback"; 
//import SpeakingIntroScreen from "../../screens/speakingScreens/speakingIntro";
//import SpeakingStartScreen from "../../screens/speakingScreens/speakingStart";
//import DeleteAccountScreen from "../../screens/profileScreen/delete";
import ProfileScreen from "../../screens/profile";
import GrammarScreen from "../../screens/grammar"; 





const Stack = createNativeStackNavigator(); 

const screenOptions = {
  headerShown: false,
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={screenOptions}
      initialRouteName="GrammarScreen"
    >
      


      {/* İleride buraya HomePage, Profile, Settings gibi ekranlar eklenecek */}
      <Stack.Screen name="BlankSplash" component={BlankSplash} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="HomeDashboardScreen" component={HomeDashboardScreen} />
      <Stack.Screen name="GrammarScreen" component={GrammarScreen} />






    </Stack.Navigator>
  );
};

export default MainNavigator;
