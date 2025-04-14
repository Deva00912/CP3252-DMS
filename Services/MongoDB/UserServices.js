/**
 * @module User-Service
 */

const mongoose = require("mongoose");
const { User } = require("./Models/UsersModel");

/**
 * Creates a new user in the database.
 *
 * @param {object} user - The user object to be created in the database.
 * @returns {Promise<User>} A Promise that resolves to the created user.
 */
const createUserInDB = async (user) => {
  return await User.create({
    ...user,
    userId: new mongoose.Types.ObjectId(),
  });
};

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<User[]>} A Promise that resolves to an array of user objects.
 */
const getAllUsersFromDB = async () => {
  return await User.find({});
};

/**
 * Retrieves a user from the database by email.
 *
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<User | null>} A Promise that resolves to the user object or null if not found.
 */
const getUserFromDB = async (email) => {
  return await User.findOne({ email: email });
};

module.exports = {
  createUserInDB,
  getAllUsersFromDB,
  getUserFromDB,
};
