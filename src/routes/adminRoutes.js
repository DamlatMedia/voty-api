import express from "express";
import  authMiddleware  from "../middleware/authMiddleware.js";

import {upload} from "../middleware/multer.js";
// import {upload} from "../middleware/uploadMiddleware.js";

import uploadToCloudinary from "../controllers/uploadController.js";
import {
  adminReg,
  adminLogin,
  getAdmins,
  getOneAdmin,
  deleteAdmin,
  deleteAdmins,
  updateAdmin, 
  updateAdminProfilePicture

} from "../controllers/adminController.js";
import {
  getStudents,
  getOneStudent,
  deleteStudent,
  deleteStudents,
} from "../controllers/studentController.js";

import {
  // uploadVideo,
  getVideos,
  markAsWatched,
} from "../controllers/videoController.js";

import { uploadAdminProfilePic } from "../middleware/multer.js";

const router = express.Router();
//CRUD OPERATIONS

// Update profile picture
router.route("/update-profile-picture/:username").put(authMiddleware, uploadAdminProfilePic.single("profilePicture"), updateAdminProfilePicture);


//POST-CREATE
// Define admin registration route
router.post("/register", adminReg);

//Define admin login route
router.post("/login", adminLogin);

//GET-READ
// Define route to get all admins 
router.route("/all-admins").get(authMiddleware, getAdmins);

// Define route to get an admin by id
router.route("/one-admin/:id").get(authMiddleware, getOneAdmin); 

// Define route to get an admin by email, or username using query parameters
router.route("/one-admin").get(authMiddleware, getOneAdmin);

//GET-READ
// Define route to delete an admin by id
router.route("/delete-admin/:id").delete(authMiddleware, deleteAdmin);

// Define route to delete admins
router.route("/delete-admins").delete(authMiddleware, deleteAdmins);

//UPDATE
// Define route to update an admin by ID, protected by authentication
router.route("/update-admin/:id").patch(authMiddleware, updateAdmin);

/////////////////////////////////////////////////////////
//GET
// Define route to get all students 
router.route("/all-students").get(authMiddleware, getStudents);

// Define route to get an student by id
router.route("/one-student/:id").get(authMiddleware, getOneStudent); 

// Define route to get an student by email, or username using query parameters
router.route("/one-student").get(authMiddleware, getOneStudent);

//DELETE
// Define route to delete students
router.route("/delete-students").delete(authMiddleware, deleteStudents);

// Define route to delete an student by id
router.route("/delete-student/:id").delete(authMiddleware, deleteStudent);


//Videos
// router.post("/upload", authMiddleware, upload.single("video"), uploadVideo);
router.get("/", getVideos);

// Upload Video
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded." });

    const result = await uploadToCloudinary(req.file.buffer, "voty_videos", "video");
    res.json({ message: "Video uploaded successfully", url: result.secure_url });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});


export default router;
