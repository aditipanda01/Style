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
import userFollowHandler from "./api/users/[id]/follow.js";
import designHandler from "./api/designs/index.js";
import designLikeHandler from "./api/designs/[id]/like.js";
import designSaveHandler from "./api/designs/[id]/save.js";
import designShareHandler from "./api/designs/[id]/share.js";
import designCommentHandler from "./api/designs/[id]/comment.js";
import designDeleteHandler from "./api/designs/[id]/index.js";
import collaborationRoutes from "./api/collaborations/index.js";
import notificationsRoutes from "./api/notifications/index.js";

// Create router for designs with sub-routes
const designsRouter = express.Router();

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
  console.log('🌐 Request from origin:', origin, 'Method:', req.method, 'Path:', req.path);
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (origin && origin.includes('localhost')) {
    // Allow any localhost origin for development
    res.setHeader("Access-Control-Allow-Origin", origin);
    console.log('✅ Allowed localhost origin:', origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight requests immediately
  if (req.method === "OPTIONS") {
    console.log('✈️ Preflight request handled');
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
// User routes
const usersRouter = express.Router();
usersRouter.use("/:id/follow", async (req, res, next) => {
  try {
    console.log('🎯 Follow route matched:', req.method, req.originalUrl, 'Params:', req.params);
    await userFollowHandler(req, res);
  } catch (error) {
    console.error('❌ Error in follow handler:', error);
    next(error);
  }
});
usersRouter.use("/", userRoutes);
app.use("/api/users", usersRouter);

// Design routes - register specific routes first, then general handler
// Use router.use() to match all methods for sub-routes
designsRouter.use("/:id/like", async (req, res, next) => {
  try {
    console.log('🎯 Like route matched:', req.method, req.originalUrl, 'Params:', req.params, 'ID:', req.params.id);
    await designLikeHandler(req, res);
  } catch (error) {
    console.error('❌ Error in like handler:', error);
    next(error);
  }
});
designsRouter.use("/:id/save", async (req, res, next) => {
  try {
    console.log('🎯 Save route matched:', req.method, req.originalUrl, 'Params:', req.params);
    await designSaveHandler(req, res);
  } catch (error) {
    console.error('❌ Error in save handler:', error);
    next(error);
  }
});
designsRouter.use("/:id/share", async (req, res, next) => {
  try {
    console.log('🎯 Share route matched:', req.method, req.originalUrl, 'Params:', req.params);
    await designShareHandler(req, res);
  } catch (error) {
    console.error('❌ Error in share handler:', error);
    next(error);
  }
});
designsRouter.use("/:id/comment", async (req, res, next) => {
  try {
    console.log('🎯 Comment route matched:', req.method, req.originalUrl, 'Params:', req.params);
    await designCommentHandler(req, res);
  } catch (error) {
    console.error('❌ Error in comment handler:', error);
    next(error);
  }
});
// Delete design route - must be before the general handler, only handles DELETE
designsRouter.delete("/:id", async (req, res, next) => {
  try {
    console.log('🎯 Delete design route matched:', req.method, req.originalUrl, 'Params:', req.params);
    await designDeleteHandler(req, res);
  } catch (error) {
    console.error('❌ Error in delete handler:', error);
    next(error);
  }
});
designsRouter.use("/", designHandler);
app.use("/api/designs", designsRouter);

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
