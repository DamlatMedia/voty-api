import express from "express";

import {
  studentReg,
  studentLogin,
  getOneStudent,
  deleteStudent,
  updateStudent
} from "../controllers/studentController.js";

<<<<<<< HEAD
import {
  uploadVideo,
  getVideos,
  markAsWatched,
} from "../controllers/videoController.js";

// import { authenticate } from "../middlewares/authenticate.js";
import  authMiddleware from "../middleware/studentMiddleware.js";
=======
import { authenticate } from "../middlewares/authenticate.js";
>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab
 
const router = express.Router();
//CRUD OPERATIONS

//POST-CREATE
// Define student registration route
router.post("/register", studentReg);

//Define student login route
router.post("/login", studentLogin);

//GET-READ
// Define route to get an student by id
<<<<<<< HEAD
router.route("/one-student/:id").get(authMiddleware, getOneStudent); 

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
=======
router.route("/one-student/:id").get(authenticate, getOneStudent); 

// Define route to get an student by email, or username using query parameters
router.route("/one-student").get(authenticate, getOneStudent);

//GET-READ
// Define route to delete an student by id
router.route("/delete-student/:id").delete(authenticate, deleteStudent);

//UPDATE
// Define route to update an student by ID, protected by authentication
router.route("/update-student/:id").patch(authenticate, updateStudent);
>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab

//JESUS

export default router;
