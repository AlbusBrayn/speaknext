// Expo SecureStore yardımcıları
// ⚠️ Burada kesinlikle sadece hassas verileri sakla (refresh_token, session meta).
// Access Token'ı asla burada tutma; AT sadece RAM'de (Context state) olacak.

import * as SecureStore from 'expo-secure-store';

const KEYS = {
  REFRESH_TOKEN: 'secure_refresh_token',
  SESSION_META:  'secure_session_meta', // { session_id, device_id, user_id, exp, ... }
};

// ---- Refresh Token ----
export async function getRefreshToken() {
  try {
    return await SecureStore.getItemAsync(KEYS.REFRESH_TOKEN);
  } catch (e) {
    console.log('SecureStore getRefreshToken error:', e?.message || e);
    return null;
  }
}

export async function setRefreshToken(token) {
  try {
    if (!token) return;
    await SecureStore.setItemAsync(KEYS.REFRESH_TOKEN, token);
  } catch (e) {
    console.log('SecureStore setRefreshToken error:', e?.message || e);
  }
}

export async function deleteRefreshToken() {
  try {
    await SecureStore.deleteItemAsync(KEYS.REFRESH_TOKEN);
  } catch (e) {
    console.log('SecureStore deleteRefreshToken error:', e?.message || e);
  }
}

// ---- Session Meta (opsiyonel) ----
export async function getSessionMeta() {
  try {
    const raw = await SecureStore.getItemAsync(KEYS.SESSION_META);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log('SecureStore getSessionMeta error:', e?.message || e);
    return null;
  }
}

export async function setSessionMeta(meta) {
  try {
    await SecureStore.setItemAsync(KEYS.SESSION_META, JSON.stringify(meta || {}));
  } catch (e) {
    console.log('SecureStore setSessionMeta error:', e?.message || e);
  }
}

export async function deleteSessionMeta() {
  try {
    await SecureStore.deleteItemAsync(KEYS.SESSION_META);
  } catch (e) {
    console.log('SecureStore deleteSessionMeta error:', e?.message || e);
  }
}
