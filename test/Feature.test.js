/* eslint-disable jest/valid-expect */
require("dotenv").config();
const mongoose = require("mongoose");
const expect = require("chai").expect;
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

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error.message));

describe("Testing Features", () => {
  describe("User features", () => {
    it("Validating user - valid details", () => {
      const user = {
        email: "devendran0912",
        firstName: "Devendran",
        lastName: "M",
        password: "Dev@1234",
        confirmPassword: "Dev@1234",
      };
      const result = validate(user);
      expect(result).to.be.equal(true);
    });
    describe("Validating user - Invalid details", () => {
      it("Incorrect email", () => {
        const user = {
          email: "Devendran0912",
          firstName: "Devendran",
          lastName: "M",
          password: "Dev@1234",
          confirmPassword: "Dev@1234",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
      it("Invalid password", () => {
        const user = {
          email: "Devendran0912",
          firstName: "Devendran",
          lastName: "M",
          password: "dev1234",
          confirmPassword: "Dev@1234",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
      it("Mismatch password & confirm password", () => {
        const user = {
          email: "Devendran0912",
          firstName: "Devendran",
          lastName: "M",
          password: "Dev@1dd234",
          confirmPassword: "Dev@1234",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
      it("Empty first name", () => {
        const user = {
          email: "devendran0912",
          firstName: "",
          lastName: "M",
          password: "Dev@1234",
          confirmPassword: "Dev@1234",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
      it("Empty last name", () => {
        const user = {
          email: "devendran0912",
          firstName: "Devendran",
          lastName: "",
          password: "Dev@1234",
          confirmPassword: "Dev@1234",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
      it("Empty first &  last name", () => {
        const user = {
          email: "devendran0912",
          firstName: "",
          lastName: "",
          password: "Dev@1234",
          confirmPassword: "Dev@1234",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
      it("Empty password & confirmPassword", () => {
        const user = {
          email: "devendran0912",
          firstName: "Devendran",
          lastName: "M",
          password: "",
          confirmPassword: "",
        };
        const result = validate(user);
        expect(result).to.be.equal(false);
      });
    });

    describe("Creating User", () => {
      it("Creating a user with Valid details", async () => {
        const user = {
          email: "anitha33332",
          firstName: "Anitha",
          lastName: "K",
          password: "Dev@1234",
          confirmPassword: "Dev@1234",
        };
        const response = await putCreateUser(user);
        expect(response).to.be.a("object");
        expect(Object.values(response).length).to.be.equal(2);
        expect(response.message).to.be.equal("User created");
        expect(response.data).to.be.a("object");
      });
    });

    describe("Getting all users", () => {
      it("Getting every users", async () => {
        const response = await getGetAllUsers();
        expect(response).to.be.a("object");
        expect(response.message).to.be.equal("All Users");
        expect(response.data).to.be.a("array");
        expect(response.data.length).to.be.above(0);
      });
    });

    describe("checking email exists", () => {
      it("email exists", async () => {
        const email = "devendran0912";
        const response = await postIsUserEmailExists(email);
        expect(response).to.be.a("object");
        expect(response.message).to.be.equal("email is already in use");
        expect(response.data).to.be.a("object");
        expect(Object.values(response.data).length).to.be.above(1);
      });
      it("email is available", async () => {
        const email = "devendrhhan0912";
        const response = await postIsUserEmailExists(email);

        expect(response).to.be.a("object");
        expect(response.message).to.be.equal("email is available");
        expect(response.data).to.be.a("array");
        expect(response.data.length).to.be.equal(0);
      });

      it("Validating email - valid email", () => {
        const email = "devendran0222";
        const result = validateUserEmail(email);
        expect(result).to.be.equal(true);
      });
      it("Validating email - invalid email", () => {
        const email = "Devendran0222";
        const result = validateUserEmail(email);

        expect(result).to.be.equal(false);
      });
    });

    describe("Login Validation", () => {
      it("existing user - valid credentials", async () => {
        const user = {
          email: "devendran0912",
          password: "Dev@1234",
        };
        const response = await checkPasswordAndLogin(user.email, user.password);

        expect(response).to.be.a("object");
        expect(Object.values(response)).to.have.lengthOf(2);
        expect(response)
          .to.be.haveOwnProperty("message")
          .to.be.equal("Logged in");
        expect(response).to.be.haveOwnProperty("data");
        expect(response.data).to.be.a("object");
        expect(
          Object.values(JSON.stringify(response.data))
        ).to.have.lengthOf.above(3);
      });
      it("existing user - invalid credentials (password)", async () => {
        const user = {
          email: "devendran0912",
          password: "Dev@e1234",
        };
        var response = {};
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
        var response = {};
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
  });

  describe("Tasks", () => {
    describe("Adding task", () => {
      it("Valid task", async () => {
        const task = {
          userId: "64f341992245ab97687076a2",
          entry: "Test feature - 1",
        };

        const response = await addTaskFeature(task);

        expect(response).to.be.a("object");
        expect(response)
          .to.be.haveOwnProperty("message")
          .to.be.equal("Task Added!");
      });

      it("Adding an empty task - null", async () => {
        const task = null;
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

      it("Adding an empty task entry - null", async () => {
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
    });

    describe("Updating task", () => {
      it("valid task", async () => {
        const task = {
          taskId: "HpEig3QtdMgR9YecBMDL",
          entry: "Task Edit Feature - 1",
        };

        const response = await updateTask(task.taskId, task.entry);
        expect(response).to.be.a("object");
        expect(response)
          .to.be.haveOwnProperty("message")
          .to.be.equal("Task edited");
        expect(response).to.be.haveOwnProperty("data").to.be.a("object");
      });

      it("Invalid task - empty taskId", async () => {
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

      it("Invalid task - empty entry", async () => {
        const task = {
          taskId: "650535be18739d85cd823de6",
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
    });

    describe("Deleting an task", () => {
      it("valid deletion", async () => {
        const taskId = "6502ce84b0792b4d6a62efd3";

        const response = await deleteTaskFeature(taskId);
        expect(response).to.be.a("object");
        expect(response)
          .to.be.haveOwnProperty("message")
          .to.be.equal("Task deleted");
        expect(response).to.haveOwnProperty("data").to.be.a("undefined");
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

      it.skip("invalid deletion - not an existing taskId", async () => {
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
    });

    describe("getting user tasks", () => {
      it("valid user - tasks are present", async () => {
        const userId = "64f341992245ab97687076a2";

        const response = await getUserTasksFeature(userId);
        expect(response).to.be.a("object");
        expect(response)
          .to.haveOwnProperty("message")
          .to.be.equal("User Tasks");
        expect(response).to.haveOwnProperty("data").to.be.a("array");
      });

      it("valid user - tasks are not present", async () => {
        const userId = "64f6fe32be6ff5aa5d25b904";

        var response = {};
        try {
          response = await getUserTasksFeature(userId);
        } catch (error) {
          response.name = error.name;
          response.message = error.message;
        }
        expect(response).to.be.a("object");
        expect(response)
          .to.haveOwnProperty("message")
          .to.be.equal("User Tasks");
        expect(response).to.haveOwnProperty("data").to.be.a("array");
      });
    });
  });
});
