import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const buildInitialProgress = (uid) => ({
  user_id: uid,
  current_day: 1,
  current_step: 'speaking',
  days: {
    1: {
      status: 'in_progress',
      steps: { speaking: 'in_progress', grammar: 'locked', feedback: 'locked' },
    },
  },
  created_at: serverTimestamp(),
  updated_at: serverTimestamp(),
});

export async function getProgress(uid) {
  if (!uid) throw new Error('missing_uid');
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const initial = buildInitialProgress(uid);
    await setDoc(ref, initial);
    return initial;
  }
  return snap.data() || {};
}

export async function updateProgress(uid, { day_number, step, outcome, reason }) {
  if (!uid) throw new Error('missing_uid');
  if (!day_number || !step) throw new Error('missing_day_or_step');

  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  const current = snap.exists() ? snap.data() || {} : buildInitialProgress(uid);

  const dayKey = String(day_number);
  const days = { ...(current.days || {}) };
  const prevDay = days[dayKey] || {
    status: 'locked',
    steps: { speaking: 'locked', grammar: 'locked', feedback: 'locked' },
  };
  const prevSteps = prevDay.steps || {
    speaking: 'locked',
    grammar: 'locked',
    feedback: 'locked',
  };

  let nextStatus = prevSteps[step] || 'locked';
  if (outcome === 'completed') nextStatus = 'completed';
  else if (outcome === 'failed') nextStatus = 'failed';
  else if (outcome === 'started') nextStatus = 'in_progress';
  else if (outcome === 'in_progress') nextStatus = 'in_progress';

  const nextSteps = { ...prevSteps, [step]: nextStatus };

  const allCompleted =
    nextSteps.speaking === 'completed' &&
    nextSteps.grammar === 'completed' &&
    nextSteps.feedback === 'completed';

  const anyActive =
    nextSteps.speaking === 'in_progress' ||
    nextSteps.grammar === 'in_progress' ||
    nextSteps.feedback === 'in_progress' ||
    nextSteps.speaking === 'completed' ||
    nextSteps.grammar === 'completed' ||
    nextSteps.feedback === 'completed';

  const nextDayStatus = allCompleted ? 'completed' : anyActive ? 'in_progress' : 'locked';

  days[dayKey] = {
    status: nextDayStatus,
    steps: nextSteps,
  };

  const nextDoc = {
    ...current,
    user_id: uid,
    current_day: day_number,
    current_step: step,
    days,
    updated_at: serverTimestamp(),
  };

  if (reason) nextDoc.last_reason = reason;

  await setDoc(ref, nextDoc, { merge: true });
  return nextDoc;
}
