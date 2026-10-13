import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "neuro-ai-3a5bd.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "neuro-ai-3a5bd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "neuro-ai-3a5bd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "115752810524",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
const googleProvider = new GoogleAuthProvider();

export const isFirebaseClientReady = Boolean(firebaseConfig.apiKey && firebaseConfig.apiKey.length > 5);

if (typeof window !== "undefined" && isFirebaseClientReady) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
  } catch (err) {
    console.warn("⚠️ Firebase Client initialization warning:", err);
  }
}

export { app, auth, googleProvider };
