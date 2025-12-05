import mongoose from "mongoose";
import studentQuizAttemptSchema from "./studentAttemptSchema.js";

const model = mongoose.model("StudentQuizAttemptModel", studentQuizAttemptSchema);

export default model;
