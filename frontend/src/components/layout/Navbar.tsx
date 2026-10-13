import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../common/Logo";
import { GradientButton } from "../common/GradientButton";
import { useAuth } from "@/contexts/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/#features", label: "Features" },
  { to: "/#how-it-works", label: "How It Works" },
  { to: "/#courses", label: "Courses" },
  { to: "/#analytics", label: "Analytics" },
  { to: "/#contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <nav className="glass-strong flex items-center justify-between rounded-2xl px-4 py-3">
          <Logo />
          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <a
                  href={l.to}
                  className="rounded-full px-3 py-1.5 text-sm text-foreground/75 hover:text-foreground hover:bg-white/5 transition"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <GradientButton>Dashboard</GradientButton>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <GradientButton variant="ghost">Login</GradientButton>
                </Link>
                <Link to="/register">
                  <GradientButton>Register</GradientButton>
                </Link>
              </>
            )}
          </div>
          <button
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>

        {open && (
          <div className="glass-strong mt-2 rounded-2xl p-4 lg:hidden animate-fade-in-up">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.to}>
                  <a
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm text-foreground/80 hover:bg-white/5"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex gap-2">
              {isAuthenticated ? (
                <Link to="/dashboard" className="flex-1">
                  <GradientButton className="w-full">Dashboard</GradientButton>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="flex-1">
                    <GradientButton variant="outline" className="w-full">
                      Login
                    </GradientButton>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <GradientButton className="w-full">Register</GradientButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
