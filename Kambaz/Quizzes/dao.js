import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import studentAttemptModel from "./studentAttemptModel.js";

export default function QuizzesDao() {
  const findQuizzesForCourse = async (courseId) => {
    return await model.find({ course: courseId }).sort({ createdAt: -1 });
  };

  const findQuizById = async (quizId) => {
    return await model.findById(quizId);
  };

  const createQuiz = async (quiz) => {
    const newQuiz = {
      ...quiz,
      _id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await model.create(newQuiz);
  };

  const updateQuiz = async (quizId, quizUpdates) => {
    const result = await model.findByIdAndUpdate(
      quizId,
      { ...quizUpdates, updatedAt: new Date() },
      { new: true }
    );
    if (!result) {
      return { status: 404, message: "Quiz not found" };
    }
    return { status: 200, message: "Quiz updated successfully" };
  };

  const deleteQuiz = async (quizId) => {
    await model.findByIdAndDelete(quizId);
    return { status: 200, message: "Quiz deleted successfully" };
  };

  const publishQuiz = async (quizId) => {
    return await model.findByIdAndUpdate(
      quizId,
      { published: true, updatedAt: new Date() },
      { new: true }
    );
  };

  const unpublishQuiz = async (quizId) => {
    return await model.findByIdAndUpdate(
      quizId,
      { published: false, updatedAt: new Date() },
      { new: true }
    );
  };

  const submitQuizAttempt = async (quizId, studentId, courseId, answers, score, totalPoints) => {
    const percentageScore = totalPoints > 0 ? (score / totalPoints) * 100 : 0;

    const attemptCount = await studentAttemptModel.countDocuments({
      quizId,
      studentId,
    });

    const newAttempt = {
      _id: uuidv4(),
      quizId,
      studentId,
      courseId,
      attemptNumber: attemptCount + 1,
      answers,
      score,
      totalPoints,
      percentageScore,
      submittedAt: new Date(),
      createdAt: new Date(),
    };
    return await studentAttemptModel.create(newAttempt);
  };

  const getStudentAttempts = async (quizId, studentId) => {
    return await studentAttemptModel
      .find({ quizId, studentId })
      .sort({ attemptNumber: -1 });
  };

  const getLastStudentAttempt = async (quizId, studentId) => {
    return await studentAttemptModel
      .findOne({ quizId, studentId })
      .sort({ attemptNumber: -1 });
  };

  const getAttemptCount = async (quizId, studentId) => {
    return await studentAttemptModel.countDocuments({
      quizId,
      studentId,
    });
  };

  const getQuizAvailability = (quiz) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Helper function to parse date to date-only (no time)
    const parseDateOnly = (dateValue) => {
      if (!dateValue) return null;
      const date = new Date(dateValue);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const availableDate = parseDateOnly(quiz.availableDate);
    const availableUntilDate = parseDateOnly(quiz.availableUntilDate);
    const dueDate = parseDateOnly(quiz.dueDate);

    // Check if quiz is not yet available
    if (availableDate && today < availableDate) {
      return {
        status: `Not available until ${availableDate.toLocaleDateString()}`,
        canAccess: false,
      };
    }

    // Check if quiz is closed - use availableUntilDate first, then dueDate as fallback
    const closingDate = availableUntilDate || dueDate;
    if (closingDate && today > closingDate) {
      return { status: "Closed", canAccess: false };
    }

    return { status: "Available", canAccess: true };
  };

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
    submitQuizAttempt,
    getStudentAttempts,
    getLastStudentAttempt,
    getAttemptCount,
    getQuizAvailability,
  };
}
