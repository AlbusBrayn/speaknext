// AsyncStorage yardımcıları
// ⚠️ Burada hassas veri tutma (özellikle refresh/access token TUTMA).
// Sadece tema, dil, “first-run”, yerel ayar flag’leri vb. için kullan.

import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveLocal(key, value) {
  try {
    const json = JSON.stringify(value);
    await AsyncStorage.setItem(key, json);
  } catch (e) {
    console.log('local.save error:', e?.message || e);
  }
}

export async function getLocal(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.log('local.get error:', e?.message || e);
    return null;
  }
}

export async function removeLocal(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log('local.remove error:', e?.message || e);
  }
}
