import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// Routes
import loginRoute from "./api/auth/login.js";
import registerRoute from "./api/auth/register.js";
import userRoutes from "./api/users/profile.js";
import designHandler from "./api/designs/index.js";
import collaborationRoutes from "./api/collaborations/index.js";
import notificationsRoutes from "./api/notifications/index.js";

// Initialize express app
const app = express();

// Parse incoming JSON
app.use(express.json());

// -------------------- 🧩 FIXED CORS CONFIG --------------------
const allowedOrigins = [
  "https://style-ten-ecru.vercel.app", // ✅ current frontend
  "http://localhost:5173"              // for local testing
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests immediately
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
// ---------------------------------------------------------------

// Security and rate limiting
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}));

// -------------------- ROUTES --------------------
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/register", registerRoute);
app.use("/api/users", userRoutes);
app.use("/api/designs", designHandler);
app.use("/api/collaborations", collaborationRoutes);
app.use("/api/notifications", notificationsRoutes);

// Root route for testing
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// -------------------- DATABASE CONNECTION --------------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ DB connection error:", err);
  });
