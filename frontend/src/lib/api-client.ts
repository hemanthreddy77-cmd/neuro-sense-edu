/**
 * NeuroLearn AI Backend API Client
 * Connects frontend views to the Express Node.js backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
  const url = `${API_BASE_URL}${endpoint}`;
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
};
