import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

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

  return {
    findQuizzesForCourse,
    findQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    publishQuiz,
    unpublishQuiz,
  };
}
