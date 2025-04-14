/**
 * @module Tasks
 */
const {
  addTaskInDB,
  updateTaskInDB,
  findTaskByTaskId,
  deleteTaskInDB,
  getUserTasksFromDB,
} = require("../Services/MongoDB/TaskServices");

/**
 * Throws a task-related error.
 *
 * @param {String} message - Error message to throw.
 * @throws {TaskError} TaskError with the provided message.
 */
const throwTaskError = (message) => {
  const error = new Error(message);
  error.name = "TaskError";
  throw error;
};

/**
 * Adds a new task to the database.
 *
 * @param {Object} task - The task object to be added to the database.
 * @throws {TaskError} - Throws error as TaskError, if any errors occurs.
 * @returns {Object} An object containing a message indicating success.
 */
const addTaskFeature = async (task) => {
  if (!task || !task.entry) {
    throwTaskError("Task cannot be empty");
  }
  await addTaskInDB(task);
  return { message: "Task Added!" };
};

/**
 * Updates a task in the database by task ID.
 *
 * @param {String} taskId - The ID of the task to be updated.
 * @param {String} entry - The new entry for the task.
 * @throws {TaskError} - Throws error as TaskError, if any errors occurs.
 * @returns {Object} An object containing a message, and updated task data if successful.
 */
const updateTask = async (taskId, entry) => {
  if (!taskId) {
    throwTaskError("Task not found!");
  }
  if (!entry) {
    throwTaskError("Task cannot be empty");
  }
  const taskByTaskId = await findTaskByTaskId(taskId);
  if (!taskByTaskId) {
    throwTaskError("Task not found!");
  }
  const updatedTask = await updateTaskInDB(taskId, entry);

  return { message: "Task edited", data: updatedTask };
};

/**
 * Deletes a task from the database by task ID.
 *
 * @param {String} taskId - The ID of the task to be deleted.
 * @throws {TaskError} - Throws error as TaskError, if any errors occurs.
 * @returns {Object} An object containing a message and data indicating success.
 */
const deleteTaskFeature = async (taskId) => {
  if (!taskId) {
    throwTaskError("Task not found!");
  }
  const response = await findTaskByTaskId(taskId);
  if (!response) {
    throwTaskError("Task not found!");
  }
  const deletedTask = await deleteTaskInDB(taskId);
  return { message: "Task deleted", data: deletedTask };
};

/**
 * Retrieves all tasks of a user from the database.
 *
 * @param {String} email - The ID of the user whose tasks are to be retrieved.
 * @throws {TaskError} - Throws error as TaskError, if any errors occurs.
 * @returns {Object} An object containing a message and an array of task data.
 */
const getUserTasksFeature = async (email) => {
  const response = await getUserTasksFromDB(email);
  if (!response.length) {
    throwTaskError("No Tasks");
  }
  return { message: "User Tasks", data: response };
};

module.exports = {
  addTaskFeature,
  updateTask,
  deleteTaskFeature,
  getUserTasksFeature,
};
