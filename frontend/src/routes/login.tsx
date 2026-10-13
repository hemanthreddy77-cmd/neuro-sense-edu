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
  const { login } = useAuth();
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
    setBusy(true);
    try {
      await login(email, password);
      navigate({ to: "/dashboard" });
    } catch (e) {
      setError("Login failed. Try again.");
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
