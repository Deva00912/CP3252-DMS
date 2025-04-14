const express = require("express");
require("dotenv").config();

const { getAllUsers, createUser } = require("../Repository/Controllers.js");
const { isUsernameExist } = require("../Repository/Controllers.js");
const { validateSchema } = require("../ApiValidation/ApiValidator.js");

/**
 * Identify and format authentication-related errors for response.
 *
 * @function
 * @name identifyAuthError
 * @param {object} error - The error object to be identified and formatted.
 * @returns {object} An object containing the status code and error message.
 *
 * @throws {object} Returns an object with a status code and error message based on the provided error object.
 *
 * @apiExample {js} Example usage:
 * const error = new Error("Authentication error");
 * error.name = "AuthError";
 * const result = identifyAuthError(error);
 * // Returns: { statusCode: 400, message: "Authentication error" }
 */
const identifyAuthError = (error) => {
  if (error.code === 11000) {
    return { statusCode: 400, message: "User already exists" };
  }
  if (error.name === "AuthError") {
    return { statusCode: 400, message: error.message };
  } else {
    return { statusCode: 500, message: error.message };
  }
};

const registerRouter = express.Router();

/**
 * @api {put} /createUser Create User
 * @apiName CreateUser
 * @apiGroup Authentication
 *
 * @apiParam {String} email User's unique email.
 * @apiParam {String} password User's password.
 * @apiParam {String} firstName User's first name.
 * @apiParam {String} lastName User's last name.
 * @apiParam {String} confirmPassword User's password confirmation.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "message": "User created",
 *   "ackStatus": "completed"
 * }
 *
 * @apiError (Error 400) InvalidUserDetails The provided user details are invalid.
 * @apiError (Error 400) UserAlreadyExists The user with the provided email already exists.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (InvalidUserDetails):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Enter details correctly",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (UserAlreadyExists):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "User already exists",
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
registerRouter.put(
  "/createUser",
  validateSchema("registerUser"),
  async (req, res) => {
    try {
      const { email, password, firstName, lastName, confirmPassword } =
        req.body;
      const response = await createUser({
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
      });

      return res
        .status(201)
        .json({ ...response, ackStatus: "completed" })
        .end();
    } catch (error) {
      console.log("error :>> ", error);
      const result = identifyAuthError(error);
      res
        .status(result.statusCode)
        .json({ message: result.message, ackStatus: "completed" })
        .end();
    }
  }
);

/**
 * @api {get} /getUsers Get Users
 * @apiName GetUsers
 * @apiGroup Authentication
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "All Users",
 *   "ackStatus": "completed"
 * }
 *
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (InternalServerError):
 * HTTP/1.1 500 Internal Server Error
 * {
 *   "message": "Internal server error message",
 *   "ackStatus": "completed"
 * }
 */
registerRouter.get("/getUsers", async (req, res) => {
  try {
    const response = await getAllUsers();
    res
      .status(200)
      .json({ ...response, ackStatus: "completed" })
      .end();
  } catch (error) {
    res.status(500).json(error.message).end();
  }
});

/**
 * @api {post} /isUserEmailExists Check email Availability
 * @apiName IsUsernameExists
 * @apiGroup Authentication
 *
 * @apiParam {String} email User's email to check.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 *
 * @apiSuccessExample {json} Success-Response (email is available):
 * HTTP/1.1 200 OK
 * {
 *   "message": "email is available",
 *   "ackStatus": "completed"
 * }
 *
 * @apiSuccessExample {json} Success-Response (email is not available):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "email is already in use",
 *   "ackStatus": "completed"
 * }
 *
 * @apiError (Error 400) InvalidUsername The provided email is invalid.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (InvalidUsername):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid email",
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
registerRouter.post(
  "/isUserEmailExists",
  validateSchema("isUserEmailAvailable"),
  async (req, res) => {
    try {
      const { email } = req.body;
      const response = await isUsernameExist(email);
      const statusCode = response.message === "email is available" ? 200 : 400;
      res
        .status(statusCode)
        .json({ ...response, ackStatus: "completed" })
        .end();
    } catch (error) {
      const result = identifyAuthError(error);
      res
        .status(result.statusCode)
        .json({ message: result.message, ackStatus: "completed" })
        .end();
    }
  }
);

module.exports = { registerRouter };
