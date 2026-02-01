// Status & Progress servisleri
// Not: React Query kullanıyorsan hook'lar bu fonksiyonları çağıracak.
// Hook kullanmıyorsan ekranlardan doğrudan bu fonksiyonları çağırabilirsin.

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  listAll,
  ref as storageRef,
} from 'firebase/storage';
import { auth, db, storage } from '../../../lib/firebase';
import { days } from '../../../data/home';


// Kullanıcı durumları (profil, abonelik vb.)
export async function getStatus() {
  const uid = getUidOrThrow();
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const base = {
      name: auth.currentUser?.displayName || '',
      email: auth.currentUser?.email || '',
      is_profile_completed: false,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    };
    await setDoc(ref, base);
    return {
      user: { id: uid, name: base.name, email: base.email },
      is_profile_completed: false,
      is_subscription_active: false,
      is_trial: false,
      days_left: null,
      subscription: { active: false, plan: null, expiry: null },
    };
  }

  const data = snap.data() || {};
  return {
    user: { id: uid, name: data?.name || '', email: data?.email || '' },
    is_profile_completed: !!data?.is_profile_completed,
    is_subscription_active: !!data?.is_subscription_active,
    is_trial: !!data?.is_trial,
    days_left: Number.isFinite(data?.days_left) ? data.days_left : null,
    subscription: {
      active: !!data?.subscription?.active,
      plan: data?.subscription?.plan ?? null,
      expiry: data?.subscription?.expiry ?? null,
    },
  };
}

export async function updateUserProfile({
  name,
  age,
  referral_source,
  exam_type,
  level,
}) {
  const uid = getUidOrThrow();
  const ref = doc(db, 'users', uid);
  const payload = {
    updated_at: serverTimestamp(),
  };

  if (name) payload.name = name;
  if (age) payload.age = age;
  if (referral_source) payload.referral_source = referral_source;
  if (exam_type) payload.exam_type = exam_type;
  if (level) payload.level = level;

  payload.is_profile_completed = true;

  await setDoc(ref, payload, { merge: true });
  return {
    user: { id: uid, name: payload.name, email: auth.currentUser?.email || '' },
    is_profile_completed: true,
  };
}

export async function deleteUserAccount() {
  const uid = getUidOrThrow();
  const userRef = doc(db, 'users', uid);
  const progressRef = doc(db, 'progress', uid);

  // Delete speaking_days documents for this user
  try {
    const speakingQuery = query(
      collection(db, 'speaking_days'),
      where('userId', '==', uid)
    );
    const speakingSnap = await getDocs(speakingQuery);
    await Promise.all(speakingSnap.docs.map((d) => deleteDoc(d.ref)));
  } catch {}

  // Delete speaking audio files from Storage (recursive)
  const deleteFolder = async (folderRef) => {
    const list = await listAll(folderRef);
    await Promise.all(list.items.map((item) => deleteObject(item)));
    await Promise.all(list.prefixes.map((prefix) => deleteFolder(prefix)));
  };
  try {
    const rootRef = storageRef(storage, `speaking/${uid}`);
    await deleteFolder(rootRef);
  } catch {}

  try {
    await deleteDoc(progressRef);
  } catch {}

  try {
    await deleteDoc(userRef);
  } catch {}

  const fbUser = auth.currentUser;
  if (fbUser) {
    await fbUser.delete();
  }
}

const STEP_ORDER = ['speaking', 'grammar', 'feedback'];
const TOTAL_DAYS = Array.isArray(days) && days.length ? days.length : 50;

const buildDefaultSnapshot = () => {
  const snap = {
    current_day: 1,
    current_step: 'speaking',
    days: {},
  };

  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    snap.days[String(d)] = {
      status: 'locked',
      steps: {
        speaking: 'locked',
        grammar: 'locked',
        feedback: 'locked',
      },
    };
  }

  return snap;
};

const collectCompletedSteps = (snap) => {
  const completed = {};
  const srcDays = snap?.days || {};
  Object.keys(srcDays).forEach((k) => {
    const dayId = Number(k);
    if (!Number.isFinite(dayId)) return;
    const steps = srcDays[k]?.steps || {};
    STEP_ORDER.forEach((step) => {
      if (steps?.[step] === 'completed') {
        if (!completed[dayId]) completed[dayId] = {};
        completed[dayId][step] = true;
      }
    });
  });
  return completed;
};

const buildSnapshotFromCompleted = (completedMap) => {
  const snap = buildDefaultSnapshot();

  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    const dayKey = String(d);
    const day = snap.days[dayKey];
    const completedSteps = completedMap?.[d] || {};
    STEP_ORDER.forEach((step) => {
      if (completedSteps?.[step]) {
        day.steps[step] = 'completed';
      }
    });
  }

  // Day status hesapla
  for (let d = 1; d <= TOTAL_DAYS; d += 1) {
    const dayKey = String(d);
    const day = snap.days[dayKey];
    let done = 0;
    STEP_ORDER.forEach((step) => {
      if (day.steps[step] === 'completed') done += 1;
    });

    if (done === STEP_ORDER.length) {
      day.status = 'completed';
    } else if (done > 0) {
      day.status = 'in_progress';
    } else {
      day.status = 'locked';
    }
  }

  // current_day / current_step
  let found = false;
  for (let d = 1; d <= TOTAL_DAYS && !found; d += 1) {
    const dayKey = String(d);
    const day = snap.days[dayKey];
    if (day.status !== 'completed') {
      snap.current_day = d;
      for (let i = 0; i < STEP_ORDER.length; i += 1) {
        const step = STEP_ORDER[i];
        if (day.steps[step] !== 'completed') {
          snap.current_step = step;
          found = true;
          break;
        }
      }
    }
  }

  if (!found) {
    snap.current_day = TOTAL_DAYS;
    snap.current_step = '';
  }

  // Aktif step → in_progress
  if (snap.current_step) {
    const dayKey = String(snap.current_day);
    const day = snap.days[dayKey];
    if (day && day.steps[snap.current_step] !== 'completed') {
      day.steps[snap.current_step] = 'in_progress';
    }
    if (day?.status === 'locked') {
      day.status = 'in_progress';
    }
  }

  return snap;
};

const getUidOrThrow = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error('auth_required');
  }
  return uid;
};

// Program ilerlemesi (gün/step)
export async function getProgress() {
  const uid = getUidOrThrow();
  const ref = doc(db, 'progress', uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const initial = buildSnapshotFromCompleted({});
    await setDoc(ref, initial);
    return initial;
  }

  return snap.data();
}

// Bir adımın durumunu güncelle (started/completed/failed gibi)
export async function updateProgress({ day_number, step, outcome, reason }) {
  const uid = getUidOrThrow();
  const dayNumber = Number(day_number);
  if (!Number.isFinite(dayNumber) || dayNumber < 1 || dayNumber > TOTAL_DAYS) {
    throw new Error('invalid_day_number');
  }
  if (!STEP_ORDER.includes(step)) {
    throw new Error('invalid_step');
  }
  if (!['started', 'completed', 'failed'].includes(outcome)) {
    throw new Error('invalid_outcome');
  }
  if (reason) {
    // Placeholder for future use (e.g., analytics); no-op for now.
    void reason;
  }

  const ref = doc(db, 'progress', uid);
  const updated = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? snap.data() : buildSnapshotFromCompleted({});
    const completed = collectCompletedSteps(current);

    if (outcome === 'completed') {
      if (!completed[dayNumber]) completed[dayNumber] = {};
      completed[dayNumber][step] = true;
    }

    const nextSnapshot = buildSnapshotFromCompleted(completed);
    tx.set(ref, nextSnapshot);
    return nextSnapshot;
  });

  return updated;
}
