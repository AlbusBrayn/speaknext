import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { L } from '../utils/logger';

// Axios instance ve helper'ları
import Service, { setAccessToken, bindOnUnauthorized } from '../api/bac';

// Auth servisleri (RT SecureStore’da yönetiliyor)
import {
  loginWithIdToken,
  refreshToken,
  logoutThisDevice,
} from '../api/bac/authservice';

// (opsiyonel) RT var mı diye hızlı kontrol için:
import { getRefreshToken, deleteRefreshToken } from '../api/secure';

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

  const hydrate = async () => {
    L.auth('hydrate() start');
    try {
      const rt = await getRefreshToken(); // yoksa direkt signed-out
      L.rt('RT in SecureStore?', !!rt);
      if (!rt) {
        injectAccessToken(null);
        setUser(null);
        setIsHydrated(true);
        L.auth('hydrate() no RT → signed-out');
        return;
      }

      const data = await refreshToken(); // { access_token, refresh_token?, user? }
      L.rt('/auth/refresh response:', !!data?.access_token, !!data?.refresh_token, data?.user ? 'user✓' : 'user∅');
      if (!data?.access_token) throw new Error('refresh_missing_at');

      injectAccessToken(data.access_token);
      if (data.user) setUser(data.user);
      L.auth('hydrate() OK → AT set, user set?', !!data.user);
    } catch (e) {
      const st = e?.response?.status;
    L.err('hydrate() FAILED', st, e?.message);
      // RT yok/bozuksa temizle ve signed-out duruma düş
      try { await deleteRefreshToken(); } catch {}
      injectAccessToken(null);
      setUser(null);
    } finally {
      setIsHydrated(true);
      L.auth('hydrate() end → isHydrated=true');
    }
  };

  const signInWithIdToken = async ({ provider, idToken, deviceId }) => {
    L.auth('signInWithIdToken()', provider);
    // provider: 'google' | 'apple' vb., idToken: federated ID token
    const data = await loginWithIdToken({
      provider,
      id_token: idToken,
      device_id: deviceId,
    });
    L.auth('/{provider}/login response:', provider, !!data?.access_token, !!data?.refresh_token, data?.user ? 'user✓' : 'user∅');
    if (!data?.access_token) throw new Error('login_missing_at');

    injectAccessToken(data.access_token);
    setUser(data.user || null);
    return data; // login sonrası LoginScreen loglasın
  };

  const signOut = async () => {
    L.auth('signOut()');
    try { await logoutThisDevice(); } catch {}
    injectAccessToken(null);
    setUser(null);
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
    // Axios 401 (invalid/expired ve refresh de başarısız) → global signOut
    bindOnUnauthorized(signOut);
    // App açılışında sessiz hydrate
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      // state
      isHydrated,
      accessToken,
      user,

      // actions
      hydrate,
      signInWithIdToken,
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
