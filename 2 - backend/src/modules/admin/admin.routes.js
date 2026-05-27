import express from "express";
import { seedDatabase, purgeDatabase } from "./admin.controller.js";
import { verifyToken, verifyAdmin } from "../auth/auth.controller.js";

const router = express.Router();

// All admin routes require authentication
router.use(verifyToken, verifyAdmin);

router.post("/seed", seedDatabase);
router.post("/purge", purgeDatabase);

export default router;
