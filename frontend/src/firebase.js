import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFirebaseConfig } from "./firebaseConfig";

const { values, isConfigured } = getFirebaseConfig();

const firebaseConfig = {
  apiKey: values.VITE_FIREBASE_API_KEY,
  authDomain: values.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: values.VITE_FIREBASE_PROJECT_ID,
  storageBucket: values.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: values.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: values.VITE_FIREBASE_APP_ID,
};

if (!isConfigured) {
  throw new Error(
    "Firebase is not configured. Check frontend/.env before building or deploying.",
  );
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
