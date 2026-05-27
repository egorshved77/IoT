import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import logger from "../../../utils/logger.js";
import { login } from "./auth.controller.js";

const router = express.Router();

router.post("/login", login);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          role: req.user.role,
          provider: req.user.provider,
        },
        process.env.JWT_SECRET || "secret-key",
        { expiresIn: "7d" }
      );

      logger.info(`OAuth login successful for: ${req.user.email}`);

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      res.redirect(`${frontendUrl}?token=${token}&user=${encodeURIComponent(JSON.stringify(req.user))}`);
    } catch (err) {
      logger.error(`OAuth callback error: ${err.message}`);
      res.redirect("/login?error=oauth_failed");
    }
  }
);

export default router;
