import express from "express";
import {
  addTrivia,
  getTriviaByVideo,
  submitAnswer,
  uploadTriviaExcel,
} from "../controllers/triviaController.js";
import studentMiddleware from "../middleware/studentMiddleware.js";

import {upload} from "../middleware/multer.js";
import authMiddleware from "../middleware/authMiddleware.js"; // for admin routes (bulk upload)
// import {uploadTrivia} from "../middleware/uploadMiddleware.js"; // Middleware for file uploads

import uploadToCloudinary from "../controllers/uploadController.js";

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
// router.post("/upload-excel", authMiddleware, uploadTrivia.single("file"), uploadTriviaExcel);

// Upload Trivia File (Excel or CSV)
router.post("/upload-trivia", upload.single("trivia"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    // Optional: Add your own MIME type validation logic here
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
      "application/vnd.ms-excel", // .xls
      "text/csv", // .csv
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type." });
    }

    const result = await uploadToCloudinary(req.file.buffer, "voty_trivia_files", "raw");
    res.json({ message: "Trivia file uploaded successfully", url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});
export default router;
