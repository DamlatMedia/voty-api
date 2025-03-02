// import express from "express";
// import { selectScholarshipWinner, getWinners } from "../controllers/scholarshipController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/select", authMiddleware, selectScholarshipWinner); // Admin selects a winner
// router.get("/winners", getWinners); // Get past winners

// export default router;

import express from "express";
import { getTopStudents, selectWinner } from "../controllers/scholarshipController.js";
import { selectScholarshipWinner, getWinners } from "../controllers/scholarshipController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();
router.post("/select", authMiddleware, selectScholarshipWinner); // Admin selects a winner
router.get("/winners", getWinners); // Get past winners
router.get("/top-students", authMiddleware, adminMiddleware, getTopStudents);
router.post("/select-winner", authMiddleware, adminMiddleware, selectWinner);

export default router;
