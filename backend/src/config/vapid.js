import webpush from "web-push";
import dotenv from "dotenv";

dotenv.config();

// Default generated VAPID keys for immediate turnkey operation, overrideable by .env
const VAPID_PUBLIC_KEY =
  process.env.VAPID_PUBLIC_KEY ||
  "BEdbomk-hicQ7gkfDzsF4v2ui9Hnqem_uE_UUelX3lmd5mhycfGbYGVs88bxDJGHywdr3zXTZNcX0fgcuNWGTsk";

const VAPID_PRIVATE_KEY =
  process.env.VAPID_PRIVATE_KEY || "uDJhf4iY0S4kBuFG-4lkCqPTSc79SQa3L4WcV8kELBs";

const VAPID_SUBJECT =
  process.env.VAPID_SUBJECT || "mailto:admin@neurolearn.ai";

try {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log("🔔 Web Push VAPID configuration initialized successfully");
} catch (error) {
  console.error("❌ Failed to set VAPID details:", error.message);
}

export { webpush, VAPID_PUBLIC_KEY, VAPID_SUBJECT };
