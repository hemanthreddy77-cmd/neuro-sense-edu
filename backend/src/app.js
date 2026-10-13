import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import coursesRoutes from "./routes/courses.routes.js";
import sessionsRoutes from "./routes/sessions.routes.js";
import emotionsRoutes from "./routes/emotions.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import emotionshiftRoutes from "./routes/emotionshift.routes.js";

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Request logger
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// CORS setup matching user specification
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".lovable.app") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev to avoid blocking frontend integration
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "NeuroLearn AI Backend",
  });
});

// Mount API routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/emotions", emotionsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/emotionshift", emotionshiftRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use((err, req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(err.status || 500).json({
    error: err.name || "Internal Server Error",
    message: err.message || "An unexpected error occurred.",
  });
});

export default app;
