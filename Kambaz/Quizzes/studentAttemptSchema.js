import mongoose from "mongoose";

const studentQuestionAnswerSchema = new mongoose.Schema(
  {
    questionId: String,
    questionType: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    pointsEarned: { type: Number, default: 0 },
  },
  { _id: false }
);

const studentQuizAttemptSchema = new mongoose.Schema(
  {
    _id: String,
    quizId: String,
    studentId: String,
    courseId: String,
    attemptNumber: { type: Number, default: 1 },
    answers: [studentQuestionAnswerSchema],
    score: { type: Number, default: 0 },
    totalPoints: { type: Number, default: 0 },
    percentageScore: { type: Number, default: 0 },
    submittedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "student_quiz_attempts" }
);

export default studentQuizAttemptSchema;
