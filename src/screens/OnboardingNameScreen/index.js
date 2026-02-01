// src/screens/onboarding/OnboardingNameScreen.js
import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import HeaderSection from '../../component/OnboardingNameScreen/HeaderSection';
import NameInput from '../../component/OnboardingNameScreen/NameInput';
import ContinueButton from '../../component/OnboardingNameScreen/ContinueButton';

import { useUser } from '../../contexts/UserContext';

const OnboardingNameScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { setUsername } = useUser(); // ✅ setUser değil, setUsername

  const handleNameChange = (text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setName(text);
      return;
    }

    const words = trimmed.split(/\s+/);
    if (words.length <= 30) {
      setName(text);
      return;
    }

    setName(words.slice(0, 30).join(' '));
  };

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // 1) Geçici olarak Context'e yaz (UI selamlama vs. için)
    setUsername(trimmed);

    // 2) Bir sonraki ekrana param olarak da taşı (çifte güvence)
    navigation.navigate('OnboardingEnglishLevelScreen', { name: trimmed });
  };

  const isButtonDisabled = !name.trim();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          <HeaderSection />
          <NameInput
            value={name}
            onChangeText={handleNameChange}
            isFocused={isFocused}
            setIsFocused={setIsFocused}
            onSubmit={handleContinue}
          />
          <View style={styles.spacer} />
          <ContinueButton disabled={isButtonDisabled} onPress={handleContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingNameScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  keyboardAvoidingView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 },
  spacer: { flex: 1 },
});
