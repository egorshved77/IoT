import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import logger from "../../../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"; // Change this!

// Simple in-memory user (in production, use database)
const users = {
  admin: {
    password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
    role: "admin",
  },
};

logger.info(`Admin user initialized with password hash`);

const login = (req, res) => {
  const { username, password } = req.body;

  logger.info(`Login attempt for user: ${username}`);

  if (!username || !password) {
    logger.warn(`Login failed: missing credentials`);
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = users[username];

  if (!user) {
    logger.warn(`Login failed: user ${username} not found`);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  logger.debug(`Password match for ${username}: ${passwordMatch}`);

  if (!passwordMatch) {
    logger.warn(`Login failed: invalid password for user ${username}`);
    return res.status(401).json({ error: "Invalid credentials" });
  }

  logger.info(`Login successful for user: ${username}`);
  const token = jwt.sign(
    { username, role: user.role },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.json({ token, user: { username, role: user.role } });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

export { login, verifyToken, verifyAdmin, JWT_SECRET };
