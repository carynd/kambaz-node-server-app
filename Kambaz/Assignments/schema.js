import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    description: String,
    course: String,
    dueDate: Date,
    availableDate: Date,
    points: Number,
  },
  { collection: "assignments" }
);

export default assignmentSchema;
