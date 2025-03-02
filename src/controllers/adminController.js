// import authentication dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/adminValidation.js";
import adminValidateSchema from "../utils/adminValidateSchema.js";
import { response } from "express";

const adminReg = async (req, res) => {
  const { error } = adminValidateSchema(registerSchema, req.body);
  if (error) {
    return res
      .status(400)
      .json({ status: "error", message: error.details[0].message });
  }
  const { username, email, password } = req.body;

  try {
    //find out if the admin is already registered using email
    let existingAdminByEmail = await Admin.findOne({ email });

    if (existingAdminByEmail) {
      return res.status(400).json({
        status: "error",
        message: "This email is already registered.",
        // message: responseMessages.adminExists,
      });
    } else {
      //find out if the admin is already registered using username
      const existingAdminByUsername = await Admin.findOne({
        username: username,
      });
      if (existingAdminByUsername) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "username is already in use",
        });
      }

      //create admin and save details to database
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create a new admin
      // Create a new admin and save details to database
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword,
      });
      await newAdmin.save();

      res.status(201).json({
        message: responseMessages.adminRegistered,
      });
    }
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        status: "error",
        message: `${field} already exists. Please use a different value.`,
      });
    }
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during registration",
    });
  }
};
const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Checking if the admin exists
    let adminExists = await Admin.findOne({ email });

    if (!adminExists) {
      return res.status(404).json({
        message: responseMessages.invalidCredentials,
      });
    }

    // Checking if the password is correct
    const confirmedPassword = await bcrypt.compare(password, adminExists.password);

    if (!confirmedPassword) {
      return res.status(401).json({
        message: responseMessages.invalidCredentials,
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: adminExists._id, email: adminExists.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // Token expiration time
    );

    // Send success message if credentials are correct
    res.status(200).json({
      message: responseMessages.loginSuccess,
      adminData: adminExists,
      authToken: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

// const adminLogin = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     //checking if the admin exists
//     let adminExists = await Admin.findOne({ email });

//     if (!adminExists) {
//       res.status(404).json({
//         message: responseMessages.invalidCredentials,
//       });
//     }

//     //checking if password is correct
//     const confirmedPassword = await bcrypt.compare(
//       password,
//       adminExists.password
//     );

//     if (!confirmedPassword) {
//       res.status(401).json({
//         message: responseMessages.invalidCredentials,
//       });
//       return;
//     }

//     // Generate a JWT token
//     const token = jwt.sign(
//       { id: adminExists._id, email: adminExists.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "15m" } // Token expiration time
//     );

//     //send success message if credentials are correct
//     res.status(200).json({
//       message: responseMessages.loginSuccess,
//       adminData: adminExists,
//       authToken: token,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

//admin controller function to get all admins
const getAdmins = async (req, res) => {
  try {
    //find out if all the admin is already registered

    //query the Admin model to return all admin and store them in the admin variable
    let admin = await Admin.find({});

    if (admin) {
      return res.status(200).json({
        message: responseMessages.registeredadmins,
        adminData: admin,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

//admin controller function to get one admin using id, email or username
const getOneAdmin = async (req, res) => {
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
    const admin = await Admin.findOne(filter);

    // If admin not found, return 404
    if (!admin) {
      return res.status(404).json({
        message: "Admin not found.",
      });
    }

    // Return found admin data
    res.status(200).json({
      message: "Admin found successfully.",
      adminData: admin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

//admin controller function to get remove one admin
const deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id; // Extract the id from the request parameters
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        status: "fail",
        message: "Invalid ID: Admin not found",
      });
    }

    await Admin.findByIdAndDelete(id);

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

const deleteAdmins = async (req, res) => {
  try {
    // Deletes all documents in the Admin collection
    const result = await Admin.deleteMany({});

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} admins deleted successfully.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Server Error",
    });
  }
};

const updateAdmin = async (req, res) => {
  const { email, password, username } = req.body;
  const { id } = req.params; // Use params for ID if you're defining the route as /admin/:id

  try {
    // Check if the admin exists
    const adminExists = await Admin.findById(id);
    if (!adminExists) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "error",
        message: "admin not found",
      });
    }

    // Check if the email address already exists for another admin
    if (email) {
      const emailExists = await Admin.findOne({ email });
      if (emailExists && emailExists._id.toString() !== id) {
        return res.status(httpStatus.CONFLICT).json({
          status: "error",
          message: "Another admin has this email already",
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

    // Update admin
    const updatedAdmin = await Admin.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    // Send response with updated admin data
    return res.status(httpStatus.OK).json({
      status: "success",
      updatedData: updatedAdmin,
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
  adminReg,
  adminLogin,
  getAdmins,
  getOneAdmin,
  deleteAdmin,
  deleteAdmins,
  updateAdmin,
};
