import mongoose from "mongoose";

const scholarshipWinnerSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const ScholarshipWinner = mongoose.model("ScholarshipWinner", scholarshipWinnerSchema);
export default ScholarshipWinner;
