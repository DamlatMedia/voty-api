// import Student from "../models/studentModel.js";

// export const getLeaderboard = async (req, res) => {
//   try {
//     const leaderboard = await Student.find()
//       .sort({ score: -1 }) // Sort by highest score
//       .limit(1000)
//       .select("firstName lastName score"); // Only return necessary fields

//     res.status(200).json(leaderboard);
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const getUserRank = async (req, res) => {
//   try {
//     const users = await Student.find().sort({ score: -1 });
//     const rank = users.findIndex((user) => user.id === req.user.id) + 1;

//     res.status(200).json({ rank });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };


import Student from "../models/studentModel.js";

export const getLeaderboard = async (req, res) => {
  try {
    const { ageCategory } = req.query; // Use query parameter to filter, e.g., /api/leaderboard?ageCategory=5-10
    const filter = ageCategory ? { ageCategory } : {};

    const leaderboard = await Student.find(filter)
      .sort({ score: -1 })
      .limit(1000)
      .select("username score ageCategory");

    res.status(200).json(leaderboard);
  } catch (error) {
    console.error("Leaderboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserRank = async (req, res) => {
  try {
    const { ageCategory } = req.query; // e.g., /api/leaderboard/rank?ageCategory=5-10
    const filter = ageCategory ? { ageCategory } : {};
    const users = await Student.find(filter).sort({ score: -1 });
    const rank = users.findIndex((user) => user.id === req.user.id) + 1;

    res.status(200).json({ rank });
  } catch (error) {
    console.error("User rank error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
