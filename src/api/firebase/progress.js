import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { days as dayDefs } from '../../data/home';

const TOTAL_DAYS = Array.isArray(dayDefs) && dayDefs.length ? dayDefs.length : 50;
const STEP_ORDER = ['speaking', 'grammar', 'feedback'];

const emptyDay = () => ({
  status: 'locked',
  steps: { speaking: 'locked', grammar: 'locked', feedback: 'locked' },
});

const buildInitialProgress = (uid) => ({
  user_id: uid,
  current_day: 1,
  current_step: 'speaking',
  days: {},
  created_at: serverTimestamp(),
  updated_at: serverTimestamp(),
});

const buildSnapshot = (inputDays = {}) => {
  const days = {};
  const hasAny = {};

  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    const key = String(d);
    const src = inputDays?.[key] || inputDays?.[d] || null;
    const base = emptyDay();
    const steps = src?.steps || {};
    STEP_ORDER.forEach((k) => {
      const v = steps?.[k];
      base.steps[k] = v || 'locked';
    });

    days[d] = base;
  }

  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    const ds = days[d];
    let done = 0;
    let any = false;

    STEP_ORDER.forEach((k) => {
      const status = ds.steps[k];
      if (status === 'completed') done += 1;
      if (status !== 'locked') any = true;
    });

    if (done === 3) ds.status = 'completed';
    else if (any || done > 0) ds.status = 'in_progress';
    else ds.status = 'locked';

    hasAny[d] = any || done > 0;
    days[d] = ds;
  }

  let currentDay = 1;
  let currentStep = 'speaking';
  let found = false;

  for (let d = 1; d <= TOTAL_DAYS && !found; d += 1) {
    const ds = days[d];
    if (ds.status !== 'completed') {
      currentDay = d;
      for (let i = 0; i < STEP_ORDER.length; i += 1) {
        const k = STEP_ORDER[i];
        if (ds.steps[k] !== 'completed') {
          currentStep = k;
          found = true;
          break;
        }
      }
    }
  }

  if (!found) {
    currentDay = TOTAL_DAYS;
    currentStep = '';
  }

  if (currentStep) {
    const ds = days[currentDay];
    if (ds?.steps?.[currentStep] !== 'completed') {
      ds.steps[currentStep] = 'in_progress';
    }
    days[currentDay] = ds;
  }

  return { current_day: currentDay, current_step: currentStep, days };
};

export async function getProgress(uid) {
  if (!uid) throw new Error('missing_uid');
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const initial = buildInitialProgress(uid);
    const snapShot = buildSnapshot(initial.days);
    const docValue = { ...initial, ...snapShot };
    await setDoc(ref, docValue);
    return docValue;
  }
  const data = snap.data() || {};
  const snapShot = buildSnapshot(data.days || {});
  const merged = { ...data, ...snapShot };
  return merged;
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
  else if (outcome === 'in_progress') nextStatus = 'in_progress';

  const nextSteps = { ...prevSteps, [step]: nextStatus };

  days[dayKey] = {
    ...(days[dayKey] || {}),
    steps: nextSteps,
  };

  const snapShot = buildSnapshot(days);
  const nextDoc = {
    ...current,
    user_id: uid,
    ...snapShot,
    updated_at: serverTimestamp(),
  };

  if (reason) nextDoc.last_reason = reason;

  await setDoc(ref, nextDoc, { merge: true });
  return nextDoc;
}
