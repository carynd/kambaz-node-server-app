import PeopleDao from "./peopleDao.js";

export default function PeopleRoutes(app, db) {
  const dao = PeopleDao(db);

  const findUsersForCourse = (req, res) => {
    const { courseId } = req.params;
    const users = dao.findUsersForCourse(courseId);
    res.json(users);
  };

  const createUser = (req, res) => {
    const user = req.body;
    const newUser = dao.createUser(user);
    res.send(newUser);
  };

  const updateUser = (req, res) => {
    const { userId } = req.params;
    const userUpdates = req.body;
    const user = dao.updateUser(userId, userUpdates);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  };

  const deleteUser = (req, res) => {
    const { userId } = req.params;
    const status = dao.deleteUser(userId);
    res.send(status);
  };

  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  const findUserById = (req, res) => {
    const { userId } = req.params;
    const user = dao.findUserById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User not found" });
    }
  };

  app.get("/api/courses/:courseId/users", findUsersForCourse);
  app.post("/api/users", createUser);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
}
