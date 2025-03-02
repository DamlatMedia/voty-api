import express from "express";
// import {upload} from "../middleware/uploadMiddleware.js";

import upload from "../middleware/multer.js";
import uploadToCloudinary from "../controllers/uploadController.js";
import {
  // uploadVideo,
  getVideos,
  markAsWatched,
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import Video from "../models/videoModel.js";

const router = express.Router();

// router.post("/upload", authMiddleware, upload.single("video"), uploadVideo);
// router.post("/upload", upload.single("video"), uploadVideo);
router.get("/", getVideos);
router.put("/:id/watch", authMiddleware, markAsWatched);
// router.post("/upload", upload.single("video"), async (req, res) => {
//   try {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded." });

//     const result = await uploadToCloudinary(req.file.buffer, "voty_videos", "video");
//     res.json({ message: "Video uploaded successfully", url: result.secure_url });
//   } catch (error) {
//     res.status(500).json({ message: "Upload failed", error: error.message });
//   }
// });

router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("File not received at backend.");
      return res.status(400).json({ message: "No file uploaded or empty file" });
    }

    console.log("Uploaded file received:", req.file); // Debugging log

    // ✅ Upload video to Cloudinary
    // const result = await cloudinary.uploader.upload(req.file.path, {
    //   resource_type: "video",
    //   folder: "voty_videos",
    // });

    
    const result = await uploadToCloudinary(req.file.buffer, "voty_videos", "video");

    console.log("Cloudinary Upload Successful:", result.secure_url);

    // ✅ Save video details in MongoDB
    const newVideo = new Video({
      title: req.body.title,
      description: req.body.description,
      videoUrl: result.secure_url, // Save the Cloudinary URL
    });

    await newVideo.save();

    return res.status(201).json({
      message: "Video uploaded and saved successfully",
      video: newVideo,
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
