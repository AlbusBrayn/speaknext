import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { L } from '../utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleAuthProvider,
  OAuthProvider,
  onIdTokenChanged,
  signInWithCredential,
  signOut as firebaseSignOut,
  updateProfile,
  deleteUser,
} from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';

import { auth, db } from '../lib/firebase';
import { setAccessToken } from '../api/bac';
import { queryClient } from '../../App';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [accessToken, setAT] = useState(null);
  const [user, setUser] = useState(null);

  const injectAccessToken = (token) => {
    setAT(token || null);
    setAccessToken(token || null);
  };

  const mapUser = (firebaseUser) => {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || '',
      photoURL: firebaseUser.photoURL || null,
    };
  };

  // Helper to clear all cached data (React Query + AsyncStorage)
  const clearAllCachedData = async () => {
    L.auth('clearAllCachedData() - clearing all caches');

    try {
      queryClient.clear();
      L.auth('clearAllCachedData() - React Query cache cleared');
    } catch (e) {
      L.err('clearAllCachedData() - error clearing React Query cache:', e?.message);
    }

    try {
      await AsyncStorage.removeItem('progress_cache_v1');
      L.auth('clearAllCachedData() - AsyncStorage progress cache cleared');
    } catch (e) {
      L.err('clearAllCachedData() - error clearing AsyncStorage:', e?.message);
    }
  };

  const signInWithIdToken = async ({ provider, idToken, rawNonce, fullName }) => {
    L.auth('signInWithIdToken()', provider);

    let credential;
    if (provider === 'google') {
      credential = GoogleAuthProvider.credential(idToken);
    } else if (provider === 'apple') {
      const appleProvider = new OAuthProvider('apple.com');
      credential = appleProvider.credential({ idToken, rawNonce });
    } else {
      throw new Error('unsupported_provider');
    }

    const result = await signInWithCredential(auth, credential);

    if (provider === 'apple' && fullName && auth.currentUser?.displayName !== fullName) {
      try {
        await updateProfile(auth.currentUser, { displayName: fullName });
      } catch (e) {
        L.err('updateProfile failed:', e?.message);
      }
    }

    const firebaseUser = result?.user || auth.currentUser;
    setUser(mapUser(firebaseUser));
    return result;
  };

  const signOut = async () => {
    L.auth('signOut() - starting logout process');

    try {
      await firebaseSignOut(auth);
      L.auth('signOut() - firebase signOut successful');
    } catch (e) {
      L.err('signOut() - firebase signOut error (continuing with local cleanup):', e?.message);
    }

    await clearAllCachedData();

    injectAccessToken(null);
    setUser(null);

    L.auth('signOut() - complete, user signed out');
  };

  const deleteAccount = async () => {
    const current = auth.currentUser;
    if (!current) throw new Error('no_current_user');

    try {
      await deleteDoc(doc(db, 'users', current.uid));
    } catch (e) {
      L.err('deleteAccount() - error deleting Firestore user doc:', e?.message);
    }

    await deleteUser(current);
    await clearAllCachedData();

    injectAccessToken(null);
    setUser(null);
  };

  const setUsername = (name) => {
    setUser((prev) => {
      const u = prev || {};
      return { ...u, name };
    });
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          injectAccessToken(token);
        } catch (e) {
          L.err('onIdTokenChanged getIdToken error:', e?.message);
          injectAccessToken(null);
        }
        setUser(mapUser(firebaseUser));
      } else {
        injectAccessToken(null);
        setUser(null);
      }

      setIsHydrated(true);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      isHydrated,
      accessToken,
      user,
      signInWithIdToken,
      signOut,
      deleteAccount,
      setUsername,
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
