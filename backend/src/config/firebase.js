import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let db = null;
let auth = null;
let isFirebaseConfigured = false;

// Check for serviceAccountKey.json in backend root or config folder
const candidateJsonPaths = [
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  path.resolve(__dirname, "../../serviceAccountKey.json"),
  path.resolve(__dirname, "./serviceAccountKey.json"),
].filter(Boolean);

let serviceAccountPath = candidateJsonPaths.find((p) => fs.existsSync(p));

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;

if (privateKey) {
  // Normalize escaped newlines from environment variable strings
  privateKey = privateKey.replace(/\\n/g, "\n");
}

try {
  if (serviceAccountPath) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    db = admin.firestore();
    auth = admin.auth();
    isFirebaseConfigured = true;
    console.log(`🔥 Firebase Admin SDK initialized via ${path.basename(serviceAccountPath)}`);
  } else if (projectId && clientEmail && privateKey) {
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
    console.log("🔥 Firebase Admin SDK initialized successfully via environment variables");
  } else {
    console.warn(
      "⚠️ Firebase credentials not configured in .env or serviceAccountKey.json. Running in development mock mode."
    );
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin SDK:", error.message);
}

export { admin, db, auth, isFirebaseConfigured };
