import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Scholarship", scholarshipSchema);
