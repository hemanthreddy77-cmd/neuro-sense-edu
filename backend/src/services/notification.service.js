import { db, isFirebaseConfigured } from "../config/firebase.js";
import { webpush } from "../config/vapid.js";

// In-memory fallback stores for local/dev without live Firestore
const memorySubscriptions = new Map(); // endpoint -> { userId, subscription, createdAt }
const memoryPreferences = new Map(); // userId -> preferences
const memoryNotifications = new Map(); // userId -> AppNotification[]

export const notificationService = {
  /**
   * Save or update a Web Push subscription
   */
  async saveSubscription(userId, subscription, userAgent = "") {
    if (!subscription?.endpoint) {
      throw new Error("Invalid push subscription: missing endpoint.");
    }

    const payload = {
      userId: userId || "guest",
      endpoint: subscription.endpoint,
      keys: subscription.keys || {},
      userAgent,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        // Hash endpoint or use as doc ID (encode base64url safely)
        const docId = Buffer.from(subscription.endpoint).toString("base64url").slice(-100);
        await db.collection("push_subscriptions").doc(docId).set(
          {
            ...payload,
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn("[Push Service] Firestore write failed, using memory fallback:", err.message);
        memorySubscriptions.set(subscription.endpoint, payload);
      }
    } else {
      memorySubscriptions.set(subscription.endpoint, payload);
    }

    return true;
  },

  /**
   * Remove a Web Push subscription by endpoint
   */
  async removeSubscription(endpoint) {
    if (!endpoint) return false;

    if (isFirebaseConfigured && db) {
      try {
        const docId = Buffer.from(endpoint).toString("base64url").slice(-100);
        await db.collection("push_subscriptions").doc(docId).delete();
      } catch (err) {
        console.warn("[Push Service] Firestore delete failed:", err.message);
      }
    }
    memorySubscriptions.delete(endpoint);
    return true;
  },

  /**
   * Get all active subscriptions for a user (or all if userId === null)
   */
  async getUserSubscriptions(userId) {
    const list = [];

    if (isFirebaseConfigured && db) {
      try {
        let query = db.collection("push_subscriptions");
        if (userId) {
          query = query.where("userId", "==", userId);
        }
        const snap = await query.get();
        snap.forEach((doc) => {
          list.push(doc.data());
        });
      } catch (err) {
        console.warn("[Push Service] Firestore query failed:", err.message);
      }
    }

    // Include memory fallback subscriptions
    for (const [_, sub] of memorySubscriptions.entries()) {
      if (!userId || sub.userId === userId) {
        if (!list.some((s) => s.endpoint === sub.endpoint)) {
          list.push(sub);
        }
      }
    }

    return list;
  },

  /**
   * Send a Web Push notification to a specific user across all their devices
   */
  async sendPushToUser(userId, notificationPayload) {
    const subscriptions = await this.getUserSubscriptions(userId);
    if (!subscriptions || subscriptions.length === 0) {
      return { delivered: 0, failed: 0, message: "No active subscriptions found for user." };
    }

    let delivered = 0;
    let failed = 0;

    const payloadString = JSON.stringify({
      title: notificationPayload.title || "NeuroLearn AI",
      body: notificationPayload.body || notificationPayload.message || "New learning update",
      icon: notificationPayload.icon || "/icons/icon-192x192.png",
      badge: notificationPayload.badge || "/icons/badge-72x72.png",
      url: notificationPayload.url || notificationPayload.actionUrl || "/dashboard",
      type: notificationPayload.type || "info",
      data: notificationPayload.data || {},
    });

    await Promise.all(
      subscriptions.map(async (sub) => {
        try {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: sub.keys,
          };
          await webpush.sendNotification(pushSubscription, payloadString);
          delivered++;
        } catch (error) {
          failed++;
          console.warn(`[Push Service] Delivery failed to endpoint (${error.statusCode}):`, error.message);

          // 410 Gone or 404 Not Found indicates subscription expired / unsubscribed by browser
          if (error.statusCode === 410 || error.statusCode === 404) {
            console.log(`[Push Service] Cleaning up expired subscription: ${sub.endpoint.slice(0, 30)}…`);
            await this.removeSubscription(sub.endpoint);
          }
        }
      })
    );

    return { delivered, failed };
  },

  /**
   * Get user notification preferences
   */
  async getPreferences(userId) {
    if (!userId) return null;

    if (isFirebaseConfigured && db) {
      try {
        const snap = await db.collection("notification_preferences").doc(userId).get();
        if (snap.exists) {
          return snap.data();
        }
      } catch (err) {
        console.warn("[Push Service] Firestore get preferences failed:", err.message);
      }
    }

    return memoryPreferences.get(userId) || null;
  },

  /**
   * Update user notification preferences
   */
  async updatePreferences(userId, preferences) {
    if (!userId) return null;

    const record = {
      ...preferences,
      userId,
      updatedAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      try {
        await db.collection("notification_preferences").doc(userId).set(record, { merge: true });
      } catch (err) {
        console.warn("[Push Service] Firestore set preferences failed:", err.message);
      }
    }

    memoryPreferences.set(userId, record);
    return record;
  },
};
