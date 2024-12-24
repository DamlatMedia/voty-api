import express from "express";
import { authenticate } from "../middlewares/authenticate.js";

import {
  adminReg,
  adminLogin,
  getAdmins,
  getOneAdmin,
  deleteAdmin,
  deleteAdmins,
  updateAdmin

} from "../controllers/adminController.js";

import {
  getStudents,
  getOneStudent,
  deleteStudent,
  deleteStudents,
} from "../controllers/studentController.js";

const router = express.Router();
//CRUD OPERATIONS

//POST-CREATE
// Define admin registration route
router.post("/register", adminReg);

//Define admin login route
router.post("/login", adminLogin);

//GET-READ
// Define route to get all admins 
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

/////////////////////////////////////////////////////////
//GET
// Define route to get all students 
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

export default router;
