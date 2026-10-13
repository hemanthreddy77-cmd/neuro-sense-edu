import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateFirebaseProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider, isFirebaseClientReady } from "@/lib/firebase";
import { api } from "@/lib/api-client";

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
  loginWithGoogle: (preferredRole?: Role) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (patch: Partial<User>) => Promise<void>;
  isFirebaseActive: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "neurolearn.auth.user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load cached user from localStorage on mount
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (u: User | null, token?: string) => {
    setUser(u);
    try {
      if (u) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
        if (token) {
          localStorage.setItem("firebase_id_token", token);
          localStorage.setItem("neurolearn.auth.token", token);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("firebase_id_token");
        localStorage.removeItem("neurolearn.auth.token");
      }
    } catch {}
  };

  // Listen to live Firebase Auth state changes
  useEffect(() => {
    if (!auth || !isFirebaseClientReady) return;

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        try {
          const idToken = await fbUser.getIdToken();
          // Sync with Express backend & Firestore
          let verifiedProfile: User | null = null;
          try {
            const resp = await api.auth.verifyToken(idToken);
            if (resp?.user) {
              verifiedProfile = {
                id: resp.user.uid || fbUser.uid,
                name: resp.user.name || fbUser.displayName || fbUser.email?.split("@")[0] || "Learner",
                email: resp.user.email || fbUser.email || "",
                role: (resp.user.role as Role) || "student",
                avatar: fbUser.photoURL || undefined,
              };
            }
          } catch {
            // Backend offline or error fallback
          }

          if (!verifiedProfile) {
            verifiedProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || fbUser.email?.split("@")[0] || "Learner",
              email: fbUser.email || "",
              role: fbUser.email?.includes("admin") ? "admin" : "student",
              avatar: fbUser.photoURL || undefined,
            };
          }

          persist(verifiedProfile, idToken);
        } catch (err) {
          console.error("Failed to sync Firebase auth state:", err);
        }
      } else {
        // Only wipe if was previously logged in via Firebase
        if (isFirebaseClientReady) {
          persist(null);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    if (auth && isFirebaseClientReady) {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();

      let u: User = {
        id: fbUser.uid,
        name: fbUser.displayName || email.split("@")[0] || "Learner",
        email: fbUser.email || email,
        role: email.toLowerCase().includes("admin") ? "admin" : "student",
      };

      try {
        const resp = await api.auth.verifyToken(idToken);
        if (resp?.user) {
          u = {
            id: resp.user.uid || fbUser.uid,
            name: resp.user.name || u.name,
            email: resp.user.email || u.email,
            role: resp.user.role || u.role,
          };
        }
      } catch {}

      persist(u, idToken);
      return u;
    }

    // Local dev mock fallback
    const role: Role = email.toLowerCase().includes("admin") ? "admin" : "student";
    const u: User = {
      id: "u_" + Math.random().toString(36).slice(2, 9),
      name: email.split("@")[0].replace(/^./, (c) => c.toUpperCase()) || "Learner",
      email,
      role,
    };
    persist(u, `mock-token-${role}-${u.id}`);
    return u;
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, role: Role): Promise<User> => {
      if (auth && isFirebaseClientReady) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const fbUser = userCredential.user;

        await updateFirebaseProfile(fbUser, { displayName: name });
        const idToken = await fbUser.getIdToken();

        const u: User = {
          id: fbUser.uid,
          name,
          email,
          role,
        };

        try {
          await api.auth.register({
            uid: fbUser.uid,
            name,
            email,
            role,
          });
        } catch {}

        persist(u, idToken);
        return u;
      }

      // Local dev mock fallback
      const u: User = {
        id: "u_" + Math.random().toString(36).slice(2, 9),
        name,
        email,
        role,
      };
      persist(u, `mock-token-${role}-${u.id}`);
      return u;
    },
    [],
  );

  const loginWithGoogle = useCallback(async (preferredRole: Role = "student"): Promise<User> => {
    if (auth && isFirebaseClientReady) {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const fbUser = userCredential.user;
      const idToken = await fbUser.getIdToken();

      const role: Role = fbUser.email?.toLowerCase().includes("admin") ? "admin" : preferredRole;
      const u: User = {
        id: fbUser.uid,
        name: fbUser.displayName || fbUser.email?.split("@")[0] || "Learner",
        email: fbUser.email || "",
        role,
        avatar: fbUser.photoURL || undefined,
      };

      try {
        await api.auth.register({
          uid: fbUser.uid,
          name: u.name,
          email: u.email,
          role: u.role,
        });
      } catch {}

      persist(u, idToken);
      return u;
    }

    // Local dev mock fallback
    const u: User = {
      id: "u_google_" + Math.random().toString(36).slice(2, 9),
      name: "Google User",
      email: "user@gmail.com",
      role: preferredRole,
    };
    persist(u, `mock-google-token-${preferredRole}-${u.id}`);
    return u;
  }, []);

  const logout = useCallback(async () => {
    if (auth && isFirebaseClientReady) {
      try {
        await signOut(auth);
      } catch {}
    }
    persist(null);
  }, []);

  const updateProfile = useCallback(async (patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

    try {
      await api.auth.updateProfile({
        name: patch.name,
        avatarUrl: patch.avatar,
      });
    } catch {}
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      login,
      register,
      loginWithGoogle,
      logout,
      updateProfile,
      isFirebaseActive: isFirebaseClientReady,
    }),
    [user, login, register, loginWithGoogle, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
