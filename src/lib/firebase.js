// Firebase init (web SDK)
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDs2xoGWxRtI6iNPW21eS9qUPdm3woMd-Q',
  authDomain: 'speakify-3570d.firebaseapp.com',
  projectId: 'speakify-3570d',
  storageBucket: 'speakify-3570d.firebasestorage.app',
  messagingSenderId: '511871909471',
  appId: '1:511871909471:web:d436ada86e4ca0382fa5ea',
  measurementId: 'G-NYK6F3MS4V',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  auth = getAuth(app);
}
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
