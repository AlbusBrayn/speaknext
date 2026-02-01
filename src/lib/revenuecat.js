import Purchases from 'react-native-purchases';
import { L } from '../utils/logger';

const REVENUECAT_API_KEY = 'appl_QsutwebiWQlxORrsZkojHImbSin';
export const REVENUECAT_ENTITLEMENT_ID = 'CampusNext Pro';
export const REVENUECAT_ENABLED = false;

let isConfigured = false;
let lastUserId = null;

export const configureRevenueCat = (userId) => {
  if (!REVENUECAT_ENABLED) return;
  if (isConfigured) return;
  try {
    const appUserID = userId ? String(userId) : undefined;
    Purchases.configure({ apiKey: REVENUECAT_API_KEY, appUserID });
    isConfigured = true;
    L.st('RevenueCat configured');
  } catch (e) {
    L.err('RevenueCat configure failed', e?.message);
  }
};

export const identifyRevenueCatUser = async (userId) => {
  if (!REVENUECAT_ENABLED) return;
  if (!isConfigured) return;
  if (!userId) return;
  const id = String(userId);
  if (lastUserId === id) return;
  try {
    const result = await Purchases.logIn(id);
    lastUserId = id;
    L.st('RevenueCat logIn', id, 'created?', result?.created);
  } catch (e) {
    L.err('RevenueCat logIn failed', e?.message);
  }
};

export const fetchRevenueCatEntitlement = async () => {
  if (!REVENUECAT_ENABLED) return { isActive: null, plan: null, customerInfo: null };
  if (!isConfigured) return { isActive: null, plan: null, customerInfo: null };
  try {
    const info = await Purchases.getCustomerInfo();
    const entitlement = info?.entitlements?.active?.[REVENUECAT_ENTITLEMENT_ID];
    const plan = entitlement?.productIdentifier || null;
    const isActive = !!entitlement;
    return { isActive, plan, customerInfo: info };
  } catch (e) {
    L.err('RevenueCat getCustomerInfo failed', e?.message);
    return { isActive: null, plan: null, customerInfo: null };
  }
};

export const restoreRevenueCatPurchases = async () => {
  if (!REVENUECAT_ENABLED) return null;
  if (!isConfigured) return null;
  try {
    return await Purchases.restorePurchases();
  } catch (e) {
    L.err('RevenueCat restorePurchases failed', e?.message);
    return null;
  }
};
