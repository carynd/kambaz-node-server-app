import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export default function AssignmentsDao(db) {
  async function findAssignmentsForCourse(courseId) {
    const assignments = await model.find({ course: courseId });
    return assignments;
  }

  async function createAssignment(assignment) {
    const newAssignment = { ...assignment, _id: uuidv4() };
    const createdAssignment = await model.create(newAssignment);
    return createdAssignment;
  }

  async function deleteAssignment(assignmentId) {
    const result = await model.deleteOne({ _id: assignmentId });
    if (result.deletedCount === 0) {
      return { status: 404, message: "Assignment not found" };
    }
    return { status: 200, message: "Assignment deleted successfully" };
  }

  async function updateAssignment(assignmentId, assignmentUpdates) {
    const result = await model.findByIdAndUpdate(
      assignmentId,
      assignmentUpdates,
      { new: true }
    );
    if (!result) {
      return { status: 404, message: "Assignment not found" };
    }
    return result;
  }

  return {
    findAssignmentsForCourse,
    createAssignment,
    deleteAssignment,
    updateAssignment,
  };
}
