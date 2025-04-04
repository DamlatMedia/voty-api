import express from "express";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config(); 

const router = express.Router();
router.route('/api/contact').post(async (req, res) => {
  const { firstName, lastName, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,  // use your email
      pass: process.env.EMAIL_PASS // use your email app password (not normal password)
    }
  });

  const mailOptions = {
    from: email,
    to: 'damlatmedia@gmail.com',  // Admin email
    subject: 'New Voty Inquiry',
    text: `
      New Inquiry from:
      Name: ${firstName} ${lastName}
      Email: ${email}
      Message: ${message}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send message. Please try again later.' });
  }
});

export default router

