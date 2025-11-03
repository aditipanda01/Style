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
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://style-9hutx2mlj-aditipanda01s-projects.vercel.app", // ✅ new frontend
  "https://style-840q62hgc-aditipanda01s-projects.vercel.app", // old one
  "https://style-bcgu.onrender.com",
  "http://localhost:5173"
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));


// Security and rate limiting
app.use(helmet());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
}));

// Routes
app.use("/api/auth/login", loginRoute);
app.use("/api/auth/register", registerRoute);
app.use("/api/users", userRoutes);

// Designs route
app.use("/api/designs", designHandler); // designHandler should be an express.Router

app.use("/api/collaborations", collaborationRoutes);
app.use("/api/notifications", notificationsRoutes);

// Optional: root route to test deployment
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Connect to MongoDB and start server
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
