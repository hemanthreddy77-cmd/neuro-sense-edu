# NeuroLearn AI — Frontend Build Plan

A complete dark-themed, glassmorphism UI for an emotion-aware learning platform. All data is mocked (no backend). Auth state is held in a React Context with localStorage persistence.

## Stack adaptation note
Your spec mentions React Router v6 and `react-router-dom`. This project is built on **TanStack Start + TanStack Router** (file-based routing in `src/routes/`). I will use TanStack Router equivalents — same UX, same routes, same protected-route behavior. Tailwind v4 is already configured (`src/styles.css`), so no `tailwind.config.js` / `init -p` step.

## Design system (in `src/styles.css`)
- Background: `#0F0F1A` base, `#1A1A2E` surfaces (as oklch tokens)
- Primary accent: electric blue `#4F8EF7`
- Secondary accent: soft purple `#7B5EA7`
- Emotion palette: green/yellow/orange/red/blue tokens for adaptive states
- Font: Inter via `<link>` in `__root.tsx` head, registered as `--font-sans`
- Glass utility: `@utility glass-card` (semi-transparent bg, backdrop-blur, subtle border)
- Gradient text + pill button variants
- Custom keyframes: fade-in-up, float, particle-drift, gradient-shift

## Routes (`src/routes/`)
| File | Path | Notes |
|---|---|---|
| `index.tsx` | `/` | Premium landing (Page 0 + Page 1 merged into one rich landing) |
| `login.tsx` | `/login` | Glass card, mock sign-in |
| `register.tsx` | `/register` | Glass card, role toggle Student/Admin |
| `_authenticated.tsx` | layout | Guards: redirects to `/login` if no mock user in context |
| `_authenticated/dashboard.tsx` | `/dashboard` | Student dashboard |
| `_authenticated/learn.$courseId.tsx` | `/learn/:courseId` | Split layout + webcam panel |
| `_authenticated/analytics.tsx` | `/analytics` | Recharts dashboards |
| `_authenticated/admin.tsx` | `/admin` | Gated to role === "admin" inside component |
| `_authenticated/settings.tsx` | `/settings` | Profile, prefs, danger zone |

## Components (`src/components/`)
- `layout/Navbar.tsx` (public top nav, glass, hamburger on mobile)
- `layout/AppShell.tsx` (sidebar + topbar wrapper for authed pages)
- `layout/Sidebar.tsx` (collapsible icon rail)
- `landing/` — `Hero`, `TrustBar`, `FeatureGrid`, `HowItWorks`, `CourseShowcase`, `LiveAnalyticsPreview`, `Testimonials`, `CtaSection`, `Footer`, `ParticleField`, `FloatingEmotionCards`
- `common/` — `CourseCard`, `EmotionBadge`, `WebcamPanel`, `StatCard`, `AdaptiveBanner`, `SessionHistoryTable`, `LoadingSpinner`, `GradientButton`, `GlassCard`, `AnimatedCounter`
- `auth/AuthForm.tsx` (shared shell for login/register, div-based inputs per spec — no `<form>`)

## Auth & state
- `src/contexts/AuthContext.tsx` — `{ user, role, login, logout, register }`, persisted to `localStorage`. No backend calls.
- Provider wraps `<Outlet />` in `__root.tsx`.
- `_authenticated.tsx` uses `beforeLoad` to redirect to `/login` when no user (read from localStorage during SSR-safe check), plus an in-component fallback. Router context exposes `auth`.

## Mock data (`src/data/mockData.ts`)
- 6 courses (Programming, AI, Data Science, Cyber Security, Cloud, IoT) with thumbnails (Unsplash URLs), progress, difficulty, duration.
- 30 days of emotion logs (Happy/Focused/Confused/Bored/Angry/Curious/Motivated) with timestamps.
- 5 recent activity items.
- Admin: users list, system health, course management rows.
- Testimonials, stats counters.

## Webcam / learning page
- `react-webcam` for live preview (added as dependency).
- Emotion is **simulated** (cycles through emotions every 6s with random confidence) — no ML. The `AdaptiveBanner` swaps color/copy based on the simulated emotion.
- Face-detection overlay is a CSS-drawn rounded box with animated corners.
- Session timer via `useEffect` + interval.

## Charts (Recharts)
- LineChart: multi-line emotion trend
- BarChart: sessions per day
- Donut PieChart: emotion distribution
- All themed to the dark palette via CSS variables.

## Animations
- Tailwind `animate-fade-in`, `hover-scale` utilities (already documented in project knowledge).
- Particle field: pure CSS (animated radial gradients + small absolutely-positioned divs with `animate-float`).
- Section reveals via IntersectionObserver hook `useReveal`.

## Dependencies to add
- `recharts`
- `react-webcam`
- (lucide-react already present)

## Out of scope (will not do unless asked)
- Real emotion detection / ML model
- Real auth (Supabase/Cloud) — using mock context only as you requested
- Backend/API integration
- i18n, theme toggle persistence beyond local state (toggle UI is shown but app stays dark)

## Technical details
- TanStack Router file-based routing replaces React Router v6. `<Link to>` + `params`, not `<a href>`.
- Tailwind v4: tokens in `@theme` block in `src/styles.css`; no JS config file.
- Inter font loaded via `<link>` in root route head (not CSS `@import`).
- All inputs are controlled `useState` divs with `contentEditable={false}` `<input>` elements inside `<div>` wrappers — no `<form>` tags, per your spec.
- SEO `head()` per route with unique title/description.
- All colors via semantic tokens (no raw hex in components).

Ready to build on approval.