import express from "express";
<<<<<<< HEAD
import  authMiddleware  from "../middleware/authMiddleware.js";
import {upload} from "../middleware/uploadMiddleware.js";
=======
import { authenticate } from "../middlewares/authenticate.js";

>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab
import {
  adminReg,
  adminLogin,
  getAdmins,
  getOneAdmin,
  deleteAdmin,
  deleteAdmins,
<<<<<<< HEAD
  updateAdmin, 

} from "../controllers/adminController.js";
=======
  updateAdmin

} from "../controllers/adminController.js";

>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab
import {
  getStudents,
  getOneStudent,
  deleteStudent,
  deleteStudents,
} from "../controllers/studentController.js";

<<<<<<< HEAD
import {
  uploadVideo,
  getVideos,
  markAsWatched,
} from "../controllers/videoController.js";

=======
>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab
const router = express.Router();
//CRUD OPERATIONS

//POST-CREATE
// Define admin registration route
router.post("/register", adminReg);

//Define admin login route
router.post("/login", adminLogin);

//GET-READ
// Define route to get all admins 
<<<<<<< HEAD
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
=======
router.route("/all-admins").get(authenticate, getAdmins);

// Define route to get an admin by id
router.route("/one-admin/:id").get(authenticate, getOneAdmin); 

// Define route to get an admin by email, or username using query parameters
router.route("/one-admin").get(authenticate, getOneAdmin);

//GET-READ
// Define route to delete an admin by id
router.route("/delete-admin/:id").delete(authenticate, deleteAdmin);

// Define route to delete admins
router.route("/delete-admins").delete(authenticate, deleteAdmins);

//UPDATE
// Define route to update an admin by ID, protected by authentication
router.route("/update-admin/:id").patch(authenticate, updateAdmin);
>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab

/////////////////////////////////////////////////////////
//GET
// Define route to get all students 
<<<<<<< HEAD
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
router.post("/upload", authMiddleware, upload.single("video"), uploadVideo);
router.get("/", getVideos);

=======
router.route("/all-students").get(authenticate, getStudents);

// Define route to get an student by id
router.route("/one-student/:id").get(authenticate, getOneStudent); 

// Define route to get an student by email, or username using query parameters
router.route("/one-student").get(authenticate, getOneStudent);

//DELETE
// Define route to delete students
router.route("/delete-students").delete(authenticate, deleteStudents);

// Define route to delete an student by id
router.route("/delete-student/:id").delete(authenticate, deleteStudent);
>>>>>>> 909abeffd3e03f4a8a57a7be4944a2dffd62d1ab

export default router;
