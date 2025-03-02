import ScholarshipWinner from "../models/ScholarshipWinner.js";
import User from "../models/User.js";
import Scholarship from "../models/Scholarship.js";
import sendEmail from "../utils/sendEmail.js"; // Email utility function
import moment from "moment";

export const selectScholarshipWinner = async (req, res) => {
  try {
    const month = moment().format("MMMM YYYY"); // e.g., "February 2025"

    // Ensure only one winner per month
    const existingWinner = await Scholarship.findOne({ month });
    if (existingWinner) {
      return res.status(400).json({ message: "Winner already selected for this month" });
    }

    // Get top 1000 students
    const topStudents = await User.find().sort({ score: -1 }).limit(1000);
    if (topStudents.length === 0) {
      return res.status(400).json({ message: "No students available for selection" });
    }

    // Randomly pick a winner
    const winner = topStudents[Math.floor(Math.random() * topStudents.length)];

    // Save winner to database
    const scholarship = new Scholarship({ month, winner: winner._id });
    await scholarship.save();

    // Send email notification
    await sendEmail(
      winner.email,
      "Congratulations! You Won the Scholarship",
      `Dear ${winner.firstName},\n\nCongratulations! You have been selected as the scholarship winner for ${month}!\n\nBest regards,\nVOTY Team`
    );

    res.status(201).json({ message: "Scholarship winner selected", winner });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getWinners = async (req, res) => {
  try {
    const winners = await Scholarship.find().populate("winner", "firstName lastName email");
    res.status(200).json(winners);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getTopStudents = async (req, res) => {
  try {
    const topStudents = await User.find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(1000);
    res.status(200).json(topStudents);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const selectWinner = async (req, res) => {
  try {
    const topStudents = await User.find({ score: { $gt: 0 } })
      .sort({ score: -1 })
      .limit(1000);

    if (topStudents.length === 0) {
      return res.status(400).json({ message: "No students eligible for scholarship" });
    }

    const winner = topStudents[Math.floor(Math.random() * topStudents.length)];

    const newWinner = new ScholarshipWinner({
      studentId: winner._id,
      name: winner.firstName + " " + winner.lastName,
      email: winner.email,
      date: new Date(),
    });

    await newWinner.save();

    // Send Email Notification
    sendEmail(
      winner.email,
      "Congratulations! 🎓",
      `Dear ${winner.firstName},\n\nYou have been selected as the scholarship winner for this month! 🎉`
    );

    res.status(200).json({ message: "Winner selected", winner });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
