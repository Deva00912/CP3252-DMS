const crypto = require("crypto");

const regex = {
  email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
  text: /^[a-zA-Z]{1,}$/,
};

const makeString = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};

const Allowed = {
  Uppers: "QWERTYUIOPASDFGHJKLZXCVBNM",
  Lowers: "qwertyuiopasdfghjklzxcvbnm",
  Numbers: "1234567890",
  Symbols: "!@#$%^&*",
};

const getRandomCharFromString = (str) =>
  str.charAt(Math.floor(crypto.randomInt(0, str.length)));
/**
 * the generated password will be @param length, which default to 8,
 * and will have at least one upper, one lower, one number and one symbol
 * @param {number} length - password's length
 * @returns a generated password
 */
const generatePassword = (length = 8) => {
  let pwd = "";
  pwd += getRandomCharFromString(Allowed.Uppers); // pwd will have at least one upper
  pwd += getRandomCharFromString(Allowed.Lowers); // pwd will have at least one lower
  pwd += getRandomCharFromString(Allowed.Numbers); // pwd will have at least one number
  pwd += getRandomCharFromString(Allowed.Symbols); // pwd will have at least one symbol
  for (let i = pwd.length; i < length; i++)
    pwd += getRandomCharFromString(Object.values(Allowed).join("")); // fill the rest of the pwd with random characters
  return pwd;
};

const createTestUser = {
  email: `${crypto.randomBytes(8).toString("hex")}@email.com`,
  firstName: `${makeString(10)}`,
  lastName: `${makeString(10)}`,
  password: `${generatePassword(10)}`,
};

const testUser1 = {
  email: `${crypto.randomBytes(8).toString("hex")}@email.com`,
  firstName: `${makeString(10)}`,
  lastName: `${makeString(10)}`,
  password: "Hello#World12",
  confirmPassword: "Hello#World12",
};

const testUser2 = {
  firstName: "Dokja",
  lastName: "Kim",
  email: "kimdokja9853@orv.com",
  password: "Dokja@1234",
  confirmPassword: "Dokja@1234",
  tasks: {
    id1: "6804f89fbd2b3878a136a2ee",
    id2: "6804f9ffacdc3876b901aa5f",
    id3: "6804fb6711c783597da9b364",
  },
};

const testUser3 = {
  firstName: "John",
  lastName: "Doe",
  email: "john@doe.com",
  password: "Doe@1234",
};

// In your test setup file (e.g., testConfig.js)
const BASE_URL = process.env.TEST_BASE_URL || BASE_URL;

module.exports = {
  regex,
  makeString,
  generatePassword,
  createTestUser,
  testUser1,
  testUser2,
  testUser3,
  BASE_URL,
};
