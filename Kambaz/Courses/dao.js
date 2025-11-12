import { v4 as uuidv4 } from "uuid";
export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses;
  }
  function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = db;
  const enrolledCourses = courses.filter((course) =>
    enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
  return enrolledCourses;
}

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses = [...db.courses, newCourse];
    return newCourse;
  }

  function updateCourse(courseId, courseUpdates) {
    const courseIndex = db.courses.findIndex((course) => course._id === courseId);
    if (courseIndex === -1) {
      return { status: 404, message: "Course not found" };
    }
    db.courses[courseIndex] = { ...db.courses[courseIndex], ...courseUpdates };
    return { status: 200, message: "Course updated successfully" };
  }
function deleteCourse(courseId) {
    const { courses, enrollments } = db;
    db.courses = courses.filter((course) => course._id !== courseId);
    db.enrollments = enrollments.filter(
      (enrollment) => enrollment.course !== courseId
    );
    return { status: 200, message: "Course deleted successfully" };
  }
  return { findAllCourses, findCoursesForEnrolledUser, createCourse, updateCourse, deleteCourse };
}
