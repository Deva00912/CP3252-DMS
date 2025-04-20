/* eslint-disable jest/valid-expect */
require("dotenv").config();
const mongoose = require("mongoose");
const expect = require("chai").expect;
const crypto = require("crypto");

const {
  validate,
  putCreateUser,
  getGetAllUsers,
  postIsUserEmailExists,
  validateUserEmail,
  checkPasswordAndLogin,
} = require("../Features/Auth");
const {
  addTaskFeature,
  updateTask,
  deleteTaskFeature,
  getUserTasksFeature,
} = require("../Features/Tasks");
const {
  createTestUser,
  testUser2,
  testUser3,
  testUser1,
} = require("../Services/Utils/Constants");

describe("Testing User features", () => {
  before(() => {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => console.log(error.message));
  });

  it("Validating user - valid details", () => {
    const result = validate(testUser1);
    expect(result).to.be.equal(true);
  });

  it("Incorrect email", () => {
    const user = {
      email: "hgcgfxgfchgc",
      firstName: "sfdgfgjhjbhg",
      lastName: "dffxc",
      password: "dev@1234",
    };
    const result = validate(user);
    expect(result).to.be.equal(false);
  });

  it("Invalid password", () => {
    const user = {
      email: "hgcgfxgfchgc@email.com",
      firstName: "hgcgfxgc",
      lastName: "dxgxcg",
      password: "dev1234",
    };
    const result = validate(user);
    expect(result).to.be.equal(false);
  });

  it("Empty first name", () => {
    const user = {
      email: "hgcgfxgc@emil.com",
      firstName: "",
      lastName: "M",
      password: "Dev@1234",
    };
    const result = validate(user);
    expect(result).to.be.equal(false);
  });

  it("Empty last name", () => {
    const user = {
      email: "hgcgfxgc@emil.com",
      firstName: "hgcgfxgc",
      lastName: "",
      password: "Dev@1234",
    };
    const result = validate(user);
    expect(result).to.be.equal(false);
  });

  it("Empty first &  last name", () => {
    const user = {
      email: "hgcgfxgc@emil.com",
      firstName: "",
      lastName: "",
      password: "Dev@1234",
    };
    const result = validate(user);
    expect(result).to.be.equal(false);
  });

  it("Empty password", () => {
    const user = {
      email: "hgcgfxgc@emil.com",
      firstName: "hgcgfxgc",
      lastName: "M",
      password: "",
    };
    const result = validate(user);
    expect(result).to.be.equal(false);
  });

  it("Creating a user with Valid details", async () => {
    const response = await putCreateUser(createTestUser);
    expect(response).to.be.a("object");
    expect(Object.values(response).length).to.be.equal(2);
    expect(response).to.have.property("message");
    expect(response).to.have.property("data");
    expect(response.message).to.be.equal("User created");
    expect(response.data).to.be.a("object");
  });

  it("Getting every users", async () => {
    const response = await getGetAllUsers();
    expect(response).to.be.a("object");
    expect(response).to.have.property("message");
    expect(response).to.have.property("data");
    expect(response.message).to.be.equal("All Users");
    expect(response.data).to.be.a("array");
    expect(response.data.length).to.be.above(0);
  });

  it("check email already exists", async () => {
    const email = "kimdokja9853@orv.com";
    const response = await postIsUserEmailExists(email);
    expect(response).to.be.a("object");
    expect(response).to.have.property("message");
    expect(response).to.have.property("data");
    expect(response.message).to.be.equal("email is already in use");
    expect(response.data).to.be.a("object");
    expect(Object.values(response.data).length).to.be.above(1);
  });

  it("email is available to use", async () => {
    const response = await postIsUserEmailExists(
      `${crypto.randomBytes(8).toString("hex")}@email.com`
    );

    expect(response).to.be.a("object");
    expect(response.message).to.be.equal("email is available");
    expect(response.data).to.be.a("array");
    expect(response.data.length).to.be.equal(0);
  });

  it("Validating email - valid email", () => {
    const result = validateUserEmail(createTestUser?.email);
    expect(result).to.be.equal(true);
  });

  it("Validating email - invalid email", () => {
    const email = "adsfafgwerq4532";
    const result = validateUserEmail(email);

    expect(result).to.be.equal(false);
  });

  it("existing user - valid credentials", async () => {
    const response = await checkPasswordAndLogin(
      testUser2.email,
      testUser2.password
    );

    expect(response).to.be.a("object");
    expect(Object.values(response)).to.have.lengthOf(2);
    expect(response).to.be.have.property("message").to.be.equal("Logged in");
    expect(response).to.be.have.property("data");
    expect(response.data).to.be.a("object");
    expect(Object.values(JSON.stringify(response.data))).to.have.lengthOf.above(
      3
    );
  });

  it("existing user - invalid credentials (password)", async () => {
    const user = {
      email: "john@doe.com",
      password: "Dev@e1234",
    };
    const response = {};
    try {
      response = await checkPasswordAndLogin(user.email, user.password);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("AuthError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Invalid credentials");
  });

  it("Non - existing user", async () => {
    const user = {
      email: "hello234",
      password: "Dev@e1234",
    };
    const response = {};
    try {
      response = await checkPasswordAndLogin(user.email, user.password);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("AuthError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("User does not exists");
  });
});

describe("Testing Tasks features", () => {
  before(() => {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => console.log(error.message));
  });
  it("Add an valid task", async () => {
    const task = {
      userId: "64f341992245ab97687076a2",
      entry: "Test feature - 1",
      email: testUser2?.email,
    };

    const response = await addTaskFeature(task);

    expect(response).to.be.a("object");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task Added!");
  });

  it("Add an empty task - null", async () => {
    const task = null;
    let response = {};
    try {
      response = await addTaskFeature(task);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task cannot be empty");
  });

  it("Add an empty task entry - null", async () => {
    const task = {
      userId: "64f341992245ab97687076a2",
      entry: "",
    };

    var response = {};
    try {
      response = await addTaskFeature(task);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task cannot be empty");
  });

  it("Update valid task", async () => {
    const task = {
      taskId: testUser2?.tasks?.id1,
      entry: "Task Edit Feature - 1",
    };

    const response = await updateTask(task.taskId, task.entry);
    expect(response).to.be.a("object");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task edited");
    expect(response).to.be.haveOwnProperty("data").to.be.a("object");
  });

  it("Update invalid task - empty taskId", async () => {
    const task = {
      taskId: "",
      entry: "Task Edit Feature - 1",
    };

    var response = {};
    try {
      response = await updateTask(task.taskId, task.entry);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task not found!");
  });

  it("Update invalid task - empty entry", async () => {
    const task = {
      taskId: testUser2?.tasks?.id1,
      entry: "",
    };

    var response = {};
    try {
      response = await updateTask(task.taskId, task.entry);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task cannot be empty");
  });

  it.skip("valid deletion", async () => {
    const taskId = testUser2?.tasks?.id3;

    const response = await deleteTaskFeature(taskId);
    expect(response).to.be.a("object");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task deleted");
    expect(response).to.haveOwnProperty("data").to.be.a("object");
  });

  it("invalid deletion - empty taskId", async () => {
    const taskId = "";

    var response = {};

    try {
      response = await deleteTaskFeature(taskId);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task not found!");
  });

  it("invalid deletion - not an existing taskId", async () => {
    const taskId = "6502ce84b0792b4d6a62efd3";

    var response = {};

    try {
      response = await deleteTaskFeature(taskId);
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }

    expect(response).to.be.a("object");
    expect(response).to.be.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response)
      .to.be.haveOwnProperty("message")
      .to.be.equal("Task not found!");
  });

  it("valid user - tasks are present", async () => {
    const response = await getUserTasksFeature(testUser2?.email);
    expect(response).to.be.a("object");
    expect(response).to.haveOwnProperty("message").to.be.equal("User Tasks");
    expect(response).to.haveOwnProperty("data").to.be.a("array");
  });

  it("valid user - tasks are not present", async () => {
    var response = {};
    try {
      response = await getUserTasksFeature("7e565ef77196c3b7@email.com");
    } catch (error) {
      response.name = error.name;
      response.message = error.message;
    }
    console.log("response :>> ", response);
    expect(response).to.be.a("object");
    expect(response).to.haveOwnProperty("name").to.be.equal("TaskError");
    expect(response).to.haveOwnProperty("message").to.be.equal("No Tasks");
  });
});
