import { v4 as uuidv4 } from "uuid";

export default function PeopleDao(db) {
  function findUsersForCourse(courseId) {
    const { users, enrollments } = db;
    const enrolledUserIds = enrollments
      .filter((e) => e.course === courseId)
      .map((e) => e.user);
    return users.filter((user) => enrolledUserIds.includes(user._id));
  }

  function createUser(user) {
    const newUser = { ...user, _id: uuidv4() };
    db.users = [...db.users, newUser];
    return newUser;
  }

  function updateUser(userId, userUpdates) {
    const userIndex = db.users.findIndex((user) => user._id === userId);
    if (userIndex === -1) {
      return null;
    }
    db.users[userIndex] = { ...db.users[userIndex], ...userUpdates };
    return db.users[userIndex];
  }

  function deleteUser(userId) {
    const initialLength = db.users.length;
    db.users = db.users.filter((user) => user._id !== userId);
    if (db.users.length < initialLength) {
      return { status: 200, message: "User deleted successfully" };
    }
    return { status: 404, message: "User not found" };
  }

  function findAllUsers() {
    return db.users;
  }

  function findUserById(userId) {
    return db.users.find((user) => user._id === userId);
  }

  return {
    findUsersForCourse,
    createUser,
    updateUser,
    deleteUser,
    findAllUsers,
    findUserById,
  };
}
