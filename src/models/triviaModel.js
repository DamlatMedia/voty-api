import mongoose from "mongoose";

const triviaSchema = new mongoose.Schema(
  {
    videoTitle: { type: String, required: true }, // Store title instead of ID
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
    ageCategory: { 
      type: String, 
      required: true, 
      enum: ["5-10", "11-20"] 
    },
  },
  { timestamps: true }
);

// Ensure videoId is always cast correctly
// triviaSchema.path("videoId").cast = (value) => new mongoose.Types.ObjectId(value);

export default mongoose.model("Trivia", triviaSchema);

