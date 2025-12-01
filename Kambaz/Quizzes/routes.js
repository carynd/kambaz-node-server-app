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

  app.get("/api/courses/:cid/quizzes", findQuizzesForCourse);
  app.get("/api/quizzes/:qid", findQuizById);
  app.post("/api/courses/:cid/quizzes", createQuiz);
  app.put("/api/quizzes/:qid", updateQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz);
  app.put("/api/quizzes/:qid/publish", publishQuiz);
  app.put("/api/quizzes/:qid/unpublish", unpublishQuiz);
}
