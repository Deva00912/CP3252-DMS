/**
 * @module Task-Service
 */

const mongoose = require("mongoose");
const { Task } = require("./Models/TaskModel");

mongoose.set("bufferCommands", true);

/**
 * Adds a new task to the database.
 *
 * @param {Object} task - The task object to be added to the database.
 * @returns {Promise<Task>} A Promise that resolves to the created task.
 */
const addTaskInDB = async (task) => {
  return await Task.create({
    ...task,
    taskId: new mongoose.Types.ObjectId(),
  });
};

/**
 * Updates a task in the database by task ID.
 *
 * @param {String} taskId - The ID of the task to be updated.
 * @param {String} entry - The new entry for the task.
 * @returns {Promise<Task | null>} A Promise that resolves to the updated task or null if not found.
 */
const updateTaskInDB = async (taskId, entry) => {
  return await Task.findOneAndUpdate(
    { taskId: taskId },
    { entry: entry },
    { new: true }
  );
};

/**
 * Deletes a task from the database by task ID.
 *
 * @param {String} taskId - The ID of the task to be deleted.
 * @returns {Promise<Task | null>} A Promise that resolves to the deleted task or null if not found.
 */
const deleteTaskInDB = async (taskId) => {
  return await Task.findOneAndDelete({ taskId: taskId });
};

/**
 * Finds a task in the database by task ID.
 *
 * @param {String} taskId - The ID of the task to be found.
 * @returns {Promise<Task | null>} A Promise that resolves to the found task or null if not found.
 */
const findTaskByTaskId = async (taskId) => {
  return await Task.findOne({ taskId: taskId });
};

/**
 * Retrieves all tasks of a user from the database.
 *
 * @param {String} email - The ID of the user whose tasks are to be retrieved.
 * @returns {Promise<Task[]>} A Promise that resolves to an array of task objects.
 */
const getUserTasksFromDB = async (email) => {
  return await Task.find({ email: email });
};

module.exports = {
  addTaskInDB,
  updateTaskInDB,
  deleteTaskInDB,
  findTaskByTaskId,
  getUserTasksFromDB,
};
