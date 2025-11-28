import { useQuery } from '@tanstack/react-query';
import { getStatus } from '../../api/bac/statusservice';
import { useUser } from '../../contexts/UserContext';
import { L } from '../../utils/logger';

// TODO: REMOVE DEV_FORCE_SUBSCRIPTION_ACTIVE when RevenueCat integration is ready
const DEV_FORCE_SUBSCRIPTION_ACTIVE = true;

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

  // TODO: REMOVE DEV_FORCE_SUBSCRIPTION_ACTIVE when RevenueCat integration is ready
  if (DEV_FORCE_SUBSCRIPTION_ACTIVE) {
    normalized.is_subscription_active = true;
    if (!normalized.plan) {
      normalized.plan = 'dev_mock';
    }
  }

  return normalized;
};

export default function useStatus() {
  const { accessToken } = useUser();

  return useQuery({
    queryKey: ['status'],
        queryFn: async () => {
         const raw = await getStatus();
          L.st('GET /subscription/status raw:', raw);
         const norm = normalizeStatus(raw);
         L.st('normalized:', norm);
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
