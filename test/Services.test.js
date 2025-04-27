/* eslint-disable jest/valid-expect */
const mongoose = require("mongoose");
const crypto = require("crypto");

const {
  createUserInDB,
  getAllUsersFromDB,
  getUserFromDB,
} = require("../Services/MongoDB/UserServices");
const {
  addTaskInDB,
  updateTaskInDB,
  deleteTaskInDB,
  findTaskByTaskId,
  getUserTasksFromDB,
} = require("../Services/MongoDB/TaskServices");
const { testUser1, makeString } = require("../Services/Utils/Constants");

const expect = require("chai").expect;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error.message));

describe("Testing services", () => {
  before(() => {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("Database connected");
      })
      .catch((error) => console.log(error.message));
  });
  describe("User services", () => {
    it("Getting all user", async () => {
      const response = await getAllUsersFromDB();
      expect(response).to.be.a("array");
      expect(response).to.have.length.above(0);
    });

    it("Creating a user", async () => {
      const response = await createUserInDB({
        ...testUser1,
        email: `${makeString(9)}@email.com`,
      });
      expect(response).to.be.a("object");
      expect(response).to.have.property("userId");
    });

    it("Throw error - Duplicate user", async () => {
      const user = {
        email: "john@doe.com",
        firstName: "Dokja",
        lastName: "Kim",
        password: "Dokja@1234",
        confirmPassword: "Dokja@1234",
      };
      let code = 0;
      try {
        await createUserInDB(user);
      } catch (error) {
        code = error.code;
      }
      expect(code).to.be.equal(11000);
    });

    it("Getting a user", async () => {
      const email = "john@doe.com";
      const response = await getUserFromDB(email);

      expect(response).to.be.a("object");
      expect(Object.values(response).length).to.be.above(1);
    });

    it("Getting an non-existing user", async () => {
      const email = "john777@doe.com";
      const response = await getUserFromDB(email);
      console.log("response :>> ", response);
      expect(response).to.be.a("null");
    });
  });

  describe("Tasks", () => {
    it("Adding an task", async () => {
      const task = {
        email: "john@doe.com",
        entry: `${crypto.randomBytes(8).toString("hex")}`,
      };

      const response = await addTaskInDB(task);

      expect(response).to.be.a("object");
      // done();
    });

    it("Find a task by taskId", async () => {
      const taskId = "68020256d912e58a186fe76c";
      const response = await findTaskByTaskId(taskId);

      expect(response).to.be.a("object");
    });

    it("Update a task", async () => {
      const { taskId, entry } = {
        taskId: "68020256d912e58a186fe76c",
        email: "john@doe.com",
        entry: `Updated on Test Service - ${crypto
          .randomBytes(8)
          .toString("hex")}`,
      };
      const response = await updateTaskInDB(taskId, entry);
      expect(response).to.be.a("object");
    });

    // it.skip("Delete an task by taskId", async () => {
    //   const taskId = "68020256d912e58a186fe76c";
    //   const response = await deleteTaskInDB(taskId);

    //   expect(response).to.be.a("object");
    // });

    it("Getting user tasks", async () => {
      const userId = "6801fd18580fb9d594a46165";
      const response = await getUserTasksFromDB(userId);

      expect(response).to.be.a("array");
    });

    it("Getting user tasks - with an empty userId", async () => {
      const response = await getUserTasksFromDB("");

      expect(response).to.be.a("array");
      expect(response).to.have.lengthOf.at.least(0);
    });
  });
});
