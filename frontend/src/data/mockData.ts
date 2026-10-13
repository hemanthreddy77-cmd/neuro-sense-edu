export type Difficulty = "Beginner" | "Intermediate" | "Advanced";
export type EmotionKey =
  "happy" | "focused" | "confused" | "bored" | "angry" | "curious" | "motivated";

export const EMOTIONS: Record<
  EmotionKey,
  { label: string; emoji: string; tokenClass: string; hex: string }
> = {
  happy: { label: "Happy", emoji: "😊", tokenClass: "emotion-happy", hex: "#5BE39A" },
  focused: { label: "Focused", emoji: "🎯", tokenClass: "emotion-focused", hex: "#52B8E6" },
  confused: { label: "Confused", emoji: "😕", tokenClass: "emotion-confused", hex: "#F2C94C" },
  bored: { label: "Bored", emoji: "😴", tokenClass: "emotion-bored", hex: "#F2994A" },
  angry: { label: "Angry", emoji: "😡", tokenClass: "emotion-angry", hex: "#EB5757" },
  curious: { label: "Curious", emoji: "🤔", tokenClass: "emotion-curious", hex: "#BB6BD9" },
  motivated: { label: "Motivated", emoji: "🚀", tokenClass: "emotion-motivated", hex: "#56CCF2" },
};

export type Course = {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail: string;
  progress: number;
  difficulty: Difficulty;
  durationHours: number;
  lessons: number;
  rating: number;
};

export const COURSES: Course[] = [
  {
    id: "c1",
    title: "Modern Programming Foundations",
    category: "Programming",
    description: "Master the core building blocks of modern programming with adaptive lessons.",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    progress: 64,
    difficulty: "Beginner",
    durationHours: 12,
    lessons: 28,
    rating: 4.8,
  },
  {
    id: "c2",
    title: "Artificial Intelligence Essentials",
    category: "Artificial Intelligence",
    description: "From neural nets to large language models — a curated AI journey.",
    thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    progress: 32,
    difficulty: "Intermediate",
    durationHours: 18,
    lessons: 36,
    rating: 4.9,
  },
  {
    id: "c3",
    title: "Applied Data Science",
    category: "Data Science",
    description: "Real-world data wrangling, modeling, and visualization workflows.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    progress: 78,
    difficulty: "Intermediate",
    durationHours: 22,
    lessons: 42,
    rating: 4.7,
  },
  {
    id: "c4",
    title: "Cyber Security Fundamentals",
    category: "Cyber Security",
    description: "Defensive thinking, threat modeling, and hands-on security labs.",
    thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
    progress: 12,
    difficulty: "Advanced",
    durationHours: 16,
    lessons: 30,
    rating: 4.8,
  },
  {
    id: "c5",
    title: "Cloud Computing in Practice",
    category: "Cloud Computing",
    description: "Design, deploy, and operate workloads on modern cloud platforms.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    progress: 45,
    difficulty: "Intermediate",
    durationHours: 14,
    lessons: 26,
    rating: 4.6,
  },
  {
    id: "c6",
    title: "IoT Systems & Edge Intelligence",
    category: "IoT Systems",
    description: "Build connected systems that learn at the edge — sensors to insights.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
    progress: 0,
    difficulty: "Advanced",
    durationHours: 20,
    lessons: 38,
    rating: 4.7,
  },
  {
    id: "c7",
    title: "Full-Stack Development with React 19",
    category: "Web Development",
    description: "Build ultra-fast, server-rendered applications with modern state and API patterns.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    progress: 52,
    difficulty: "Intermediate",
    durationHours: 24,
    lessons: 48,
    rating: 4.9,
  },
  {
    id: "c8",
    title: "Deep Learning & Neural Networks",
    category: "Artificial Intelligence",
    description: "Master PyTorch, transformer architectures, and computer vision models.",
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
    progress: 25,
    difficulty: "Advanced",
    durationHours: 28,
    lessons: 52,
    rating: 4.9,
  },
  {
    id: "c9",
    title: "Neuroscience & Cognitive Computing",
    category: "Neuroscience",
    description: "Explore brainwave rhythms, EEG biofeedback, and emotion-shift computing.",
    thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
    progress: 18,
    difficulty: "Beginner",
    durationHours: 16,
    lessons: 24,
    rating: 4.8,
  },
  {
    id: "c10",
    title: "Quantum Computing & Algorithms",
    category: "Quantum Computing",
    description: "Quantum gates, superposition, and Grover's search algorithm made intuitive.",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
    progress: 0,
    difficulty: "Advanced",
    durationHours: 22,
    lessons: 34,
    rating: 4.7,
  },
  {
    id: "c11",
    title: "Mobile Architecture with Flutter & Dart",
    category: "Mobile Development",
    description: "Craft fluid 120fps cross-platform apps for iOS and Android with Clean Architecture.",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
    progress: 35,
    difficulty: "Intermediate",
    durationHours: 18,
    lessons: 32,
    rating: 4.8,
  },
  {
    id: "c12",
    title: "Blockchain & Smart Contract Security",
    category: "Blockchain",
    description: "Develop decentralized protocols, audited Solidity contracts, and Web3 apps.",
    thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
    progress: 10,
    difficulty: "Advanced",
    durationHours: 20,
    lessons: 36,
    rating: 4.6,
  },
];

export type Activity = {
  id: string;
  course: string;
  emotion: EmotionKey;
  timestamp: string;
  durationMin: number;
};

export const RECENT_ACTIVITY: Activity[] = [
  {
    id: "a1",
    course: "Modern Programming Foundations",
    emotion: "focused",
    timestamp: "Today, 09:14",
    durationMin: 42,
  },
  {
    id: "a2",
    course: "Applied Data Science",
    emotion: "curious",
    timestamp: "Yesterday, 19:02",
    durationMin: 28,
  },
  {
    id: "a3",
    course: "Artificial Intelligence Essentials",
    emotion: "motivated",
    timestamp: "Yesterday, 14:30",
    durationMin: 55,
  },
  {
    id: "a4",
    course: "Cloud Computing in Practice",
    emotion: "confused",
    timestamp: "Mon, 11:18",
    durationMin: 18,
  },
  {
    id: "a5",
    course: "Cyber Security Fundamentals",
    emotion: "happy",
    timestamp: "Sun, 20:44",
    durationMin: 36,
  },
];

// 30 days of emotion logs
const today = new Date();
export const EMOTION_LOGS = Array.from({ length: 30 }).map((_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - (29 - i));
  const seed = (i + 1) * 7;
  return {
    date: d.toISOString().slice(0, 10),
    label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    happy: Math.round(30 + Math.sin(seed) * 12 + Math.random() * 10),
    focused: Math.round(50 + Math.cos(seed * 0.5) * 14 + Math.random() * 10),
    confused: Math.round(18 + Math.sin(seed * 1.3) * 8 + Math.random() * 6),
    bored: Math.round(10 + Math.cos(seed * 0.8) * 6 + Math.random() * 5),
    angry: Math.round(5 + Math.random() * 4),
    sessions: Math.round(2 + Math.abs(Math.sin(seed * 0.7)) * 4 + Math.random() * 2),
    minutes: Math.round(40 + Math.abs(Math.cos(seed * 0.6)) * 60 + Math.random() * 30),
  };
});

export const EMOTION_DISTRIBUTION = [
  { name: "Focused", value: 38, key: "focused" as EmotionKey },
  { name: "Happy", value: 22, key: "happy" as EmotionKey },
  { name: "Curious", value: 14, key: "curious" as EmotionKey },
  { name: "Confused", value: 12, key: "confused" as EmotionKey },
  { name: "Motivated", value: 9, key: "motivated" as EmotionKey },
  { name: "Bored", value: 5, key: "bored" as EmotionKey },
];

export type SessionRow = {
  id: string;
  date: string;
  course: string;
  duration: string;
  dominant: EmotionKey;
  status: "Completed" | "In Progress" | "Abandoned";
};

export const SESSION_HISTORY: SessionRow[] = [
  {
    id: "s1",
    date: "Dec 04, 2026",
    course: "AI Essentials",
    duration: "55m",
    dominant: "motivated",
    status: "Completed",
  },
  {
    id: "s2",
    date: "Dec 03, 2026",
    course: "Data Science",
    duration: "28m",
    dominant: "curious",
    status: "Completed",
  },
  {
    id: "s3",
    date: "Dec 02, 2026",
    course: "Programming",
    duration: "42m",
    dominant: "focused",
    status: "Completed",
  },
  {
    id: "s4",
    date: "Dec 01, 2026",
    course: "Cloud Computing",
    duration: "18m",
    dominant: "confused",
    status: "Abandoned",
  },
  {
    id: "s5",
    date: "Nov 30, 2026",
    course: "Cyber Security",
    duration: "36m",
    dominant: "happy",
    status: "Completed",
  },
  {
    id: "s6",
    date: "Nov 28, 2026",
    course: "IoT Systems",
    duration: "12m",
    dominant: "bored",
    status: "Abandoned",
  },
  {
    id: "s7",
    date: "Nov 27, 2026",
    course: "AI Essentials",
    duration: "48m",
    dominant: "focused",
    status: "Completed",
  },
  {
    id: "s8",
    date: "Nov 26, 2026",
    course: "Data Science",
    duration: "33m",
    dominant: "curious",
    status: "In Progress",
  },
];

export const ADMIN_USERS = [
  {
    id: "u1",
    name: "Aarav Mehta",
    email: "aarav@neurolearn.ai",
    role: "Student",
    lastActive: "2m ago",
    status: "Active",
  },
  {
    id: "u2",
    name: "Priya Sharma",
    email: "priya@neurolearn.ai",
    role: "Student",
    lastActive: "12m ago",
    status: "Active",
  },
  {
    id: "u3",
    name: "Daniel Okafor",
    email: "daniel@neurolearn.ai",
    role: "Student",
    lastActive: "1h ago",
    status: "Active",
  },
  {
    id: "u4",
    name: "Sofia Hernández",
    email: "sofia@neurolearn.ai",
    role: "Admin",
    lastActive: "3h ago",
    status: "Active",
  },
  {
    id: "u5",
    name: "Kenji Watanabe",
    email: "kenji@neurolearn.ai",
    role: "Student",
    lastActive: "1d ago",
    status: "Inactive",
  },
  {
    id: "u6",
    name: "Amara Diallo",
    email: "amara@neurolearn.ai",
    role: "Student",
    lastActive: "2d ago",
    status: "Active",
  },
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Anika Rao",
    role: "Computer Science Student",
    quote:
      "NeuroLearn AI noticed when I was getting stuck and slowed the lesson down. It feels like having a private tutor that actually pays attention.",
    rating: 5,
    avatar: "https://i.pravatar.cc/96?img=47",
  },
  {
    id: "t2",
    name: "Marcus Lee",
    role: "Bootcamp Instructor",
    quote:
      "The adaptive engine cut my drop-off rate almost in half. Students stay engaged because the platform meets them where they are.",
    rating: 5,
    avatar: "https://i.pravatar.cc/96?img=12",
  },
  {
    id: "t3",
    name: "Fatima Khan",
    role: "Data Science Learner",
    quote:
      "I love seeing my focus trend over the week. It's the first learning tool that's helped me actually understand how I learn.",
    rating: 5,
    avatar: "https://i.pravatar.cc/96?img=32",
  },
];

export const SYSTEM_HEALTH = [
  { id: "api", label: "API Service", status: "operational" as const, latency: "42ms" },
  { id: "db", label: "Database", status: "operational" as const, latency: "18ms" },
  { id: "ml", label: "ML Inference API", status: "operational" as const, latency: "120ms" },
  { id: "cdn", label: "CDN & Storage", status: "operational" as const, latency: "28ms" },
];

export const FLOATING_EMOTIONS: { key: EmotionKey; label: string; emoji: string }[] = [
  { key: "happy", label: "Happy", emoji: "😊" },
  { key: "focused", label: "Focused", emoji: "🎯" },
  { key: "curious", label: "Curious", emoji: "🤔" },
  { key: "confused", label: "Confused", emoji: "😕" },
  { key: "motivated", label: "Motivated", emoji: "🚀" },
];
