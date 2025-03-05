import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

export const transporter = nodemailer.createTransport({
//   service: "Gmail",
  host: "smtp.gmail.com", 
//   host: "Gmail",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password
  },
});