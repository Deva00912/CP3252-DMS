const express = require("express");
const { validateLogin } = require("../Repository/Controllers.js");
const { validateSchema } = require("../ApiValidation/ApiValidator.js");

const identifyAuthError = (error) => {
  if (error.name === "AuthError") {
    return { statusCode: 400, message: error.message };
  } else {
    return { statusCode: 500, message: error.message };
  }
};

const loginRouter = express.Router();

/**
 * @api {post} /authUserAndLogin Authenticate User and Login
 * @apiName AuthUserAndLogin
 * @apiGroup Authentication
 *
 * @apiParam {Object} req.body User's credentials.
 * @apiParam {String} req.body.email User's email.
 * @apiParam {String} req.body.password User's password.
 *
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} ackStatus Acknowledgment status.
 * @apiSuccess {String} token User's authentication token.
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "message": "Logged in",
 *   "ackStatus": "completed",
 *   "token": "User authentication token"
 * }
 *
 * @apiError (Error 400) InvalidUsername The provided email is invalid.
 * @apiError (Error 400) InvalidCredentials The provided credentials are invalid.
 * @apiError (Error 500) InternalServerError An internal server error occurred.
 *
 * @apiErrorExample {json} Error-Response (InvalidUsername):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid email",
 *   "ackStatus": "completed"
 * }
 *
 * @apiErrorExample {json} Error-Response (InvalidCredentials):
 * HTTP/1.1 400 Bad Request
 * {
 *   "message": "Invalid credentials",
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
loginRouter.post(
  "/authUserAndLogin",
  validateSchema("loginUser"),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const response = await validateLogin(email, password);
      res
        .status(200)
        .json({ ...response, ackStatus: "completed" })
        .end();
    } catch (error) {
      console.log("error", error);
      const result = identifyAuthError(error);
      res
        .status(result.statusCode)
        .json({ message: result.message, ackStatus: "completed" })
        .end();
    }
  }
);

module.exports = {
  loginRouter,
};
