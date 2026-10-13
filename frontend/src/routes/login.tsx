import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — NeuroLearn AI" },
      {
        name: "description",
        content: "Sign in to your NeuroLearn AI adaptive learning dashboard.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setBusy(true);
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      const code = e?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
        setError("Invalid email or password.");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(e?.message || "Login failed. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await loginWithGoogle();
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      if (e?.code !== "auth/popup-closed-by-user") {
        setError(e?.message || "Google sign-in failed. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your adaptive learning journey."
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          icon: Mail,
          placeholder: "you@example.com",
          value: email,
          onChange: setEmail,
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          icon: Lock,
          placeholder: "••••••••",
          value: password,
          onChange: setPassword,
        },
      ]}
      onSubmit={submit}
      onGoogleSubmit={handleGoogle}
      submitLabel="Login"
      busy={busy}
      error={error}
      footer={
        <div className="space-y-1">
          <div>
            <Link to="/" className="text-brand hover:text-brand-glow">
              Forgot your password?
            </Link>
          </div>
          <div>
            Don't have an account?{" "}
            <Link to="/register" className="text-brand hover:text-brand-glow font-medium">
              Register
            </Link>
          </div>
        </div>
      }
    />
  );
}
