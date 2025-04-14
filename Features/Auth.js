/**
 * @module Authentication
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { regex } = require("../Services/Utils/Constants");

const {
  createUserInDB,
  getAllUsersFromDB,
  getUserFromDB,
} = require("../Services/MongoDB/UserServices");

/**
 * Validates user-entered details.
 *
 * @param {Object} userData - User data including email, firstName, lastName, password, and confirmPassword.
 * @returns {boolean} - `true` if the entered details are valid, otherwise `false`.
 */
const validate = (userData) => {
  return userData.email &&
    userData.firstName &&
    userData.lastName &&
    userData.password &&
    regex.email.test(userData.email) &&
    regex.password.test(userData.password) &&
    regex.text.test(userData.firstName) &&
    regex.text.test(userData.lastName)
    ? true
    : false;
};

/**
 * @param {string} email - The email to validate.
 * @returns {boolean} - `true` if the entered email is valid, otherwise `false`.
 */
const validateUserEmail = (email) => {
  return regex?.email.test(email) ? true : false;
};

/**
 * Throws an authentication error.
 *
 * @param {String} message - Error message to throw.
 * @throws {AuthError} Authentication error with the provided message.
 */
const throwAuthError = (message) => {
  const error = new Error(message);
  error.name = "AuthError";
  throw error;
};

/**
 * Creates a new user in the database.
 *
 * @param {Object} userData - User data to be created in the database.
 * @returns {Object} An object containing a message and user data.
 */
const putCreateUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  userData.password = encryptedPassword;

  const user = await createUserInDB(userData);
  user.token = generateJwtToken(user.userId, user.email);

  return { message: "User created", data: user };
};

/**
 * Retrieves all existing users in the database.
 *
 * @async
 * @throws {AuthError} Throws an error if there are no users in the database.
 * @returns {Object} An object containing a message and an array of user data.
 */
const getGetAllUsers = async () => {
  const allUsers = await getAllUsersFromDB();
  if (!allUsers?.length) {
    throwAuthError("No users");
  }
  return {
    message: "All Users",
    data: allUsers,
  };
};

/**
 * Checks if a email already exists in the database.
 *
 * @param {String} email - The email to check.
 * @returns {Object} An object with a message and data indicating the availability of the email.
 */
const postIsUserEmailExists = async (email) => {
  const response = await getUserFromDB(email);
  const message = !response ? "email is available" : "email is already in use";
  return {
    message: message,
    data: !response ? [] : response,
  };
};

/**
 * Checks user credentials and generates a JWT token for login.
 *
 * @param {String} email - The email to check.
 * @param {String} password - The user's password.
 * @throws {AuthError} Throws an error if no user exists in the database or invalid credentials.
 * @returns {Object} An object with a message and user data if login is successful.
 */
const checkPasswordAndLogin = async (email, password) => {
  const user = await getUserFromDB(email);
  if (!user) {
    throwAuthError("User does not exists");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    user.token = generateJwtToken(user.userId, user.email);
  } else {
    throwAuthError("Invalid credentials");
  }
  return {
    message: "Logged in",
    data: user,
  };
};

/**
 * Generates a JWT token for a user.
 *
 * @param {String} userId - The user's ID.
 * @param {String} email - The user's email.
 * @returns {String} The generated JWT token.
 */
const generateJwtToken = (userId, email) => {
  const token = jwt.sign({ userId, email }, process.env.TOKEN_KEY, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = {
  validate,
  validateUserEmail,
  putCreateUser,
  getGetAllUsers,
  postIsUserEmailExists,
  checkPasswordAndLogin,
};
