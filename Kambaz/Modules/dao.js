import { v4 as uuidv4 } from "uuid";
import moduleModel from "./model.js";

export default function ModulesDao() {
  async function createModule(courseId, module) {
    const newModule = { ...module, _id: uuidv4(), course: courseId };
    const createdModule = await moduleModel.create(newModule);
    return createdModule;
  }

  async function findModulesForCourse(courseId) {
    const modules = await moduleModel.find({ course: courseId });
    return modules;
  }

  async function deleteModule(courseId, moduleId) {
    const result = await moduleModel.deleteOne({ _id: moduleId, course: courseId });
    if (result.deletedCount === 0) {
      return { status: 404, message: "Module not found" };
    }
    return { status: 200, message: "Module deleted successfully" };
  }

  async function updateModule(courseId, moduleId, moduleUpdates) {
    const result = await moduleModel.findByIdAndUpdate(
      moduleId,
      moduleUpdates,
      { new: true }
    );
    if (!result || result.course !== courseId) {
      return { status: 404, message: "Module not found" };
    }
    return { status: 200, message: "Module updated successfully" };
  }

  return {
    createModule,
    findModulesForCourse,
    deleteModule,
    updateModule,
  };
}
