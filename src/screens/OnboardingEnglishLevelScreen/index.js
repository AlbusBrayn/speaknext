import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import HeaderSection from '../../component/OnboardingEnglishLevelScreen/HeaderSection';
import LevelOption from '../../component/OnboardingEnglishLevelScreen/LevelOption';
import ContinueButton from '../../component/OnboardingEnglishLevelScreen/ContinueButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../contexts/UserContext';
import { setOnboardingData } from '../../api/firebase/users';


const OnboardingEnglishLevelScreen = ({ navigation }) => {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { user } = useUser();

  const levels = [
    { value: 'Beginner', title: 'Beginner', description: "I'm just starting to learn English" },
    { value: 'Intermediate', title: 'Intermediate', description: 'I can have basic conversations' },
    { value: 'Advanced', title: 'Advanced', description: "I'm comfortable speaking fluently" },
  ];

  const handleContinue = async () => {
    if (selectedLevel) {
      console.log('Selected Level:', selectedLevel);
      if (user?.uid) {
        try {
          await setOnboardingData(user.uid, { english_level: selectedLevel });
        } catch {}
      }
      navigation.navigate('OnboardingReferralScreen'); // test amaçlı
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.content}>
        <HeaderSection />
        <View style={styles.optionsSection}>
          {levels.map(level => (
            <LevelOption
              key={level.value}
              level={level}
              isSelected={selectedLevel === level.value}
              onSelect={setSelectedLevel}
            />
          ))}
        </View>
        <ContinueButton disabled={!selectedLevel} onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingEnglishLevelScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  optionsSection: {
    flex: 1,
    justifyContent: 'center',
  },
});
