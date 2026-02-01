import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export async function getUserDoc(uid) {
  if (!uid) throw new Error('missing_uid');
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() || {} : null;
}

export async function upsertUserDoc(uid, data) {
  if (!uid) throw new Error('missing_uid');
  const ref = doc(db, 'users', uid);
  const payload = {
    ...data,
    user_id: uid,
    updated_at: serverTimestamp(),
  };
  if (!data?.created_at) payload.created_at = serverTimestamp();
  await setDoc(ref, payload, { merge: true });
  return payload;
}

export async function setProfileCompleted(uid, isCompleted) {
  return upsertUserDoc(uid, {
    is_profile_completed: !!isCompleted,
  });
}

export async function setOnboardingData(uid, data) {
  return upsertUserDoc(uid, {
    onboarding: data,
  });
}
