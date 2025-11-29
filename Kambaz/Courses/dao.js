import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function CoursesDao(db) {
  async function findAllCourses() {
    const courses = await model.find({});
    return courses;
  }

  async function findCoursesForEnrolledUser(userId) {
    const enrollmentModel = db.collection("enrollments");
    const enrollments = await enrollmentModel.find({ user: userId }).toArray();
    const courseIds = enrollments.map((e) => e.course);
    const courses = await model.find({ _id: { $in: courseIds } });
    return courses;
  }

  async function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    const createdCourse = await model.create(newCourse);
    return createdCourse;
  }

  async function updateCourse(courseId, courseUpdates) {
    const result = await model.findByIdAndUpdate(courseId, courseUpdates, {
      new: true,
    });
    if (!result) {
      return { status: 404, message: "Course not found" };
    }
    return { status: 200, message: "Course updated successfully" };
  }

  async function deleteCourse(courseId) {
    const result = await model.deleteOne({ _id: courseId });
    if (result.deletedCount === 0) {
      return { status: 404, message: "Course not found" };
    }
    return { status: 200, message: "Course deleted successfully" };
  }

  return {
    findAllCourses,
    findCoursesForEnrolledUser,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
