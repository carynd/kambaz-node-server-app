import QuizzesDao from "./dao.js";

export default function QuizzesRoutes(app, db) {
  const dao = QuizzesDao(db);

  const findQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const quizzes = await dao.findQuizzesForCourse(cid);
    res.json(quizzes);
  };

  const findQuizById = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }
    res.json(quiz);
  };

  const createQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }
    const quizData = {
      ...req.body,
      createdBy: currentUser._id,
    };
    const newQuiz = await dao.createQuiz(quizData);
    res.json(newQuiz);
  };

  const updateQuiz = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const quiz = await dao.findQuizById(qid);
    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    const status = await dao.updateQuiz(qid, req.body);
    res.json(status);
  };

  const deleteQuiz = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const status = await dao.deleteQuiz(qid);
    res.json(status);
  };

  const publishQuiz = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const updatedQuiz = await dao.publishQuiz(qid);
    res.json(updatedQuiz);
  };

  const unpublishQuiz = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser || currentUser.role !== "FACULTY") {
      res.sendStatus(403);
      return;
    }

    const updatedQuiz = await dao.unpublishQuiz(qid);
    res.json(updatedQuiz);
  };

  const submitQuizAttempt = async (req, res) => {
    const { qid } = req.params;
    const { cid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser || currentUser.role !== "STUDENT") {
      res.sendStatus(403);
      return;
    }

    const { answers, score, totalPoints } = req.body;

    const attempt = await dao.submitQuizAttempt(
      qid,
      currentUser._id,
      cid,
      answers,
      score,
      totalPoints
    );
    res.json(attempt);
  };

  const getStudentAttempts = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.sendStatus(403);
      return;
    }

    const attempts = await dao.getStudentAttempts(qid, currentUser._id);
    res.json(attempts);
  };

  const getLastStudentAttempt = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.sendStatus(403);
      return;
    }

    const attempt = await dao.getLastStudentAttempt(qid, currentUser._id);
    res.json(attempt || null);
  };

  const getAttemptCount = async (req, res) => {
    const { qid } = req.params;
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      res.sendStatus(403);
      return;
    }

    const count = await dao.getAttemptCount(qid, currentUser._id);
    res.json({ count });
  };

  const getQuizAvailability = async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);

    if (!quiz) {
      res.status(404).json({ message: "Quiz not found" });
      return;
    }

    const availability = dao.getQuizAvailability(quiz);
    res.json(availability);
  };

  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.put("/api/quizzes/:qid/publish", publishQuiz);
  app.put("/api/quizzes/:qid/unpublish", unpublishQuiz);
  app.post("/api/courses/:cid/quizzes/:qid/submit", submitQuizAttempt);
  app.get("/api/quizzes/:qid/attempts", getStudentAttempts);
  app.get("/api/quizzes/:qid/last-attempt", getLastStudentAttempt);
  app.get("/api/quizzes/:qid/attempt-count", getAttemptCount);
  app.get("/api/quizzes/:qid/availability", getQuizAvailability);
}
