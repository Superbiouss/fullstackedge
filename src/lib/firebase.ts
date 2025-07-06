import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check is important! It ensures you have filled out your .env.local file.
// If you're seeing this error, it means you need to add your Firebase credentials.
const missingConfig = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value === 'YOUR_API_KEY_HERE')
  .map(([key]) => key);

if (missingConfig.length > 0) {
    const missingKeys = missingConfig.map(key => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
    throw new Error(`Firebase configuration is missing or incomplete. Please check your .env.local file for the following keys: ${missingKeys.join(', ')} and restart the server.`);
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const githubProvider = new GithubAuthProvider();

export { app, auth, db, storage, githubProvider };
