import model from "./model.js";

export default function EnrollmentsDao(db) {
  // Find all courses for a given user
  async function findCoursesForUser(userId) {
    const enrollments = await model.find({ user: userId }).populate("course");
    return enrollments.map((enrollment) => enrollment.course);
  }

  // Find all users for a given course
  async function findUsersForCourse(courseId) {
    const enrollments = await model.find({ course: courseId }).populate("user");
    return enrollments.map((enrollment) => enrollment.user);
  }

  // Enroll a user in a course
  async function enrollUserInCourse(userId, courseId) {
    try {
      return await model.create({
        user: userId,
        course: courseId,
        _id: `${userId}-${courseId}`,
      });
    } catch (error) {
      // If duplicate key error (already enrolled), just return the existing enrollment
      if (error.code === 11000) {
        return await model.findOne({ user: userId, course: courseId });
      }
      throw error;
    }
  }

  // Unenroll a user from a course
  function unenrollUserFromCourse(user, course) {
    return model.deleteOne({ user, course });
  }

  // Unenroll all users from a course
  function unenrollAllUsersFromCourse(courseId) {
    return model.deleteMany({ course: courseId });
  }

  // Find all enrollments for a course
  function findEnrollmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  // Find all enrollments for a user
  function findEnrollmentsForUser(userId) {
    return model.find({ user: userId });
  }

  // Find all enrollments
  function findAllEnrollments() {
    return model.find({});
  }

  return {
    findCoursesForUser,
    findUsersForCourse,
    enrollUserInCourse,
    unenrollUserFromCourse,
    unenrollAllUsersFromCourse,
    findEnrollmentsForCourse,
    findEnrollmentsForUser,
    findAllEnrollments,
  };
}
