
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
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String, required: false },
    passwordResetToken: String,
    passwordResetExpires: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
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
    ageCategory: {
      type: String,
      required: true,
      enum: ["5-10", "11-20", "unknown"]
    },
    score: { type: Number, default: 0 },
    profilePicture: { type: String, default: "" },
    notificationInvestments: [
      {
        update: String,
        title: String,
        description: String,
        read: { type: Boolean, default: false },  // ✅ Add this
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Create the admin model based on the schema
const Student = mongoose.model('Student', studentUserSchema);

// Export the user model
export default Student;

