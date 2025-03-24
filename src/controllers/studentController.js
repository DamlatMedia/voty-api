//import authentication dependencies
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Student from "../models/studentModel.js";
import responseMessages from "../views/responseMessages.js";
import httpStatus from "http-status";
import { registerSchema } from "../validations/studentValidation.js";
import studentValidateSchema from "../utils/studentValidateSchema.js";
import { response } from "express";
import cloudinary from "../middleware/uploadMiddleware.js";
import crypto from "crypto";
import axios from "axios";


import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../services/emailService.js";
// import upload from "../middleware/multer.js";
// import uploadToCloudinary from "../controllers/uploadController.js";


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

      // Generate verification token
      const verificationToken = (
        (parseInt(crypto.randomBytes(3).toString("hex"), 16) % 900000) +
        100000
      ).toString();

      const verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Create a new student
      student = new Student({
        username, email, password: hashedPassword, school, grade, address, gender, birth, number, ageCategory,
        verificationToken,            // Save the token here
        verificationTokenExpiresAt,
      });
      await student.save();

      await sendVerificationEmail(student.email, verificationToken);

      res.status(201).json({
        // message: responseMessages.studentRegistered,
        message: "Registration successful",
        isVerified: student.isVerified,
        email: student.email, // Include the email
        verificationToken: student.verificationToken,
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
      { expiresIn: "1D" } // Token expiration time
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

const updateStudentPayment = async (req, res) => {
  try {
    // Expecting the client to send { isPaid: true } in the body
    const { isPaid } = req.body;
    const { username } = req.params; // Username in URL

    console.log("updatePaymentStatus called");
    console.log("Received username:", username);
    console.log("Received body:", req.body);
    // Ensure the authenticated student is updating their own payment status
    // if (!req.user || !req.user.username) {
    //   return res.status(401).json({ message: "Unauthorized. User not authenticated." });
    // }
    // if (req.user.username !== username) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }
    // Update the student's payment flag
    const updatedStudent = await Student.findOneAndUpdate(
      { username },
      // { $set: { isPaid: isPaid } },

      { $set: { isPaid } },
      { new: true }
    );
    if (!updatedStudent) {
      console.error("Student not found for username:", username);
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student updated:", updatedStudent);
    res.status(200).json({
      message: "Payment status updated successfully",
      updatedData: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyStudentPayment = async (req, res) => {
  const { reference } = req.body;

  try {
    console.log("Received reference:", reference); // Debugging

    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
    });

    console.log("Paystack response:", response.data); // Debugging

    if (response.data.status === true && response.data.data.status === "success") {
      const customerEmail = response.data.data.customer.email;

      if (!customerEmail) {
        return res.status(400).json({ success: false, message: "Customer email not found in Paystack response!" });
      }

      // Update the user's payment status in the database
      await Student.findOneAndUpdate({ email: customerEmail }, { isPaid: true });

      return res.json({ success: true, message: "Payment verified!" });
    } else {
      return res.status(400).json({ success: false, message: "Payment verification failed!" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.response?.data || error.message,
    });
  }
};

// const verifyStudentPayment = async (req, res) => {
//   const { reference } = req.body;

//   try {
//     console.log("Received reference:", reference); // Debugging

//     const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
//       headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}` }
//     });

//     console.log("Paystack response:", response.data); // Debugging
//     console.log("Paystack Secret:", process.env.PAYSTACK_SECRET);

//     // Ensure the response status is true and transaction is successful
//     if (response.data.status === true && response.data.data.status === "success") {
//       // Update user payment status in the database
//       await Student.findOneAndUpdate({ email: req.user.email }, { isPaid: true });

//       return res.json({ success: true, message: "Payment verified!" });
//     } else {
//       return res.status(400).json({ success: false, message: "Payment verification failed!" });
//     }
//   } catch (error) {
//     console.error("Error verifying payment:", error.response?.data || error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.response?.data || error.message,
//     });
//   }
// };



const verifyEmail = async (req, res) => {
  const { email, verificationToken } = req.body;

  if (!email || !verificationToken) {
    return res
      .status(400)
      .json({ message: "Email and verification token are required." });
  }

  try {
    // Find user by email and check if token matches
    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or token." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified." });
    }

    if (user.verificationToken !== verificationToken) {
      return res.status(400).json({ message: "Invalid verification token." });
    }

    if (Date.now() > user.verificationTokenExpiresAt) {
      return res.status(400).json({ message: "Verification token expired." });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpiresAt = null;
    await user.save();

    // Send a welcome email
    await sendWelcomeEmail(user.email, user.username, user.lastname);

    res.status(200).json({ message: "Email successfully verified." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};

// Request user Password Reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Student.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found with this email.",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = resetTokenHash;
    // user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min expiration
    user.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // 1 day expiration

    await user.save();
    console.log("Reset token stored in DB:", user.passwordResetToken);

    // Send password reset email
    const resetLink = `http://localhost:8000/reset-password?token=${resetToken}&email=${email}`;
    // const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
      status: "success",
      message: "Password reset link has been sent to your email.",
    });
  } catch (error) {
    console.error("Error requesting password reset:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  const { token, email, newPassword } = req.body;

  console.log("Received token:", token);
  console.log("Email:", email);
  console.log("New password:", newPassword);

  try {
    if (!token || !email || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "All fields are required.",
      });
    }

    const user = await Student.findOne({ email });

    // Ensure the user exists
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found.",
      });
    }

    // Ensure the user has reset token and expiration fields
    if (!user.passwordResetToken || !user.passwordResetExpires) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token.",
      });
    }

    console.log("Hashed token from DB:", user.passwordResetToken);
    console.log("Received raw token:", token);
    console.log("Stored hashed token in DB:", user.passwordResetToken);
    console.log(
      "Token expiration time:",
      new Date(user.passwordResetExpires).toISOString()
    );
    console.log("Current time:", new Date(Date.now()).toISOString());

    // Hash the received token to compare with the stored hashed token
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    console.log("Computed hash of received token:", resetTokenHash);

    // Compare the hashes to verify the reset token
    if (resetTokenHash !== user.passwordResetToken) {
      return res.status(400).json({
        status: "error",
        message: "Invalid reset token.",
      });
    }

    // Check if the token has expired
    if (Date.now() > user.passwordResetExpires) {
      return res.status(400).json({
        status: "error",
        message: "Reset token expired.",
      });
    }

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Reset the password reset fields
    user.passwordResetToken = null; // Explicitly set to null
    user.passwordResetExpires = null; // Explicitly set to null

    await user.save();
    console.log("Password successfully updated for user:", email);

    // Send password reset success email
    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      status: "success",
      message:
        "Password reset successful. You can now log in with your new password.",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
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

const getOneStudent = async (req, res) => {
  try {
    const { username } = req.params; // Extract username from URL
    const user = await Student.findOne({ username });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch profile data.",
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

export const updateStudentProfile = async (req, res) => {
  try {
    const { number, address, school, grade } = req.body;
    // const usernameParam = req.params; // Get username from URL
    const { username } = req.params;

    // Ensure the authenticated student is updating their own profile using username
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. User not authenticated." });
    }

    // if (req.user.username !== usernameParam) {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    const updateData = {};
    if (number) updateData.number = number;
    if (address) updateData.address = address;
    if (school) updateData.school = school;
    if (grade) updateData.grade = grade;

    // Update using username as unique identifier
    const updatedStudent = await Student.findOneAndUpdate(
      // { username: usernameParam },
      { username },
      { $set: updateData },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      updatedData: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateStudentProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded or empty file" });
    }

    // Upload the image to Cloudinary (adjust folder name and resource_type as needed)
    cloudinary.uploader.upload_stream(
      { folder: "student_profiles", resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }


        console.log("Cloudinary Upload Result:", result); // Debugging log

        const { username } = req.params;
        const usernameParam = req.params.username;

        // Use username instead of _id for updating
        const updatedStudent = await Student.findOneAndUpdate(
          // { username: req.user.username },
          { username },

          { $set: { profilePicture: result.secure_url } },
          { new: true }
        );

        console.log("Updated Student:", updatedStudent); // Debugging log
        if (!updatedStudent) {
          return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({
          message: "Profile picture updated successfully",
          profilePicture: result.secure_url,
        });
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export {
  // getOneStudents,
  verifyStudentPayment,
  updateStudentPayment,
  studentReg,
  studentLogin,
  getStudents,
  getOneStudent,
  deleteStudents,
  deleteStudent,
  updateStudent,
  verifyEmail,
  requestPasswordReset,
  resetPassword
};
