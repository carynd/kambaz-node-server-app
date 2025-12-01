import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    id: String,
    type: { type: String, enum: ["multiple-choice", "true-false", "fill-blank"], default: "multiple-choice" },
    title: String,
    points: { type: Number, default: 1 },
    question: String,
    correctAnswer: String,
    choices: [String],
    possibleAnswers: [String],
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    _id: String,
    title: { type: String, default: "Untitled Quiz" },
    course: String,
    description: String,
    availableDate: Date,
    availableUntilDate: Date,
    dueDate: Date,
    published: { type: Boolean, default: false },
    points: { type: Number, default: 0 },
    numQuestions: { type: Number, default: 0 },
    questions: [questionSchema],
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "quizzes" }
);

export default quizSchema;
