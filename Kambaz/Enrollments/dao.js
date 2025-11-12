import { v4 as uuidv4 } from "uuid";

export default function EnrollmentsDao(db) {
  function enrollUserInCourse(userId, courseId) {
    const newEnrollment = {
      _id: uuidv4(),
      user: userId,
      course: courseId,
    };
    db.enrollments = [...db.enrollments, newEnrollment];
    return newEnrollment;
  }

  function unenrollUserFromCourse(userId, courseId) {
    db.enrollments = db.enrollments.filter(
      (enrollment) => !(enrollment.user === userId && enrollment.course === courseId)
    );
    return { status: 200, message: "Unenrolled successfully" };
  }

  function findEnrollmentsForCourse(courseId) {
    return db.enrollments.filter((enrollment) => enrollment.course === courseId);
  }

  function findEnrollmentsForUser(userId) {
    return db.enrollments.filter((enrollment) => enrollment.user === userId);
  }

  function findAllEnrollments() {
    return db.enrollments;
  }

  return {
    enrollUserInCourse,
    unenrollUserFromCourse,
    findEnrollmentsForCourse,
    findEnrollmentsForUser,
    findAllEnrollments,
  };
}
