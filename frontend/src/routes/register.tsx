import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { useAuth } from "@/contexts/AuthContext";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — NeuroLearn AI" },
      {
        name: "description",
        content: "Join NeuroLearn AI and start your adaptive learning journey today.",
      },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"student" | "admin">("student");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!name || !email) {
      setError("Please complete all required fields.");
      return;
    }
    if (!password) {
      setError("Please choose a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password, role);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      const code = e?.code || "";
      if (code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(e?.message || "Registration failed. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      await loginWithGoogle(role);
      navigate({ to: "/dashboard" });
    } catch (e: any) {
      if (e?.code !== "auth/popup-closed-by-user") {
        setError(e?.message || "Google registration failed. Try again.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start learning with adaptive intelligence — free forever."
      fields={[
        {
          name: "name",
          label: "Full Name",
          type: "text",
          icon: User,
          placeholder: "Ada Lovelace",
          value: name,
          onChange: setName,
        },
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
        {
          name: "confirm",
          label: "Confirm Password",
          type: "password",
          icon: Lock,
          placeholder: "••••••••",
          value: confirm,
          onChange: setConfirm,
        },
      ]}
      onSubmit={submit}
      onGoogleSubmit={handleGoogle}
      submitLabel="Create account"
      busy={busy}
      error={error}
      role={role}
      onRoleChange={setRole}
      footer={
        <div>
          Already have an account?{" "}
          <Link to="/login" className="text-brand hover:text-brand-glow font-medium">
            Login
          </Link>
        </div>
      }
    />
  );
}
