import express from "express";
import { updateStudentProfile, updateStudentProfilePicture } from "../controllers/studentController.js";
import {
  studentReg,
  studentLogin,
  getOneStudent,
  deleteStudent,
  updateStudent,
  verifyEmail,
  requestPasswordReset,
  resetPassword
} from "../controllers/studentController.js";

import {
  // uploadVideo,
  getVideos,
  markAsWatched,
} from "../controllers/videoController.js";

// import { authenticate } from "../middlewares/authenticate.js";
import authMiddleware from "../middleware/studentMiddleware.js";
import { uploadProfilePic } from "../middleware/multer.js";

const router = express.Router();
//CRUD OPERATIONS

//POST-CREATE
// Define student registration route
router.post("/register", studentReg);

//Define student login route
router.post("/login", studentLogin);

//GET-READ
// Define route to get an student by id
// router.route("/one-student/:id").get(authMiddleware, getOneStudent); 
router.route("/one-student/:username").get(authMiddleware, getOneStudent);

// Define route to get an student by email, or username using query parameters
router.route("/one-student").get(authMiddleware, getOneStudent);

//GET-READ
// Define route to delete an student by id
router.route("/delete-student/:id").delete(authMiddleware, deleteStudent);

//UPDATE
// Define route to update an student by ID, protected by authentication
router.route("/update-student/:id").patch(authMiddleware, updateStudent);

//Video

router.put("/:id/watch", authMiddleware, markAsWatched);

// Update editable profile fields
router.route("/update-profile/:username").patch(  authMiddleware, updateStudentProfile);

// router.patch("/update-profile/:id", authMiddleware, updateStudentProfile);

// Update profile picture
router.route("/update-profile-picture").put(authMiddleware, uploadProfilePic.single("profilePicture"), updateStudentProfilePicture);

//Password

router.post("/forgot-password", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.route("/verify-email").post(verifyEmail);

//JESUS

export default router;
