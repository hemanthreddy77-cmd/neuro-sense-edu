/**
 * NeuroLearn AI Backend API Client
 * Connects frontend views to the Express Node.js backend.
 */

function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_URL;
  if (configured && !configured.includes("localhost") && !configured.includes("127.0.0.1")) {
    return configured.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";
    if (isLocalhost) {
      return (configured || "http://localhost:5000").replace(/\/+$/, "");
    }
    // Remote production host without valid external VITE_API_URL
    return "";
  }
  return configured ? configured.replace(/\/+$/, "") : "http://localhost:5000";
}

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("firebase_id_token") || localStorage.getItem("neurolearn.auth.token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = getApiBaseUrl();
  if (!baseUrl && typeof window !== "undefined") {
    // Prevent browser loopback CORS blocking error when VITE_API_URL is not set on remote host
    throw new Error(
      `[NeuroLearn API] VITE_API_URL is not configured for ${window.location.hostname}. Please set VITE_API_URL in your Vercel project settings to your deployed backend URL.`,
    );
  }
  const url = `${baseUrl}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || errorData.error || `HTTP ${response.status} on ${endpoint}`,
    );
  }

  return response.json();
}

export const api = {
  // Auth APIs
  auth: {
    verifyToken: (idToken: string) =>
      request<{ success: boolean; user: any }>("/api/auth/verify-token", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      }),
    register: (userData: { uid?: string; name: string; email: string; role?: string }) =>
      request<{ success: boolean; user: any }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    getProfile: () => request<{ success: boolean; user: any }>("/api/auth/profile"),
    updateProfile: (data: { name?: string; avatarUrl?: string }) =>
      request<{ success: boolean; user: any }>("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Courses APIs
  courses: {
    getAll: () => request<{ success: boolean; count: number; courses: any[] }>("/api/courses"),
    getById: (id: string) => request<{ success: boolean; course: any }>(`/api/courses/${id}`),
    create: (data: any) =>
      request<{ success: boolean; course: any }>("/api/courses", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: any) =>
      request<{ success: boolean; course: any }>(`/api/courses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/courses/${id}`, {
        method: "DELETE",
      }),
    enroll: (id: string) =>
      request<{ success: boolean; enrolledCourses: string[] }>(`/api/courses/${id}/enroll`, {
        method: "POST",
      }),
  },

  // Sessions APIs
  sessions: {
    start: (courseId: string) =>
      request<{ success: boolean; session: any }>("/api/sessions/start", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      }),
    end: (id: string, data: { dominantEmotion?: string; duration?: number }) =>
      request<{ success: boolean; session: any }>(`/api/sessions/${id}/end`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    getMy: () => request<{ success: boolean; count: number; sessions: any[] }>("/api/sessions/my"),
    getById: (id: string) => request<{ success: boolean; session: any }>(`/api/sessions/${id}`),
  },

  // Emotions Telemetry APIs
  emotions: {
    log: (data: {
      sessionId: string;
      emotion: string;
      confidence: number;
      contentAdapted?: boolean;
    }) =>
      request<{ success: boolean; log: any }>("/api/emotions/log", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getStats: (userId: string) =>
      request<{
        success: boolean;
        totalEvents: number;
        dominantEmotion: string;
        counts: Record<string, number>;
        distribution: any[];
      }>(`/api/emotions/stats/${userId}`),
  },

  // Admin APIs
  admin: {
    getUsers: () => request<{ success: boolean; count: number; users: any[] }>("/api/admin/users"),
    updateRole: (id: string, role: "student" | "admin") =>
      request<{ success: boolean; user: any }>(`/api/admin/users/${id}/role`, {
        method: "PUT",
        body: JSON.stringify({ role }),
      }),
    deleteUser: (id: string) =>
      request<{ success: boolean; message: string }>(`/api/admin/users/${id}`, {
        method: "DELETE",
      }),
    getStats: () => request<{ success: boolean; stats: any }>("/api/admin/stats"),
  },

  // Notification & Web Push APIs
  notifications: {
    getVapidPublicKey: () =>
      request<{ success: boolean; publicKey: string }>("/api/notifications/vapid-public-key"),
    subscribe: (subscription: PushSubscription) =>
      request<{ success: boolean; message: string }>("/api/notifications/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
      }),
    unsubscribe: (endpoint: string) =>
      request<{ success: boolean; message: string }>("/api/notifications/unsubscribe", {
        method: "POST",
        body: JSON.stringify({ endpoint }),
      }),
    getPreferences: () =>
      request<{ success: boolean; preferences: any }>("/api/notifications/preferences"),
    updatePreferences: (preferences: any) =>
      request<{ success: boolean; preferences: any }>("/api/notifications/preferences", {
        method: "PUT",
        body: JSON.stringify({ preferences }),
      }),
    sendTestPush: () =>
      request<{ success: boolean; message: string }>("/api/notifications/test", {
        method: "POST",
      }),
  },
};
