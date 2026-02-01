import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProgress } from '../../api/firebase/progress';
import { useUser } from '../../contexts/UserContext';

export function useCompleteStep() {
  const qc = useQueryClient();
  const { user } = useUser();
  const key = ['progress', user?.uid];

  return useMutation({
    mutationFn: async ({ day_number, step }) =>
      updateProgress(user?.uid, { day_number, step, outcome: 'completed' }),
    onMutate: async (vars) => {
      await qc.cancelQueries(key);
      const previous = qc.getQueryData(key);

      qc.setQueryData(key, (old) => {
        if (!old) return old;
        const copy = JSON.parse(JSON.stringify(old));
        if (copy?.days?.[vars.day_number]?.steps) {
          copy.days[vars.day_number].steps[vars.step] = 'completed';
          const s = copy.days[vars.day_number].steps;
          copy.days[vars.day_number].status =
            s.speaking === 'completed' && s.grammar === 'completed' && s.feedback === 'completed'
              ? 'completed'
              : 'in_progress';
        }
        return copy;
      });

      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(key);
    },
  });
}

export function useFailStep() {
  const qc = useQueryClient();
  const { user } = useUser();
  const key = ['progress', user?.uid];

  return useMutation({
    mutationFn: async ({ day_number, step, reason }) =>
      updateProgress(user?.uid, { day_number, step, outcome: 'failed', reason }),
    onMutate: async () => {
      await qc.cancelQueries(key);
      return { previous: qc.getQueryData(key) };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(key);
    },
  });
}

export function useStartStep() {
  const qc = useQueryClient();
  const { user } = useUser();
  const key = ['progress', user?.uid];

  return useMutation({
    mutationFn: async ({ day_number, step }) =>
      updateProgress(user?.uid, { day_number, step, outcome: 'started' }),
    onMutate: async (vars) => {
      await qc.cancelQueries(key);
      const previous = qc.getQueryData(key);

      qc.setQueryData(key, (old) => {
        if (!old) return old;
        const copy = JSON.parse(JSON.stringify(old));
        if (copy?.days?.[vars.day_number]?.steps) {
          if (copy.days[vars.day_number].steps[vars.step] === 'locked') {
            copy.days[vars.day_number].steps[vars.step] = 'in_progress';
            copy.days[vars.day_number].status = 'in_progress';
          }
        }
        return copy;
      });

      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(key, ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(key);
    },
  });
}
