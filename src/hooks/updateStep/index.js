import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProgress } from '../../../api/bac/statusservice';

export function useCompleteStep() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ dayId, step }) =>
      updateProgress({ day_id: dayId, step, outcome: 'completed' }),
    onMutate: async (vars) => {
      await qc.cancelQueries(['progress']);
      const previous = qc.getQueryData(['progress']);

      qc.setQueryData(['progress'], (old) => {
        if (!old) return old;
        const copy = JSON.parse(JSON.stringify(old));
        if (copy?.days?.[vars.dayId]?.steps) {
          copy.days[vars.dayId].steps[vars.step] = 'completed';
          const s = copy.days[vars.dayId].steps;
          copy.days[vars.dayId].status =
            s.speaking === 'completed' && s.grammar === 'completed' && s.feedback === 'completed'
              ? 'completed'
              : 'in_progress';
        }
        return copy;
      });

      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['progress'], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(['progress']);
    },
  });
}

export function useFailStep() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ dayId, step, reason }) =>
      updateProgress({ day_id: dayId, step, outcome: 'failed', reason }),
    onMutate: async () => {
      await qc.cancelQueries(['progress']);
      return { previous: qc.getQueryData(['progress']) };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['progress'], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(['progress']);
    },
  });
}

export function useStartStep() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ dayId, step }) =>
      updateProgress({ day_id: dayId, step, outcome: 'started' }),
    onMutate: async (vars) => {
      await qc.cancelQueries(['progress']);
      const previous = qc.getQueryData(['progress']);

      qc.setQueryData(['progress'], (old) => {
        if (!old) return old;
        const copy = JSON.parse(JSON.stringify(old));
        if (copy?.days?.[vars.dayId]?.steps) {
          if (copy.days[vars.dayId].steps[vars.step] === 'locked') {
            copy.days[vars.dayId].steps[vars.step] = 'in_progress';
            copy.days[vars.dayId].status = 'in_progress';
          }
        }
        return copy;
      });

      return { previous };
    },
    onError: (_e, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['progress'], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(['progress']);
    },
  });
}
