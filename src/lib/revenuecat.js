import Purchases from 'react-native-purchases';
import { L } from '../utils/logger';

const REVENUECAT_API_KEY = 'appl_QsutwebiWQlxORrsZkojHImbSin';
export const REVENUECAT_ENTITLEMENT_ID = 'CampusNext Pro';

let isConfigured = false;
let lastUserId = null;

export const configureRevenueCat = () => {
  if (isConfigured) return;
  try {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
    isConfigured = true;
    L.st('RevenueCat configured');
  } catch (e) {
    L.err('RevenueCat configure failed', e?.message);
  }
};

export const identifyRevenueCatUser = async (userId) => {
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
