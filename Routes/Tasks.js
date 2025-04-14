const express = require("express");
const jwtAuth = require("../ApiValidation/Auth/authJwt.js");
const { addTask } = require("../Repository/Controllers.js");
const { editTask } = require("../Repository/Controllers.js");
const { deleteTask } = require("../Repository/Controllers.js");
const { getUserTask } = require("../Repository/Controllers.js");
const { validateSchema } = require("../ApiValidation/ApiValidator.js");

/**
 * Identify and format task-related errors for response.
 *
 * @function
 * @name identifyTasksErrors
 * @param {object} error - The error object to be identified and formatted.
 * @returns {object} An object containing the status code and error message.
 *
 * @throws {object} Returns an object with a status code and error message based on the provided error object.
 *
 * @apiExample {js} Example usage:
 * const error = new Error("Task not found!");
 * error.name = "TaskError";
 * const result = identifyTasksErrors(error);
 * // Returns: { statusCode: 400, message: "Task not found!" }
 */
const identifyTasksErrors = (error) => {
  if (error.name === "TaskError") {
    return { statusCode: 400, message: error.message };
  } else {
    return { statusCode: 500, message: error.message };
  }
};

const tasksRouter = express.Router();

/**
 * @api {put} /addTask Add Task
 * @apiName AddTask
 * @apiGroup Tasks
 *
 * @apiHeader {String} Authorization User's JWT token.
 *
 * @apiParam {Object} task Task object with details to be added to the database.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "message": "Task Added!",
 *   "ackStatus": "completed"
 * }
 *
 * @apiError (Error 400) InvalidTaskDetails The provided task details are invalid.
 * @apiError (Error 401) Unauthorized Unauthorized access.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (InvalidTaskDetails):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Task cannot be empty",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (Unauthorized):
 * HTTP/1.1 401 Unauthorized
 * {
 *   "message": "Unauthorized access",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (InternalServerError):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Internal server error message",
 *   "ackStatus": "completed"
 * }
 */
tasksRouter.put(
  "/addTask",
  validateSchema("newTasks"),
  jwtAuth,
  async (req, res) => {
    try {
      const task = req.body;
      const response = await addTask(task);
      res
        .status(201)
        .json({ ...response, ackStatus: "completed" })
        .end();
    } catch (error) {
      const result = identifyTasksErrors(error);

      res
        .status(result.statusCode)
        .json({ message: result.message, ackStatus: "completed" })
        .end();
    }
  }
);

/**
 * @api {patch} /editTask Edit Task
 * @apiName EditTask
 * @apiGroup Tasks
 *
 * @apiHeader {String} Authorization User's JWT token.
 *
 * @apiParam {String} taskId ID of the task to be updated.
 * @apiParam {String} entry New entry for the task.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 * @apiSuccess {Object} data Updated task data.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Task edited",
 *   "ackStatus": "completed",
 *   "data": { updated task data }
 * }
 *
 * @apiError (Error 400) TaskNotFound The provided task ID is not found.
 * @apiError (Error 400) InvalidTaskDetails The provided task details are invalid.
 * @apiError (Error 401) Unauthorized Unauthorized access.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (TaskNotFound):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Task not found!",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (InvalidTaskDetails):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Task cannot be empty",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (Unauthorized):
 * HTTP/1.1 401 Unauthorized
 * {
 *   "message": "Unauthorized access",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (InternalServerError):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Internal server error message",
 *   "ackStatus": "completed"
 * }
 */
tasksRouter.patch(
  "/editTask",
  validateSchema("editTask"),
  jwtAuth,
  async (req, res) => {
    try {
      const { taskId, entry } = req.body;
      const response = await editTask(taskId, entry);
      res
        .status(200)
        .json({ ...response, ackStatus: "completed" })
        .end();
    } catch (error) {
      const result = identifyTasksErrors(error);
      res
        .status(result.statusCode)
        .json({ message: result.message, ackStatus: "completed" })
        .end();
    }
  }
);

/**
 * @api {delete} /deleteTask/:id Delete Task
 * @apiName DeleteTask
 * @apiGroup Tasks
 *
 * @apiHeader {String} Authorization User's JWT token.
 *
 * @apiParam {String} id Task ID to be deleted.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Task deleted",
 *   "ackStatus": "completed"
 * }
 *
 * @apiError (Error 401) Unauthorized Unauthorized access.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (Unauthorized):
 * HTTP/1.1 401 Unauthorized
 * {
 *   "message": "Unauthorized access",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (InternalServerError):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Internal server error message",
 *   "ackStatus": "completed"
 * }
 */
tasksRouter.delete("/deleteTask/:id", jwtAuth, async (req, res) => {
  try {
    const taskId = req.params.id;
    const response = await deleteTask(taskId);
    res
      .status(200)
      .json({ ...response, ackStatus: "completed" })
      .end();
  } catch (error) {
    const result = identifyTasksErrors(error);
    res
      .status(result.statusCode)
      .json({ message: result.message, ackStatus: "completed" })
      .end();
  }
});

/**
 * @api {get} /findUserTasks/:id Find User Tasks
 * @apiName FindUserTasks
 * @apiGroup Tasks
 *
 * @apiHeader {String} Authorization User's JWT token.
 *
 * @apiParam {String} id User ID to find tasks for.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 * @apiSuccess {Object[]} data Array of task data.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "User Tasks",
 *   "ackStatus": "completed",
 *   "data": []
 * }
 *
 * @apiError (Error 401) Unauthorized Unauthorized access.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (Unauthorized):
 * HTTP/1.1 401 Unauthorized
 * {
 *   "message": "Unauthorized access",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (InternalServerError):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Internal server error message",
 *   "data": [],
 *   "ackStatus": "completed"
 * }
 */
tasksRouter.post("/findUserTasks/", jwtAuth, async (req, res) => {
  try {
    const email = req.body.email;
    const response = await getUserTask(email);
    res
      .status(200)
      .json({ ...response, ackStatus: "completed" })
      .end();
  } catch (error) {
    const result = identifyTasksErrors(error);
    res
      .status(result.statusCode)
      .json({ message: result.message, data: [], ackStatus: "completed" })
      .end();
  }
});

module.exports = {
  tasksRouter,
};
