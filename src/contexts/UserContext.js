import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  OAuthProvider,
  onIdTokenChanged,
  signInWithCredential,
  signOut as fbSignOut,
  linkWithCredential,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { L } from '../utils/logger';
import { auth } from '../lib/firebase';
import { setAccessToken } from '../api/bac';
import { queryClient } from '../lib/queryClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [accessToken, setAT] = useState(null);
  const [user, setUser] = useState(null);

  // --- Internal helpers ---
  const injectAccessToken = (token) => {
    setAT(token || null);
    setAccessToken(token || null); // axios header için module-level setter
  };

  const mapUser = (fbUser) => {
    if (!fbUser) return null;
    return {
      id: fbUser.uid,
      name: fbUser.displayName || '',
      email: fbUser.email || '',
      photoURL: fbUser.photoURL || '',
    };
  };

  const signInWithIdToken = async ({ provider, idToken, deviceId: _deviceId }) => {
    L.auth('signInWithIdToken()', provider);
    if (!idToken) throw new Error('missing_id_token');

    let credential;
    if (provider === 'google') {
      credential = GoogleAuthProvider.credential(idToken);
    } else if (provider === 'apple') {
      const appleProvider = new OAuthProvider('apple.com');
      credential = appleProvider.credential({ idToken });
    } else {
      throw new Error('unsupported_provider');
    }

    let userCredential;
    if (auth.currentUser) {
      userCredential = await linkWithCredential(auth.currentUser, credential);
    } else {
      userCredential = await signInWithCredential(auth, credential);
    }

    const token = await userCredential.user.getIdToken();
    injectAccessToken(token);
    setUser(mapUser(userCredential.user));
    return { user: mapUser(userCredential.user) };
  };

  const reauthenticateWithIdToken = async ({ provider, idToken }) => {
    if (!auth.currentUser) throw new Error('no_current_user');
    if (!idToken) throw new Error('missing_id_token');

    let credential;
    if (provider === 'google') {
      credential = GoogleAuthProvider.credential(idToken);
    } else if (provider === 'apple') {
      const appleProvider = new OAuthProvider('apple.com');
      credential = appleProvider.credential({ idToken });
    } else {
      throw new Error('unsupported_provider');
    }

    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  // Helper to clear all cached data (React Query, AsyncStorage, session meta)
  const clearAllCachedData = async () => {
    L.auth('clearAllCachedData() - clearing all caches');
    
    try {
      // Clear React Query cache (progress, status, etc.)
      queryClient.clear();
      L.auth('clearAllCachedData() - React Query cache cleared');
    } catch (e) {
      L.err('clearAllCachedData() - error clearing React Query cache:', e?.message);
    }

    try {
      // Clear AsyncStorage progress cache (used by homePage)
      await AsyncStorage.removeItem('progress_cache_v1');
      L.auth('clearAllCachedData() - AsyncStorage progress cache cleared');
    } catch (e) {
      L.err('clearAllCachedData() - error clearing AsyncStorage:', e?.message);
    }

    try {
      // Clear session meta if it exists
      await AsyncStorage.removeItem('session_meta_v1');
      L.auth('clearAllCachedData() - session meta cleared');
    } catch (e) {
      L.err('clearAllCachedData() - error clearing session meta:', e?.message);
    }
  };

  const signOut = async () => {
    L.auth('signOut() - starting logout process');
    
    try {
      await fbSignOut(auth);
    } catch (e) {
      L.err('signOut() - firebase signOut error:', e?.message);
    }
    
    // Clear all cached data (React Query, AsyncStorage, session meta)
    await clearAllCachedData();
    
    // Clear in-memory auth state
    injectAccessToken(null);
    setUser(null);
    
    L.auth('signOut() - complete, user signed out');
  };

  // Opsiyonel: sadece isme hızlı yama yapmak istersen (status query’si gelene kadar)
  const setUsername = (name) => {
    setUser((prev) => {
      const u = prev || {};
      return { ...u, name };
    });
  };

  // --- Effects ---
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (fbUser) => {
      if (fbUser) {
        const token = await fbUser.getIdToken();
        injectAccessToken(token);
        setUser(mapUser(fbUser));
      } else {
        injectAccessToken(null);
        setUser(null);
      }
      setIsHydrated(true);
    });

    return () => unsub();
  }, []);

  const value = useMemo(
    () => ({
      // state
      isHydrated,
      accessToken,
      user,

      // actions
      signInWithIdToken,
      reauthenticateWithIdToken,
      signOut,
      setUsername, // opsiyonel
    }),
    [isHydrated, accessToken, user]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
