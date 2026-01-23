import { useQuery } from '@tanstack/react-query';
import { getStatus } from '../../api/bac/statusservice';
import { useUser } from '../../contexts/UserContext';
import { L } from '../../utils/logger';
import {
  configureRevenueCat,
  fetchRevenueCatEntitlement,
  identifyRevenueCatUser,
} from '../../lib/revenuecat';

const normalizeStatus = (raw) => {
  const normalized = {
    user_id: raw?.user?.id ?? raw?.user_id ?? null,
    user_name: raw?.user?.name ?? raw?.user_name ?? '',
    is_profile_completed: !!(raw?.is_profile_completed ?? raw?.profile_completed),
    is_subscription_active: !!(raw?.is_subscription_active ?? raw?.subscription?.active ?? raw?.is_active),
    is_trial: !!raw?.is_trial,
    days_left: Number.isFinite(raw?.days_left) ? raw.days_left : null,
    plan: raw?.subscription?.plan ?? raw?.plan ?? null,
    expiry: raw?.subscription?.expiry ?? raw?.expiry ?? null,
  };
  return normalized;
};

export default function useStatus() {
  const { accessToken, user } = useUser();

  return useQuery({
    queryKey: ['status'],
        queryFn: async () => {
         configureRevenueCat();
         const raw = await getStatus();
          L.st('GET /subscription/status raw:', raw);
         const norm = normalizeStatus(raw);
         L.st('normalized (backend):', norm);

         // RevenueCat entegrasyonu: kullanıcıyı tanımla ve entitlement durumu ile override et
         const rcUserId = user?.id || norm.user_id;
         await identifyRevenueCatUser(rcUserId);
         const rc = await fetchRevenueCatEntitlement();
         if (rc.isActive !== null) {
           norm.is_subscription_active = rc.isActive;
           if (rc.plan) {
             norm.plan = rc.plan;
           }
           L.st('normalized (with RevenueCat):', norm);
          }
          return norm;
       },   
        enabled: !!accessToken,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
