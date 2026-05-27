import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import passport from "passport";
import "./modules/auth/passport.config.js";
import logger from "../utils/logger.js";
import iotRoutes from "./modules/iot/iot.controller.rest.js";
import authRoutes from "./modules/auth/auth.routes.js";
import adminRoutes from "./modules/admin/admin.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());

// Passport middleware
app.use(passport.initialize());

// Middleware to log requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/iot", iotRoutes);

app.get("/api/v1/health", (req, res) => {
  logger.info("Health check: OK");
  res.json({ status: "online" });
});

// Serve static frontend files
const publicPath = path.join(__dirname, "../public");
app.use(express.static(publicPath));

// SPA fallback - serve index.html for all non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(publicPath, "index.html"));
  } else {
    next();
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`, err);
  res.status(500).json({ error: "Internal Server Error" });
});

export default app;
