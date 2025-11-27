import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao() {
  async function findAllCourses() {
    return await model.find({}, { name: 1, description: 1 });
  }

  // Kept for compatibility - routes now use enrollmentsDao.findCoursesForUser()
  async function findCoursesForEnrolledUser() {
    return await model.find({}, { name: 1, description: 1 });
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return await model.create(newCourse);
  }

  async function updateCourse(courseId, courseUpdates) {
    const result = await model.findByIdAndUpdate(courseId, courseUpdates, { new: true });
    if (!result) {
      return { status: 404, message: "Course not found" };
    }
    return { status: 200, message: "Course updated successfully" };
  }

  async function deleteCourse(courseId) {
    // Routes will handle enrollments deletion via enrollmentsDao
    await model.findByIdAndDelete(courseId);
    return { status: 200, message: "Course deleted successfully" };
  }

  return { findAllCourses, findCoursesForEnrolledUser, createCourse, updateCourse, deleteCourse };
}
