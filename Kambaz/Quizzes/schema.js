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
    quizType: { type: String, default: "Graded Quiz" },
    points: { type: Number, default: 0 },
    assignmentGroup: { type: String, default: "Quizzes" },
    shuffleAnswers: { type: Boolean, default: true },
    timeLimit: { type: Number, default: 20 },
    multipleAttempts: { type: Boolean, default: false },
    howManyAttempts: { type: Number, default: 1 },
    showCorrectAnswers: { type: String, default: "Immediately" },
    accessCode: { type: String, default: "" },
    oneQuestionAtATime: { type: Boolean, default: true },
    webcamRequired: { type: Boolean, default: false },
    lockQuestionsAfterAnswering: { type: Boolean, default: false },
    dueDate: Date,
    availableDate: Date,
    availableUntilDate: Date,
    published: { type: Boolean, default: false },
    numQuestions: { type: Number, default: 0 },
    questions: [questionSchema],
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { collection: "quizzes" }
);

export default quizSchema;
