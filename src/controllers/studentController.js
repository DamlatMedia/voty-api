//import authentication dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/studentValidation.js";
import studentValidateSchema from "../utils/studentValidateSchema.js";
import { response } from "express";

const studentReg = async (req, res) => {
  const { error } = studentValidateSchema(registerSchema, req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  const { username, email, password, school, grade, address, gender, birth, number } = req.body;

  try {
    //find out if the student is already registered using email
    let student = await Student.findOne({ email });

    if (student) {
      return res.status(400).json({
        status: "error",
        message: "This email is already registered.",
        // message: responseMessages StudentExists,
      });
    } else {
      //find out if the student is already registered using username
      student = await Student.findOne({ username: username });
      if (student) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "username is already in use",
        });
      }

      // Compute age
      const today = new Date();
      const birthDate = new Date(birth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      let ageCategory = "unknown";
      if (age >= 5 && age <= 10) {
        ageCategory = "5-10";
      } else if (age >= 11 && age <= 20) {
        ageCategory = "11-20";
      } else {
        return res.status(400).json({ message: "Student age is out of allowed range" });
      }

      //create student and save details to database
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new student
      student = new Student({ username, email, password: hashedPassword, school, grade, address, gender, birth, number, ageCategory });
      await student.save();

      res.status(201).json({
        // message: responseMessages.studentRegistered,
        message: "Registration successful",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An error occurred during registration",
    });
  }
};

//student login controller
const studentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    //checking if the student exists
    let studentExists = await Student.findOne({ email });

    if (!studentExists) {
      return res.status(404).json({
        message: responseMessages.invalidCredentials,
      });
    }

    //checking if password is correct
    const confirmedPassword = await bcrypt.compare(
      password,
      studentExists.password
    );

    if (!confirmedPassword) {
      return res.status(401).json({
        message: responseMessages.invalidCredentials,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: studentExists._id, email: studentExists.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token expiration time
    );

    //send success message if credentials are correct
    return res.status(200).json({
      message: responseMessages.loginSuccess,
      studentData: studentExists,
      authToken: token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while processing your request.",
    });
  }
};

//student controller function to get all Students
const getStudents = async (req, res) => {
  try {
    //find out if all the student is already registered

    //query the Student model to return all student and store them in the student variable
    let student = await Student.find({});

    if (student) {
      return res.status(200).json({
        message: responseMessages.registeredStudents,
        studentData: student,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

//student controller function to get one student using id, email or username
const getOneStudent = async (req, res) => {
  try {
    const { id } = req.params; // Extract id from path parameters
    const { email, username } = req.query; // Extract email and username from query parameters

    // Validate input: At least one of id, email, or username must be provided
    if (!id && !email && !username) {
      return res.status(400).json({
        message:
          "At least one of id, email, or username is required to perform this query.",
      });
    }

    // Build a dynamic filter object
    const filter = {};
    if (id) filter._id = id;
    if (email) filter.email = email;
    if (username) filter.username = username;

    // Query the database using the filter
    const student = await Student.findOne(filter);

    // If student not found, return 404
    if (!student) {
      return res.status(404).json({
        message: "Student not found.",
      });
    }

    // Return found student data
    res.status(200).json({
      message: "Student found successfully.",
      studentData: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const deleteStudents = async (req, res) => {
  try {
    // Deletes all documents in the Student collection
    const result = await Student.deleteMany({});

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} Students deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};

//student controller function to get remove one student
const deleteStudent = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Student not found",
      });
    }

    await Student.findByIdAndDelete(id);

    res.status(200).json({
      status: "success",
      message: responseMessages.deletedSuccessfully,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};

const updateStudent = async (req, res) => {
  const { email, password, username } = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /student/:id

  try {
    // Check if the student exists
    const studentExists = await Student.findById(id);
    if (!studentExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "student not found",
      });
    }

    // Check if the email address already exists for another student
    if (email) {
      const emailExists = await Student.findOne({ email });
      if (emailExists && emailExists._id.toString() !== id) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "Another student has this email already",
        });
      }
    }

    // Prepare the update object
    const updateData = {};
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // Send response with updated student data
    return res.status(httpStatus.OK).json({
      status: "success",
      updatedData: updatedStudent,
    });
  } catch (error) {
    console.error(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
};

export {
  studentReg,
  studentLogin,
  getStudents,
  getOneStudent,
  deleteStudents,
  deleteStudent,
  updateStudent,
};
