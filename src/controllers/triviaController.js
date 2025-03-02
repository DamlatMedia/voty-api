import Trivia from "../models/triviaModel.js";
import Student from "../models/studentModel.js";
import Video from "../models/videoModel.js";
import XLSX from "xlsx";

export const addTrivia = async (req, res) => {
  try {
    const { videoTitle, question, options, correctAnswer, ageCategory } = req.body;

    if (!videoTitle || !question || !options || !correctAnswer) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find the video by title
    const video = await Video.findOne({ title: videoTitle });
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Save the trivia with the video title
    const newTrivia = new Trivia({
      videoTitle,
      question,
      options,
      correctAnswer,  ageCategory 
    });

    await newTrivia.save();
    res.status(201).json({ message: "Trivia added successfully" });
  } catch (error) {
    console.error("Error adding trivia:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTriviaByVideo = async (req, res) => {
  try {
    // const { videoTitle } = req.param
     // Expect both videoTitle and ageCategory from parameters or query
    const { videoTitle, ageCategory } = req.params;
    const trivia = await Trivia.find({ videoTitle,  ageCategory});

    // const trivia = await Video.find({ title: videoTitle });

    if (!trivia.length) {
      return res.status(404).json({ message: "No trivia found for this video and age category" });
    }

    res.status(200).json(trivia);
  } catch (error) {
    res.status(500).json({ message: "Server error",  error: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    console.log("User:", req.user); // Debugging
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    let { videoTitle, ageCategory } = req.params;
    const { answer } = req.body;
    const studentId = req.user.id;

    // Normalize values
    videoTitle = videoTitle.trim();
    ageCategory = ageCategory.trim();

    console.log("Received answer:", answer, "for video:", videoTitle, "ageCategory:", ageCategory);
    console.log("Querying trivia with:", { videoTitle, ageCategory });

    const question = await Trivia.findOne({ videoTitle, ageCategory });
    if (!question) {
      console.error("No trivia found for query:", { videoTitle, ageCategory });
      return res.status(404).json({ message: "Trivia question not found" });
    }

    const isCorrect =
      answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();

    if (isCorrect) {
      await Student.findByIdAndUpdate(studentId, { $inc: { score: 10 } });
      return res.status(200).json({ correct: true, message: "Correct answer! 🎉" });
    }

    res.status(200).json({ correct: false, message: "Incorrect answer. ❌" });
  } catch (error) {
    console.error("Error in submitAnswer:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadTriviaExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data.length) {
      return res.status(400).json({ message: "Excel file is empty" });
    }

     // Expect Excel columns: videoTitle, question, option1, option2, option3, option4, correctAnswer, ageCategory

    const triviaList = data.map((row) => ({
      // videoId: row.videoId,
      videoTitle: row.videoTitle,
      question: row.question,
      options: [row.option1, row.option2, row.option3, row.option4],
      correctAnswer: row.correctAnswer,
      ageCategory: row.ageCategory, // Must be "5-10" or "11-18"
    }));

    await Trivia.insertMany(triviaList);

    res.status(201).json({ message: "Trivia questions uploaded successfully" });
  } catch (error) {
    console.error("Error uploading trivia excel:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
