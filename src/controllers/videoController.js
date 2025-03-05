import { v2 as cloudinary } from "cloudinary";
// import { upload } from "../middleware/uploadMiddleware.js";
import Video from "../models/videoModel.js";

// export const uploadVideo = async (req, res) => {
//   try {
//     if (!req.file) {
//       console.log("File not received at backend.");
//       return res.status(400).json({ message: "No file uploaded or empty file" });
//     }

//     console.log("Uploaded file received:", req.file); // Debugging log

//     // ✅ Upload video to Cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path, {
//       resource_type: "video",
//       folder: "voty_videos",
//     });

//     console.log("Cloudinary Upload Successful:", result.secure_url);

//     // ✅ Save video details in MongoDB
//     const newVideo = new Video({
//       title: req.body.title,
//       description: req.body.description,
//       videoUrl: result.secure_url, // Save the Cloudinary URL
//     });

//     await newVideo.save();

//     return res.status(201).json({
//       message: "Video uploaded and saved successfully",
//       video: newVideo,
//     });

//   } catch (error) {
//     console.error("Server error:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


export const getVideos = async (req, res) => {
  res.set('Cache-Control', 'no-store'); // Add this to prevent caching
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsWatched = async (req, res) => {
  try {
    console.log("Received request to mark video as watched:", req.params.id);
    console.log("User making the request:", req.user); // Debug log

    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Ensure `req.user` exists
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID found" });
    }

    if (!video.watchedBy.includes(req.user.id)) {
      video.watchedBy.push(req.user.id);
      await video.save();
    }

    res.status(200).json({ message: "Video marked as watched", video });
  } catch (error) {
    console.error("Error in markAsWatched:", error); // Log detailed error
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// export const uploadVideo = async (req, res) => {
//   try {
//     if (!req.file) {
//       console.log("File not received at backend.");
//       return res.status(400).json({ message: "No file uploaded or empty file" });
//     }

//     console.log("Uploaded file:", req.file); // Debugging log

//     const uploadStream = cloudinary.uploader.upload_stream(
//       { resource_type: "video", folder: "voty_videos" },
//       async (error, result) => {
//         if (error) {
//           console.error("Cloudinary upload error:", error);
//           return res.status(500).json({ message: "Cloudinary upload failed" });
//         }

//         try {
//           const newVideo = new Video({
//             title: req.body.title,
//             description: req.body.description,
//             videoUrl: result.secure_url, // Fixed reference
//           });

//           await newVideo.save();
//           return res.status(201).json({
//             message: "Video uploaded successfully",
//             video: newVideo,
//           });
//         } catch (dbError) {
//           console.error("Database save error:", dbError);
//           return res.status(500).json({ message: "Failed to save video to DB" });
//         }
//       }
//     );

//     uploadStream.end(req.file.buffer); // Correct placement

//   } catch (error) {
//     console.error("Server error:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// import Video from "../models/videoModel.js"; // Ensure the Video model is imported

