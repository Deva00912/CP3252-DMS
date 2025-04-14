const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    taskId: { type: mongoose.Types.ObjectId, required: true, unique: true },
    email: { type: String, required: true },
    entry: {
      type: String,
      required: [true, "Write your task here"],
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = { Task };
