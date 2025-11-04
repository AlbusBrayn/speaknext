import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens (örnek: şimdilik SpeakingResults, ileride HomePage eklenecek)
import HomeDashboardScreen from "../../screens/homePage";
import BlankSplash from "../../screens/BlankSplash"; 
import GrammarScreen from "../../screens/grammar"; 
import VocabularyFeedbackScreen from "../../screens/VocabularyFeedback"; 
import SpeakingIntroScreen from "../../screens/speakingScreens/speakingIntro";
import SpeakingStartScreen from "../../screens/speakingScreens/speakingStart";
import DeleteAccountScreen from "../../screens/profileScreen/delete";
import ProfileScreen from "../../screens/profileScreen";




const Stack = createNativeStackNavigator(); 

const screenOptions = {
  headerShown: false,
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
    screenOptions={{ headerShown: false }}
    initialRouteName="HomeDashboardScreen"
  >
      <Stack.Screen
        name="HomeDashboardScreen"
        component={HomeDashboardScreen}
      />


      {/* İleride buraya HomePage, Profile, Settings gibi ekranlar eklenecek */}
      <Stack.Screen name="BlankSplash" component={BlankSplash} />
      <Stack.Screen name="SpeakingIntroScreen" component={SpeakingIntroScreen} />
      <Stack.Screen name="SpeakingStartScreen" component={SpeakingStartScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="DeleteAccountScreen" component={DeleteAccountScreen} />


      <Stack.Screen name="GrammarScreen" component={GrammarScreen} />
      <Stack.Screen name="VocabularyFeedbackScreen" component={VocabularyFeedbackScreen}  options={{
    headerShown: false, // 🔥 navigation header artık çıkmaz
  }} />


    </Stack.Navigator>
  );
};

export default MainNavigator;
