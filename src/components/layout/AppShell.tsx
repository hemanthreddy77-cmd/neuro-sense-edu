import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  PlayCircle,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Logo } from "../common/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; adminOnly?: boolean };

const NAV: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard", label: "My Courses", icon: BookOpen },
  { to: "/learn/c1",  label: "Learning",   icon: PlayCircle },
  { to: "/analytics", label: "Analytics",  icon: BarChart3 },
  { to: "/admin",     label: "Admin",      icon: Shield, adminOnly: true },
  { to: "/settings",  label: "Settings",   icon: Settings },
];

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleNav = NAV.filter((n) => !n.adminOnly || user?.role === "admin");

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-screen w-full bg-background hero-grid-bg">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/10 bg-sidebar/80 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 px-3">
          <ul className="space-y-1">
            {visibleNav.map((n) => {
              const active =
                n.to === pathname ||
                (n.to !== "/" && pathname.startsWith(n.to.split("/$")[0]) && n.label === "Learning" && pathname.startsWith("/learn"));
              return (
                <li key={n.label}>
                  <Link
                    to={n.to}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                      active
                        ? "bg-brand/15 text-brand"
                        : "text-foreground/70 hover:text-foreground hover:bg-white/5",
                    )}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="m-3 rounded-2xl border border-white/10 bg-gradient-to-br from-brand/15 to-violet/15 p-4">
          <div className="text-sm font-semibold text-foreground">Boost your focus</div>
          <p className="mt-1 text-xs text-muted-foreground">
            Enable webcam to unlock real-time adaptive lessons.
          </p>
          <Link
            to="/settings"
            className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-foreground/95 px-3 py-1.5 text-xs font-semibold text-background hover:bg-foreground transition"
          >
            Configure
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-background/60 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="lg:hidden"><Logo withText={false} /></div>
              {title && (
                <h1 className="hidden text-lg font-semibold text-foreground md:block">{title}</h1>
              )}
            </div>
            <div className="hidden flex-1 max-w-md md:block">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search courses, lessons, emotions…"
                  className="w-full rounded-full border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand/50 focus:bg-white/10 transition"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4 text-foreground/80" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emotion-angry" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3 hover:bg-white/10 transition"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand to-violet text-xs font-bold text-background">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                  <span className="hidden text-sm font-medium text-foreground sm:inline">{user?.name || "User"}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                {menuOpen && (
                  <div
                    className="glass-strong absolute right-0 mt-2 w-56 overflow-hidden rounded-xl p-1 animate-fade-in-up"
                    onMouseLeave={() => setMenuOpen(false)}
                  >
                    <div className="px-3 py-2">
                      <div className="text-sm font-semibold text-foreground">{user?.name}</div>
                      <div className="text-xs text-muted-foreground">{user?.email}</div>
                    </div>
                    <div className="my-1 h-px bg-white/10" />
                    <Link to="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/85 hover:bg-white/5">
                      <Settings className="h-4 w-4" /> Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emotion-angry hover:bg-emotion-angry/10"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {/* Floating quick start */}
      <Link
        to="/learn/$courseId"
        params={{ courseId: "c1" }}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold btn-gradient shadow-[0_18px_40px_-12px_oklch(0.68_0.18_255_/_0.7)] hover:scale-105 transition"
      >
        <Plus className="h-4 w-4" />
        Quick Start
      </Link>
    </div>
  );
}
