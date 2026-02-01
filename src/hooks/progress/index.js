// src/hooks/useProgress/index.js
import { useQuery } from '@tanstack/react-query';
import { getProgress } from '../../../api/firebase/progress';
import { useUser } from '../../../contexts/UserContext';

// Backend: { current_day, current_step, days: [...] | { [day_number]: { status, steps } } }
const normalizeProgress = (raw) => {
  if (!raw || typeof raw !== 'object') return { current_day: null, current_step: null, days: {} };

  const cd = Number(raw?.current_day);
  const step = raw?.current_step;
  const current_step =
    step === 'speaking' || step === 'grammar' || step === 'feedback' ? step : null;

  // days: array or object → number’a çevir
  const src = raw?.days ?? [];
  const out = {};
  if (Array.isArray(src)) {
    src.forEach((item) => {
      const day = Number(item?.day_number);
      if (!Number.isFinite(day)) return;
      const v = item?.data || {};
      const steps = v?.steps || {};
      out[day] = {
        status: v?.status ?? 'locked',
        steps: {
          speaking: steps?.speaking?.status ?? steps?.speaking ?? 'locked',
          grammar: steps?.grammar?.status ?? steps?.grammar ?? 'locked',
          feedback: steps?.feedback?.status ?? steps?.feedback ?? 'locked',
        },
      };
    });
  } else {
    Object.keys(src).forEach((k) => {
      const day = Number(k);
      const v = src[k] || {};
      out[day] = {
        status: v?.status ?? 'locked',
        steps: {
          speaking: v?.steps?.speaking ?? 'locked',
          grammar: v?.steps?.grammar ?? 'locked',
          feedback: v?.steps?.feedback ?? 'locked',
        },
      };
    });
  }

  return {
    // İstersen burada null yerine 1 kullan (UI beklentine göre seç)
    current_day: Number.isFinite(cd) && cd > 0 ? cd : null,
    current_step,
    days: out,
  };
};

export default function useProgress() {
  const { user } = useUser();

  return useQuery({
    queryKey: ['progress', user?.uid],
    queryFn: async () => normalizeProgress(await getProgress(user?.uid)),
    enabled: !!user?.uid,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: 1,
  });
}
