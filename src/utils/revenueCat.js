// src/utils/revenuecat.js
import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

const IOS_API_KEY = process.env.EXPO_PUBLIC_RC_IOS;

export function initRevenueCat() {
  Purchases.configure({
    apiKey: Platform.select({
      ios: IOS_API_KEY,     // RevenueCat dashboard’daki iOS API Key
      android: 'goog_XXXX_ANDROID_KEY',      // Şimdilik kullanmıyorsan dursun
    }),
  });
}

// Sadece offerings çekmek için basit helper
export async function fetchOfferings() {
  const offerings = await Purchases.getOfferings();
  return offerings;
}
