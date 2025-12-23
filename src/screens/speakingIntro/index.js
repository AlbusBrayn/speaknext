import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { colors, spacing } from '../../utils/Theme';

import SpeakingHeader from '../../component/speakingScreen/Header';
import SpeakingProgress from '../../component/speakingScreen/Progress';
import SpeakingVideo from '../../component/speakingScreen/Video';
import SpeakingInfoRow from '../../component/speakingScreen/InfoRow';
import InstructionsPanel from '../../component/speakingScreen/InstructionsPanel';

// API
import Service from '../../api/bac';
import { useUser } from '../../contexts/UserContext';

// Video asset
const VIDEO_SOURCE = require('../../../assets/vid.mp4');

// Fallback image
const FALLBACK_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=400&h=400&fit=crop&crop=face'
};

const SpeakingIntroScreen = ({ navigation, route }) => {
  const { accessToken } = useUser();
  const [sessionInit, setSessionInit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get day_number from route params (passed from homePage)
  const dayNumber = route?.params?.dayNumber || route?.params?.dayId || 1;
  const resume = route?.params?.resume === true;

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      if (!accessToken) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await Service.post('/speaking/session/init', {
          day_number: dayNumber,
        });
        
        if (response?.data) {
          setSessionInit(response.data);
        }
      } catch (error) {
        console.error('Failed to initialize speaking session:', error);
        Alert.alert(
          'Error',
          'Failed to initialize speaking session. Please try again.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    initSession();
  }, [accessToken, dayNumber]);

  const handleNavigateNext = () => {
    // Pass sessionInit response to SpeakingStart
    navigation.navigate('SpeakingStartScreen', { 
      sessionInit,
      dayNumber,
      resume,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SpeakingHeader title={`Speaking Day ${dayNumber}`} />
        {/* <SpeakingProgress /> */}
        <SpeakingVideo
          videoSource={VIDEO_SOURCE}
          imageSource={FALLBACK_IMAGE}
          onPress={handleNavigateNext}
        />
        <SpeakingInfoRow onPass={handleNavigateNext} />
        <InstructionsPanel onPress={handleNavigateNext} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxxl },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default SpeakingIntroScreen;
