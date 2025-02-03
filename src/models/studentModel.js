
import mongoose from "mongoose";

// Define schema for student user
const studentUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 10,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    number: {
      type: String,
      required: true,
      unique: true, 
      trim: true,
      match: [/^\+?\d{10,15}$/, "Please provide a valid phone number"],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 70,
    },
    birth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    school: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Create the admin model based on the schema
const Student = mongoose.model('Student', studentUserSchema);

// Export the user model
export default Student;
   
