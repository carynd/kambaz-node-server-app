import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(db) {
  function findAllCourses() {
    return db.courses;
  }

  function findCoursesForEnrolledUser(userId) {
    const { courses, enrollments } = db;
    const enrolledCourses = courses.filter((course) =>
      enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id)
    );
    return enrolledCourses;
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    db.courses.push(newCourse);
    return newCourse;
  }

  function updateCourse(courseId, courseUpdates) {
    const course = db.courses.find((course) => course._id === courseId);
    if (course) {
      Object.assign(course, courseUpdates);
      return { status: 200, message: "Course updated successfully" };
    }
    return { status: 404, message: "Course not found" };
  }

  function deleteCourse(courseId) {
    const index = db.courses.findIndex((course) => course._id === courseId);
    if (index !== -1) {
      db.courses.splice(index, 1);
      return { status: 200, message: "Course deleted successfully" };
    }
    return { status: 404, message: "Course not found" };
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
