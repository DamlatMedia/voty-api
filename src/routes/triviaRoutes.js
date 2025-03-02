

import express from "express";
import {
  addTrivia,
  getTriviaByVideo,
  submitAnswer,
  uploadTriviaExcel,
} from "../controllers/triviaController.js";
import studentMiddleware from "../middleware/studentMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js"; // for admin routes (bulk upload)
import {uploadTrivia} from "../middleware/uploadMiddleware.js"; // Middleware for file uploads

const router = express.Router();

// router.post("/add",  addTrivia); // Add trivia manually
// router.get("/video/:videoTitle", getTriviaByVideo); // Fetch trivia for a specific video
// router.post("/video/:videoTitle/answer", studentMiddleware, submitAnswer); // Submit answer

// router.post(
//   "/upload-excel",
//   authMiddleware,
//   uploadTrivia.single("file"), // Use multer for Excel upload
//   uploadTriviaExcel
// ); // Bulk upload via Excel


// Admin adds trivia manually
router.post("/add", authMiddleware, addTrivia);
// Fetch trivia for a video by age category; pass both videoTitle and ageCategory in the URL
router.get("/video/:videoTitle/:ageCategory", getTriviaByVideo);
// Students submit an answer, passing videoTitle and ageCategory in the URL
router.post("/video/:videoTitle/:ageCategory/answer", studentMiddleware, submitAnswer);

// Bulk upload via Excel (admin only)
router.post("/upload-excel", authMiddleware, uploadTrivia.single("file"), uploadTriviaExcel);

export default router;
