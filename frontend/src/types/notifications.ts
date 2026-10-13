export type NotificationType =
  | "success"
  | "info"
  | "reminder"
  | "warning"
  | "error"
  | "achievement"
  | "course_recommendation"
  | "emotionshift_suggestion";

export type NotificationCategory =
  | "learning_reminders"
  | "course_recommendations"
  | "achievements"
  | "emotionshift_suggestions"
  | "system_updates";

export interface AppNotification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  persistent?: boolean; // If true, requires explicit dismissal
  meta?: Record<string, unknown>;
}

export interface NotificationPreferences {
  enabled: boolean;
  soundEnabled: boolean;
  categories: {
    learning_reminders: boolean;
    course_recommendations: boolean;
    achievements: boolean;
    emotionshift_suggestions: boolean;
    system_updates: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string; // "22:00"
    end: string; // "08:00"
  };
  frequency: "all" | "essential" | "digest";
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: true,
  soundEnabled: true,
  categories: {
    learning_reminders: true,
    course_recommendations: true,
    achievements: true,
    emotionshift_suggestions: true,
    system_updates: true,
  },
  quietHours: {
    enabled: false,
    start: "22:00",
    end: "08:00",
  },
  frequency: "all",
};
