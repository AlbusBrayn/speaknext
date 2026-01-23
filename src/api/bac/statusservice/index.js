// Status & Progress servisleri
// Not: React Query kullanıyorsan hook'lar bu fonksiyonları çağıracak.
// Hook kullanmıyorsan ekranlardan doğrudan bu fonksiyonları çağırabilirsin.

import Service from '..';
import { L } from '../../../utils/logger';


// Kullanıcı durumları (profil, abonelik vb.)
export async function getStatus() {
  const res = await Service.get('/subscription/revenuecat/status');
  return res?.data;
}

// Program ilerlemesi (gün/step)
export async function getProgress() {
  L.api('→ GET /progress');

  const res = await Service.get('/progress');
  L.api('← 200 /progress', JSON.stringify(res?.data ?? {}));

  return res?.data;
}

// Bir adımın durumunu güncelle (started/completed/failed gibi)
export async function updateProgress({ day_number, step, outcome, reason }) {
  // outcome: 'started' | 'completed' | 'failed' (senin backend'in nasıl istiyorsa)
  const payload = { day_number, step, outcome };
  if (reason) payload.reason = reason;

  console.log('[updateProgress] Final payload:', JSON.stringify(payload));
  L.api('→ POST /progress/update', JSON.stringify(payload));
  const res = await Service.post('/progress/update', payload);
  L.api('← 200 /progress/update', JSON.stringify(res?.data ?? {}));
  
  return res?.data;
}
