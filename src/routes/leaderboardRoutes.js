import express from "express";
import { getLeaderboard, getUserRank } from "../controllers/leaderboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import studentMiddleware from "../middleware/studentMiddleware.js";

const router = express.Router();

// Public leaderboard with optional query parameter: ?ageCategory=5-10 or 11-18
router.get("/", getLeaderboard); // Public leaderboard

// Get logged-in user's rank (requires authentication), with query parameter for ageCategory
router.get("/rank", studentMiddleware, getUserRank); // Get logged-in user's rank
// router.get("/rank", authMiddleware, getUserRank); // Get logged-in user's rank

export default router;
