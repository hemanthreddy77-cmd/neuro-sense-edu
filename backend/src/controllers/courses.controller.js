import { db, isFirebaseConfigured } from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import { devUsers } from "./auth.controller.js";

// Initial seed courses matching the frontend
const devCourses = new Map([
  [
    "c1",
    {
      id: "c1",
      title: "Modern Programming Foundations",
      category: "Programming",
      description: "Master the core building blocks of modern programming with adaptive lessons.",
      thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
      content: [
        { type: "video", data: "https://example.com/videos/lesson1.mp4", emotionTarget: "focused" },
        { type: "exercise", data: "Write a recursive Fibonacci function", emotionTarget: "confused" },
      ],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Beginner",
      lessons: 28,
      durationHours: 12,
      progress: 64,
      rating: 4.8,
    },
  ],
  [
    "c2",
    {
      id: "c2",
      title: "Artificial Intelligence Essentials",
      category: "Artificial Intelligence",
      description: "From neural nets to large language models — a curated AI journey.",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
      content: [
        { type: "video", data: "https://example.com/videos/ai-intro.mp4", emotionTarget: "curious" },
      ],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Intermediate",
      lessons: 36,
      durationHours: 18,
      progress: 32,
      rating: 4.9,
    },
  ],
  [
    "c3",
    {
      id: "c3",
      title: "Applied Data Science",
      category: "Data Science",
      description: "Real-world data wrangling, modeling, and visualization workflows.",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Intermediate",
      lessons: 42,
      durationHours: 22,
      progress: 78,
      rating: 4.7,
    },
  ],
  [
    "c4",
    {
      id: "c4",
      title: "Cyber Security Fundamentals",
      category: "Cyber Security",
      description: "Defensive thinking, threat modeling, and hands-on security labs.",
      thumbnail: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Advanced",
      lessons: 30,
      durationHours: 16,
      progress: 12,
      rating: 4.8,
    },
  ],
  [
    "c5",
    {
      id: "c5",
      title: "Cloud Computing in Practice",
      category: "Cloud Computing",
      description: "Design, deploy, and operate workloads on modern cloud platforms.",
      thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Intermediate",
      lessons: 26,
      durationHours: 14,
      progress: 45,
      rating: 4.6,
    },
  ],
  [
    "c6",
    {
      id: "c6",
      title: "IoT Systems & Edge Intelligence",
      category: "IoT Systems",
      description: "Build connected systems that learn at the edge — sensors to insights.",
      thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Advanced",
      lessons: 38,
      durationHours: 20,
      progress: 0,
      rating: 4.7,
    },
  ],
  [
    "c7",
    {
      id: "c7",
      title: "Full-Stack Development with React 19",
      category: "Web Development",
      description: "Build ultra-fast, server-rendered applications with modern state and API patterns.",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Intermediate",
      lessons: 48,
      durationHours: 24,
      progress: 52,
      rating: 4.9,
    },
  ],
  [
    "c8",
    {
      id: "c8",
      title: "Deep Learning & Neural Networks",
      category: "Artificial Intelligence",
      description: "Master PyTorch, transformer architectures, and computer vision models.",
      thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Advanced",
      lessons: 52,
      durationHours: 28,
      progress: 25,
      rating: 4.9,
    },
  ],
  [
    "c9",
    {
      id: "c9",
      title: "Neuroscience & Cognitive Computing",
      category: "Neuroscience",
      description: "Explore brainwave rhythms, EEG biofeedback, and emotion-shift computing.",
      thumbnail: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Beginner",
      lessons: 24,
      durationHours: 16,
      progress: 18,
      rating: 4.8,
    },
  ],
  [
    "c10",
    {
      id: "c10",
      title: "Quantum Computing & Algorithms",
      category: "Quantum Computing",
      description: "Quantum gates, superposition, and Grover's search algorithm made intuitive.",
      thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Advanced",
      lessons: 34,
      durationHours: 22,
      progress: 0,
      rating: 4.7,
    },
  ],
  [
    "c11",
    {
      id: "c11",
      title: "Mobile Architecture with Flutter & Dart",
      category: "Mobile Development",
      description: "Craft fluid 120fps cross-platform apps for iOS and Android with Clean Architecture.",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Intermediate",
      lessons: 32,
      durationHours: 18,
      progress: 35,
      rating: 4.8,
    },
  ],
  [
    "c12",
    {
      id: "c12",
      title: "Blockchain & Smart Contract Security",
      category: "Blockchain",
      description: "Develop decentralized protocols, audited Solidity contracts, and Web3 apps.",
      thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
      thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
      content: [],
      createdBy: "admin",
      createdAt: new Date().toISOString(),
      difficulty: "Advanced",
      lessons: 36,
      durationHours: 20,
      progress: 10,
      rating: 4.6,
    },
  ],
]);

/**
 * GET /api/courses
 * Fetch all available courses
 */
export async function getCourses(req, res) {
  try {
    if (isFirebaseConfigured && db) {
      const snapshot = await db.collection("courses").orderBy("createdAt", "desc").get();
      const courses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json({ success: true, count: courses.length, courses });
    }

    const courses = Array.from(devCourses.values());
    return res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    console.error("getCourses error:", error);
    return res.status(500).json({ error: "Failed to fetch courses", details: error.message });
  }
}

/**
 * GET /api/courses/:id
 * Fetch single course by ID
 */
export async function getCourseById(req, res) {
  try {
    const { id } = req.params;

    if (isFirebaseConfigured && db) {
      const doc = await db.collection("courses").doc(id).get();
      if (!doc.exists) {
        return res.status(404).json({ error: "Course not found" });
      }
      return res.json({ success: true, course: { id: doc.id, ...doc.data() } });
    }

    const course = devCourses.get(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    return res.json({ success: true, course });
  } catch (error) {
    console.error("getCourseById error:", error);
    return res.status(500).json({ error: "Failed to fetch course", details: error.message });
  }
}

/**
 * POST /api/courses
 * Create new course (admin only)
 */
export async function createCourse(req, res) {
  try {
    const { title, description, category, thumbnailUrl, content, difficulty, lessons, durationHours } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: "Title and Category are required" });
    }

    const courseId = req.body.id || `c_${uuidv4().slice(0, 8)}`;
    const image = req.body.thumbnail || req.body.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
    const courseData = {
      id: courseId,
      title,
      description: description || "",
      category,
      thumbnail: image,
      thumbnailUrl: image,
      content: Array.isArray(content) ? content : [],
      difficulty: difficulty || "Beginner",
      lessons: lessons ? Number(lessons) : 10,
      durationHours: durationHours ? Number(durationHours) : 5,
      progress: 0,
      rating: 5.0,
      createdBy: req.user?.uid || "admin",
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db) {
      await db.collection("courses").doc(courseId).set(courseData);
    } else {
      devCourses.set(courseId, courseData);
    }

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: courseData,
    });
  } catch (error) {
    console.error("createCourse error:", error);
    return res.status(500).json({ error: "Failed to create course", details: error.message });
  }
}

/**
 * PUT /api/courses/:id
 * Update existing course (admin only)
 */
export async function updateCourse(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: new Date().toISOString() };
    delete updates.id; // Prevent overwriting primary ID

    if (isFirebaseConfigured && db) {
      const ref = db.collection("courses").doc(id);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ error: "Course not found" });

      await ref.update(updates);
      const updated = await ref.get();
      return res.json({ success: true, course: { id: updated.id, ...updated.data() } });
    }

    const current = devCourses.get(id);
    if (!current) return res.status(404).json({ error: "Course not found" });

    const updated = { ...current, ...updates };
    devCourses.set(id, updated);
    return res.json({ success: true, course: updated });
  } catch (error) {
    console.error("updateCourse error:", error);
    return res.status(500).json({ error: "Failed to update course", details: error.message });
  }
}

/**
 * DELETE /api/courses/:id
 * Delete course (admin only)
 */
export async function deleteCourse(req, res) {
  try {
    const { id } = req.params;

    if (isFirebaseConfigured && db) {
      const ref = db.collection("courses").doc(id);
      const doc = await ref.get();
      if (!doc.exists) return res.status(404).json({ error: "Course not found" });
      await ref.delete();
      return res.json({ success: true, message: `Course ${id} deleted successfully` });
    }

    if (!devCourses.has(id)) {
      return res.status(404).json({ error: "Course not found" });
    }
    devCourses.delete(id);
    return res.json({ success: true, message: `Course ${id} deleted successfully` });
  } catch (error) {
    console.error("deleteCourse error:", error);
    return res.status(500).json({ error: "Failed to delete course", details: error.message });
  }
}

/**
 * POST /api/courses/:id/enroll
 * Enroll authenticated student into a course
 */
export async function enrollCourse(req, res) {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    if (isFirebaseConfigured && db) {
      // Check course exists
      const courseDoc = await db.collection("courses").doc(id).get();
      if (!courseDoc.exists) {
        return res.status(404).json({ error: "Course does not exist" });
      }

      // Add to user enrolledCourses
      const userRef = db.collection("users").doc(uid);
      const userDoc = await userRef.get();
      const enrolled = userDoc.exists && userDoc.data().enrolledCourses ? userDoc.data().enrolledCourses : [];

      if (!enrolled.includes(id)) {
        enrolled.push(id);
        await userRef.update({ enrolledCourses: enrolled });
      }

      return res.json({
        success: true,
        message: `Successfully enrolled in course ${id}`,
        enrolledCourses: enrolled,
      });
    }

    // Dev mode
    const user = devUsers.get(uid) || req.user;
    user.enrolledCourses = user.enrolledCourses || [];
    if (!user.enrolledCourses.includes(id)) {
      user.enrolledCourses.push(id);
    }
    devUsers.set(uid, user);

    return res.json({
      success: true,
      message: `Successfully enrolled in course ${id}`,
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error("enrollCourse error:", error);
    return res.status(500).json({ error: "Enrollment failed", details: error.message });
  }
}

export { devCourses };
