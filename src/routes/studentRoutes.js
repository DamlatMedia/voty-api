import express from "express";

import {
  studentReg,
  studentLogin,
  getOneStudent,
  deleteStudent,
  updateStudent
} from "../controllers/studentControllers.js";

import { authenticate } from "../middlewares/aunthenticate.js";
 
const router = express.Router();
//CRUD OPERATIONS

//POST-CREATE
// Define student registration route
router.post("/register", studentReg);

//Define student login route
router.post("/login", studentLogin);

//GET-READ
// Define route to get an student by id
router.route("/one-student/:id").get(authenticate, getOneStudent); 

// Define route to get an student by email, or username using query parameters
router.route("/one-student").get(authenticate, getOneStudent);

//GET-READ
// Define route to delete an student by id
router.route("/delete-student/:id").delete(authenticate, deleteStudent);

//UPDATE
// Define route to update an student by ID, protected by authentication
router.route("/update-student/:id").patch(authenticate, updateStudent);

//JESUS

export default router;
