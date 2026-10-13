import { VAPID_PUBLIC_KEY } from "../config/vapid.js";
import { notificationService } from "../services/notification.service.js";

export const getVapidPublicKey = (req, res) => {
  res.json({
    success: true,
    publicKey: VAPID_PUBLIC_KEY,
  });
};

export const subscribe = async (req, res, next) => {
  try {
    const subscription = req.body;
    if (!subscription?.endpoint) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing push subscription endpoint.",
      });
    }

    const userId = req.user?.uid || req.body.userId || "anonymous";
    const userAgent = req.headers["user-agent"] || "";

    await notificationService.saveSubscription(userId, subscription, userAgent);

    res.status(201).json({
      success: true,
      message: "Push subscription registered successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Missing subscription endpoint.",
      });
    }

    await notificationService.removeSubscription(endpoint);

    res.json({
      success: true,
      message: "Push subscription removed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getPreferences = async (req, res, next) => {
  try {
    const userId = req.user?.uid || "guest";
    const prefs = await notificationService.getPreferences(userId);

    res.json({
      success: true,
      preferences: prefs,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePreferences = async (req, res, next) => {
  try {
    const userId = req.user?.uid || "guest";
    const { preferences } = req.body;

    const updated = await notificationService.updatePreferences(userId, preferences || {});

    res.json({
      success: true,
      preferences: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const sendTestNotification = async (req, res, next) => {
  try {
    const userId = req.user?.uid || "anonymous";

    const testPayload = {
      title: "NeuroLearn AI · Test Alert",
      body: "Web Push notifications are connected and working properly on this device!",
      icon: "/icons/icon-192x192.png",
      badge: "/icons/badge-72x72.png",
      url: "/dashboard",
      type: "achievement",
    };

    const result = await notificationService.sendPushToUser(userId, testPayload);

    // If no direct subscription found for this user ID, also try anonymous/guest subscriptions
    if (result.delivered === 0 && userId !== "anonymous") {
      const fallbackResult = await notificationService.sendPushToUser("anonymous", testPayload);
      if (fallbackResult.delivered > 0) {
        return res.json({
          success: true,
          message: `Test push delivered to ${fallbackResult.delivered} active device(s).`,
          ...fallbackResult,
        });
      }
    }

    res.json({
      success: result.delivered > 0,
      message:
        result.delivered > 0
          ? `Test push delivered to ${result.delivered} active device(s).`
          : "No active push subscriptions found on server for this browser session. Please click 'Enable Push' first.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const triggerEventNotification = async (req, res, next) => {
  try {
    const { userId, title, body, actionUrl, type, category } = req.body;

    if (!title || !body) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Title and body are required to trigger an event notification.",
      });
    }

    const targetUser = userId || req.user?.uid || null;

    const result = await notificationService.sendPushToUser(targetUser, {
      title,
      body,
      url: actionUrl || "/dashboard",
      type: type || "info",
      category: category || "learning_reminders",
    });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
