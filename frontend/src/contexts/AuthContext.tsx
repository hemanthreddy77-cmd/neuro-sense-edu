import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Role = "student" | "admin";
export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
};

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, role: Role) => Promise<User>;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "neurolearn.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        localStorage.setItem("neurolearn.auth.token", `mock-token-${u.role}-${u.id}`);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("neurolearn.auth.token");
      }
    } catch {}
  };

  const login = useCallback(async (email: string, _password: string) => {
    const role: Role = email.toLowerCase().includes("admin") ? "admin" : "student";
    const u: User = {
      id: "u_" + Math.random().toString(36).slice(2, 9),
      name: email.split("@")[0].replace(/^./, (c) => c.toUpperCase()) || "Learner",
      email,
      role,
    };
    persist(u);
    return u;
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string, role: Role) => {
      const u: User = {
        id: "u_" + Math.random().toString(36).slice(2, 9),
        name,
        email,
        role,
      };
      persist(u);
      return u;
    },
    [],
  );

  const logout = useCallback(() => persist(null), []);
  const updateProfile = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, register, logout, updateProfile }),
    [user, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
