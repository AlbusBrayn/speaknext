// Auth servisleri: login / refresh / logout
// Notlar:
// - RT (refresh token) SecureStore'da tutulur (AT sadece RAM'de).
// - Axios instance: src/api/bac/index.js (Service) — interceptor orada.
// - Burada sadece endpoint çağrıları ve RT okuma/yazma yapılır.

import Service from '..';
import {
  getRefreshToken,
  setRefreshToken,
  deleteRefreshToken,
  // (opsiyonel) getSessionMeta, setSessionMeta, deleteSessionMeta
} from '../../secure';

// Apple/Google id_token ile giriş
export async function loginWithIdTokenn({ provider, id_token, device_id }) {
  // ör: provider: 'apple' | 'google'
  const res = await Service.post('/google/login', { provider, id_token, device_id });
  const data = res?.data || {};

  // RT rotasyonu olabilir → geldiyse kaydet
  if (data.refresh_token) {
    await setRefreshToken(data.refresh_token);
  }

  // Dönüş: { access_token, refresh_token?, user, session_id? ... }
  return data;
}

export async function loginWithIdToken({ provider, id_token, device_id }) {
  const path = provider === 'apple' ? '/apple/login' : provider === 'google' ? '/google/login' : '/auth/login';
  const res = await Service.post(path, { id_token, device_id });
  const data = res?.data ?? {};
  if (data.refresh_token) await setRefreshToken(data.refresh_token);
  return data;
}

export async function googleLoginWithIdToken({ id_token, device_id }) {
  const res = await Service.post('/google/login', { id_token, device_id });
  const data = res?.data ?? {};
  if (data.refresh_token) await setRefreshToken(data.refresh_token);
  // if (data.session_id) await setSessionMeta({ session_id: data.session_id, device_id, user_id: data.user?.id ?? null, ts: Date.now() });
  return data;
}

export async function appleLoginWithIdToken({ id_token, device_id }) {
  const res = await Service.post('/apple/login', { id_token, device_id });
  const data = res?.data ?? {};
  if (data.refresh_token) await setRefreshToken(data.refresh_token);
  // if (data.session_id) await setSessionMeta({ session_id: data.session_id, device_id, user_id: data.user?.id ?? null, ts: Date.now() });
  return data;
}

// Sessiz yenileme (refresh)
export async function refreshToken() {
  const rt = await getRefreshToken();
  if (!rt) throw new Error('no_refresh_token');

  const res = await Service.post('/auth/refresh', { refresh_token: rt });
  const data = res?.data || {};

  // Yeni RT geldiyse rotasyon: eskisinin yerine yaz
  if (data.refresh_token) {
    await setRefreshToken(data.refresh_token);
  }

  // Dönüş: { access_token, refresh_token? }
  return data;
}

// Sadece bu cihazdan çıkış
export async function logoutThisDevice() {
  try {
    // Sunucu tarafı session revoke (best-effort)
    await Service.post('/auth/logout');
  } catch (_) {
    // ağ hatası vs. — yerelde yine de temizleyeceğiz
  } finally {
    await deleteRefreshToken();
    // (opsiyonel) session meta tutuyorsan onu da sil
    // await deleteSessionMeta();
  }
}

// (Opsiyonel) Aktif oturumları listele
export async function listSessions() {
  const res = await Service.get('/auth/sessions');
  return res?.data || [];
}

// (Opsiyonel) Belirli bir oturumu (cihazı) kapat
export async function revokeSession(sessionId) {
  const res = await Service.post(`/auth/sessions/${sessionId}/revoke`);
  return res?.data || { ok: true };
}

// Hesabı tamamen sil (geri alınamaz)
export async function deleteAccount() {
  try {
    // Aynı base URL üzerinden çağırıyoruz ki mevcut auth interceptor'ları çalışsın
    console.log('[deleteAccount] Sending DELETE /delete/account request');
    const response = await Service.delete('/delete/account');
    console.log('[deleteAccount] DELETE response status:', response?.status);
    console.log('[deleteAccount] DELETE response data:', response?.data);
    return response;
  } catch (error) {
    console.log('[deleteAccount] DELETE error:', error?.response?.status, error?.message);
    // Re-throw so caller can handle it
    throw error;
  } finally {
    // Her durumda yerel oturum bilgisini temizle
    // Note: React Query cache and AsyncStorage will be cleared by UserContext.signOut()
    // which is called after deleteAccount() in ProfileScreen
    await deleteRefreshToken();
    console.log('[deleteAccount] Refresh token deleted from SecureStore');
  }
}
