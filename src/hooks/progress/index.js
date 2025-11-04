// src/hooks/useProgress/index.js
import { useQuery } from '@tanstack/react-query';
import { getProgress } from '../../../api/bac/statusservice';
import { useUser } from '../../../contexts/UserContext';

// Backend: { current_day, current_step, days: { [day_number]: { status, steps } } }
const normalizeProgress = (raw) => {
  if (!raw || typeof raw !== 'object') return { current_day: null, current_step: null, days: {} };

  const cd = Number(raw?.current_day);
  const cs = Number(raw?.current_step);

  // days: key = day_number (string/number) → number’a çevir
  const src = raw?.days ?? {};
  const out = {};
  Object.keys(src).forEach((k) => {
    const day = Number(k);
    const v = src[k] || {};
    out[day] = {
      status: v?.status ?? 'locked',
      steps: {
        speaking: v?.steps?.speaking ?? 'locked',
        grammar:  v?.steps?.grammar  ?? 'locked',
        feedback: v?.steps?.feedback ?? 'locked',
      },
    };
  });

  return {
    // İstersen burada null yerine 1 kullan (UI beklentine göre seç)
    current_day: Number.isFinite(cd) && cd > 0 ? cd : null,
    current_step: Number.isFinite(cs) && cs > 0 ? cs : null,
    days: out,
  };
};

export default function useProgress() {
  const { accessToken } = useUser();

  return useQuery({
    queryKey: ['progress'],
    queryFn: async () => normalizeProgress(await getProgress()),
    enabled: !!accessToken,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  });
}
