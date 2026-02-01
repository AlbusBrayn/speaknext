// src/screens/auth/LoginScreen.js

// ios  187561567349-aujg06hhknipj3abe1elucv7qmf0laur.apps.googleusercontent.com
// web  187561567349-t9qskelmsq4bv3r95c48gjtgqdplkcri.apps.googleusercontent.com

import React, { useState, useEffect, useMemo } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';

// UI
import Logo from '../../component/registerScreen/logo';
import Title from '../../component/registerScreen/Title';
import GoogleButton from '../../component/registerScreen/GoogleButton';
import AppleButton from '../../component/registerScreen/AppleButton';
import TermsText from '../../component/registerScreen/TermsText';
import { L } from '../../utils/logger';


// Yeni mimari: Auth işlemleri UserContext üzerinden
import { useUser } from '../../contexts/UserContext';

WebBrowser.maybeCompleteAuthSession(); // web redirect cleanup

const LoginScreen = () => {
  const navigation = useNavigation();
  const qc = useQueryClient();
  const { signInWithIdToken } = useUser();
  const [authError, setAuthError] = useState('');

  // 🔑 Google Auth Request
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId:
      '493457191588-p0jndkogseg8co2boiubh7vn7f1jmcb2.apps.googleusercontent.com',
    webClientId:
      '493457191588-j6bb6s59bopc7eelci9ibj40bteu8b3f.apps.googleusercontent.com',
    scopes: ['openid', 'email', 'profile'],
  });

  // --- Mutations ---

  // Google → Context üzerinden sign-in (RT SecureStore, AT RAM)
  const googleLoginMutation = useMutation({
    mutationFn: async (idToken) => {
      await signInWithIdToken({ provider: 'google', idToken });
    },
    onSuccess: async () => {
      setAuthError('');
      // Giriş tamam → status/progress tazele
      await qc.invalidateQueries({ queryKey: ['status'] });
      await qc.invalidateQueries({ queryKey: ['progress'] });

      // Onboarding name ekranına geç (profil tamam değilse oradan devam)
    },
    onError: (error) => {
      const msg =
        error?.code === 'auth/invalid-credential'
          ? 'Google girişi başarısız. Lütfen tekrar deneyin.'
          : 'Google girişi başarısız oldu.';
      setAuthError(msg);
      console.log('Google login failed:', error?.response?.data || error?.message);
    },
  });

  // Apple → Context üzerinden sign-in
  const appleLoginMutation = useMutation({
    mutationFn: async (idToken) => {
          const data = await signInWithIdToken({ provider: 'apple', idToken });
          return data;    },
          onSuccess: async (data) => {
          setAuthError('');
          L.auth('[Apple] /apple/login response:', data);   
           await qc.invalidateQueries({ queryKey: ['status'] });
      await qc.invalidateQueries({ queryKey: ['progress'] });
      const latestStatus = await qc.fetchQuery({ queryKey: ['status'] });
    L.st('[Apple] latest status:', latestStatus);
    },
    onError: (error) => {
      const msg =
        error?.code === 'auth/invalid-credential'
          ? 'Apple girişi başarısız. Lütfen tekrar deneyin.'
          : 'Apple girişi başarısız oldu.';
      setAuthError(msg);
      console.log('Apple login failed:', error?.response?.data || error?.message);
    },
  });

  // Google yanıtını tek yerde işle
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response?.authentication?.idToken;
      if (idToken) {
        googleLoginMutation.mutate(idToken);
      } else {
        console.log('Google → idToken boş döndü');
      }
    }
  }, [response]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Handlers ---

  const handleGoogleSignIn = async () => {
    try {
      if (!request) return;
      await promptAsync(); // Google Sign-In ekranını açar
    } catch (e) {
      console.log('Google prompt error:', e?.message || e);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const idToken = credential?.identityToken;
      if (idToken) {
        appleLoginMutation.mutate(idToken);
      } else {
        console.log('Apple → identityToken boş geldi');
      }
    } catch (e) {
      if (e?.code === 'ERR_CANCELED') {
        console.log('Apple login canceled');
      } else {
        console.log('Apple login error:', e);
      }
    }
  };

  // UI kilidi: herhangi bir login devam ediyorsa loading
  const isLoading = useMemo(
    () => googleLoginMutation.isLoading || appleLoginMutation.isLoading,
    [googleLoginMutation.isLoading, appleLoginMutation.isLoading]
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={styles.content}>
          {/* Top Section */}
          <View style={styles.topSection}>
            <Logo />
            <Title />
          </View>

          {/* Middle Section */}
          <View style={styles.middleSection}>
            <GoogleButton onPress={handleGoogleSignIn} isLoading={isLoading || !request} />
            <AppleButton onPress={handleAppleSignIn} isLoading={isLoading} />
            {!!authError && <Text style={styles.errorText}>{authError}</Text>}
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TermsText />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  keyboardAvoidingView: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingVertical: 32 },
  topSection: { flex: 2, alignItems: 'center', justifyContent: 'center' },
  middleSection: { flex: 1, justifyContent: 'center' },
  bottomSection: { flex: 0.5, justifyContent: 'flex-end', alignItems: 'center' },
  errorText: { marginTop: 12, color: '#FF6B6B', textAlign: 'center' },
});
