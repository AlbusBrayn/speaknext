import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import { L } from '../../utils/logger';
import { db } from '../../lib/firebase';

const normalizeStatus = (raw, authUser) => {
  const normalized = {
    user_id: raw?.user_id ?? authUser?.uid ?? null,
    user_name: raw?.user_name ?? raw?.name ?? authUser?.name ?? authUser?.displayName ?? '',
    is_profile_completed: !!(raw?.is_profile_completed ?? raw?.profile_completed),
    is_subscription_active:
      raw?.is_subscription_active ?? raw?.subscription_active ?? true,
    is_trial: !!raw?.is_trial,
    days_left: Number.isFinite(raw?.days_left) ? raw.days_left : null,
    plan: raw?.plan ?? null,
    expiry: raw?.expiry ?? null,
  };
  return normalized;
};

const buildInitialDoc = (authUser) => ({
  user_id: authUser?.uid ?? null,
  user_name: authUser?.name ?? authUser?.displayName ?? '',
  is_profile_completed: false,
  is_subscription_active: true,
  created_at: serverTimestamp(),
  updated_at: serverTimestamp(),
});

export default function useStatus() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['status', user?.uid],
    queryFn: async () => {
      if (!user?.uid) return normalizeStatus({}, user);

      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        const initial = buildInitialDoc(user);
        await setDoc(ref, initial);
        L.st('created user doc:', initial);
        return normalizeStatus(initial, user);
      }

      const data = snap.data() || {};
      L.st('GET /users/{uid} raw:', data);
      return normalizeStatus(data, user);
    },
    enabled: !!user?.uid,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 1,
  });
}
