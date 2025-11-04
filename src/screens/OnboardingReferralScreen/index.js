// src/screens/onboarding/OnboardingReferralScreen.js
import React, { useMemo, useState } from 'react';
import { StatusBar, StyleSheet, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import ReferralHeader from '../../component/OnboardingReferralScreen/ReferralHeader';
import ReferralOption from '../../component/OnboardingReferralScreen/ReferralOption';
import ContinueButton from '../../component/OnboardingReferralScreen/ContinueButton';
import { L } from '../../utils/logger';


import { useUser } from '../../contexts/UserContext';
import Service from '../../api/bac'; // axios instance

const referralOptions = [
  { value: 'youtube',        title: 'YouTube',        icon: '📺' },
  { value: 'instagram_ads',  title: 'Instagram Ads',  icon: '📱' },
  { value: 'friend',         title: 'Friends',        icon: '👥' },
  { value: 'app_store',      title: 'App Store',      icon: '📱' },
  { value: 'tiktok',         title: 'TikTok',         icon: '🎵' },
];

const OnboardingReferralScreen = () => {
  const route = useRoute();
  const qc = useQueryClient();

  const [selectedReferral, setSelectedReferral] = useState(null);

  // Ad'ı önce route param’dan, yoksa Context’ten çek
  const { user, setUsername } = useUser();
  const paramName = route?.params?.name;
  const finalName = useMemo(
    () => (paramName?.trim?.() || user?.name?.trim?.() || 'Guest'),
    [paramName, user?.name]
  );

  // /profile isteği YALNIZCA burada atılır
  const completeProfileMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: finalName,               // ✅ Name burada kullanılıyor
        age: '18_24',                  // TODO: ileride adım 2'den al
        referral_source: selectedReferral, // canonical
        exam_type: 'ielts',
        level: 'intermediate',         // TODO: ileride adım 2'den al
      };
          L.ob('POST /profile payload:', payload);
          return Service.post('/profile', payload);
        },
    onSuccess: async (res) => {
          L.ob('POST /profile response:', res?.data);

      const serverName = res?.data?.name;

      // 1) Context'teki geçici adı backend'in normalize ettiği isimle güncelle
      if (serverName) setUsername(serverName);

      // 2) Status cache → optimistic güncelle
      qc.setQueryData(['status'], (old) => ({
        ...(old || {}),
        is_profile_completed: true,
        user_name: serverName ?? old?.user_name ?? finalName,
      }));

      // 3) Kesin senkron için invalidate (RootNavigator yönlendirecek)
          await qc.invalidateQueries({ queryKey: ['status'] });
          const latestStatus = await qc.fetchQuery({ queryKey: ['status'] });
          L.st('[after /profile] latest status:', latestStatus);
          if (!latestStatus?.is_profile_completed) {
           L.st('[WARN] backend still says is_profile_completed=false');
         }
        },
    onError: (err) => {
      console.log('Profile completion failed:', err?.response?.data || err?.message);
      Alert.alert('Hata', 'Bir sorun oluştu. Lütfen tekrar deneyin.');
    },
  });

  const handleContinue = () => {
    if (!selectedReferral || completeProfileMutation.isLoading) return;
    completeProfileMutation.mutate();
  };

  const isButtonDisabled = !selectedReferral || completeProfileMutation.isLoading;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.content}>
        <ReferralHeader />

        <View style={styles.optionsSection}>
          {referralOptions.map((option) => (
            <ReferralOption
              key={option.value}
              option={option}
              isSelected={selectedReferral === option.value}
              onSelect={setSelectedReferral}
            />
          ))}
        </View>

        <View style={styles.spacer} />

        <ContinueButton disabled={isButtonDisabled} onPress={handleContinue} />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingReferralScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 64, paddingBottom: 32 },
  optionsSection: { marginBottom: 24 },
  spacer: { flex: 1 },
});
