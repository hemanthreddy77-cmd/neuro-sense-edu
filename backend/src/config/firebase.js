import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let db = null;
let auth = null;
let isFirebaseConfigured = false;

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  // Normalize escaped newlines from environment variable strings
  privateKey = privateKey.replace(/\\n/g, "\n");
}

if (projectId && clientEmail && privateKey) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }
    db = admin.firestore();
    auth = admin.auth();
    isFirebaseConfigured = true;
    console.log("🔥 Firebase Admin SDK initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
  }
} else {
  console.warn(
    "⚠️ Firebase credentials not fully configured in .env. Running in offline/development mock mode."
  );
}

export { admin, db, auth, isFirebaseConfigured };
