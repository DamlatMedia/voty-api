import express from "express";
import {upload} from "../middleware/uploadMiddleware.js";
import {
  uploadVideo,
  getVideos,
  markAsWatched,
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.post("/upload", authMiddleware, upload.single("video"), uploadVideo);
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/", getVideos);
router.put("/:id/watch", authMiddleware, markAsWatched);

export default router;
