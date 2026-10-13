# EmotionShift AI — Implementation Plan

## Repository Audit Summary

### Frontend (TanStack Start + React + Tailwind v4)
| Component | Status |
|---|---|
| Framework | TanStack Start (SSR) with Vite 7 |
| Router | TanStack Router (file-based) |
| Styling | Tailwind v4 + custom CSS utilities |
| UI Library | Radix UI + shadcn/ui components |
| Icons | Lucide React |
| State | React Context (AuthContext) |
| Design | Dark-mode premium SaaS (navy + electric blue + violet) |

### Existing Routes
| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/register` | Register |
| `/_authenticated/dashboard` | Student dashboard |
| `/_authenticated/learn/$courseId` | Learning session |
| `/_authenticated/lesson-studio` | AI Lesson Studio |
| `/_authenticated/analytics` | Emotion analytics |
| `/_authenticated/admin` | Admin panel |
| `/_authenticated/settings` | User settings |

### Reusable Components Available
- `GlassCard` — glassmorphism card wrapper
- `GradientButton` — primary/outline/ghost buttons
- `LoadingSpinner` — loading state
- `AppShell` — sidebar + top-bar layout
- `Logo`, `StatCard`, `EmotionBadge`, `WebcamPanel`, `CourseCard`

### Backend (Express + Firebase)
- Express.js with CORS, Helmet, Morgan
- Firebase Admin SDK (graceful offline/mock mode)
- Auth middleware with dev fallback
- Existing routes: auth, courses, sessions, emotions, admin

---

## Phase 2: Files to Create

### Frontend — New Route Files
1. `src/routes/_authenticated/emotion-shift.tsx` — Main EmotionShift landing
2. `src/routes/_authenticated/emotion-shift.scenarios.tsx` — Scenario listing
3. `src/routes/_authenticated/emotion-shift.play.$scenarioId.tsx` — Scenario player
4. `src/routes/_authenticated/emotion-shift.history.tsx` — Activity history

### Frontend — New Components
5. `src/components/emotion-shift/EmotionShiftHero.tsx` — Hero section
6. `src/components/emotion-shift/ScenarioCategoryGrid.tsx` — 8 category cards
7. `src/components/emotion-shift/ScenarioCategoryCard.tsx` — Individual card
8. `src/components/emotion-shift/MoodCheckIn.tsx` — Mood selector dialog
9. `src/components/emotion-shift/ScenarioCard.tsx` — Scenario listing card
10. `src/components/emotion-shift/ScenarioPlayer.tsx` — Reusable player shell

### Frontend — Scenario Experiences
11. `src/components/emotion-shift/experiences/BreathingExperience.tsx`
12. `src/components/emotion-shift/experiences/GroundingExperience.tsx`
13. `src/components/emotion-shift/experiences/MemoryGame.tsx`
14. `src/components/emotion-shift/experiences/TriviaChallenge.tsx`
15. `src/components/emotion-shift/experiences/MotivationChallenge.tsx`
16. `src/components/emotion-shift/experiences/FocusTimer.tsx`
17. `src/components/emotion-shift/experiences/CreativeCanvas.tsx`
18. `src/components/emotion-shift/experiences/KnowledgeExplorer.tsx`
19. `src/components/emotion-shift/experiences/ReflectionExperience.tsx`

### Frontend — Data
20. `src/data/emotionShiftData.ts` — Categories, scenarios, recommendations

### Files to Modify
21. `src/components/layout/AppShell.tsx` — Add EmotionShift nav item
22. `src/components/layout/Navbar.tsx` — Add EmotionShift link in public nav
23. `src/styles.css` — Add EmotionShift-specific CSS utilities

### Backend — New Files
24. `backend/src/routes/emotionshift.routes.js`
25. `backend/src/controllers/emotionshift.controller.js`

### Backend — Modified Files
26. `backend/src/app.js` — Mount new routes

---

## Implementation Order
1. ✅ Phase 1: Audit complete
2. 🔨 Phase 2: Data + Landing + 8 Category Cards + Nav integration
3. 🔨 Phase 3: Scenario listing + search/filter + routing
4. 🔨 Phase 4: 8+ interactive experiences
5. 🔨 Phase 5: Backend endpoints + session tracking
6. 🔨 Phase 6: Mood check-in + recommendations
7. 🔨 Phase 7: History + admin management
8. 🔨 Phase 8: Testing + polish
