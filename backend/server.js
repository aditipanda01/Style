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

// Global middlewares
app.use(express.json());

// Setup CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));

app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}));

// Routes
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/register", registerRoute);
app.use("/api/users", userRoutes);

// Wrap design handler with router
const designRouter = express.Router();
designRouter.all("/", designHandler);
app.use("/api/designs", designRouter);

app.use("/api/collaborations", collaborationRoutes);
app.use("/api/notifications", notificationsRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("❌ DB connection error:", err);
});
