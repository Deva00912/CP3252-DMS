/* eslint-disable jest/valid-expect */
const mongoose = require("mongoose");
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

const expect = require("chai").expect;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error.message));

describe("Testing services", () => {
  describe("User services", () => {
    it("Getting all user", async () => {
      const response = await getAllUsersFromDB();
      expect(response).to.be.a("array");
    });

    it.skip("Creating a user", async () => {
      const user = {
        email: "kimdokja9853",
        firstName: "Dokja",
        lastName: "Kim",
        password: "Dokja@1234",
        confirmPassword: "Dokja@1234",
      };

      const response = await createUserInDB(user);
      expect(response).to.be.a("object");
    });

    it("Throw error - Duplicate user", async () => {
      const user = {
        email: "kimdokja9813ee3492",
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
      const email = "devendran0912";
      const response = await getUserFromDB(email);

      expect(response).to.be.a("object");
      expect(Object.values(response).length).to.be.above(1);
    });

    it("Getting an non-existing user", async () => {
      const email = "devendrassn0912";
      const response = await getUserFromDB(email);
      expect(response).to.be.a("null");
    });
  });

  describe("Tasks", () => {
    it.skip("Adding an task", async () => {
      const task = {
        userId: "652789dcb1be297de3aa58de",
        entry: "Test Service - 1",
      };

      const response = await addTaskInDB(task);

      expect(response).to.be.a("object");
    });

    it.skip("Update a task", async () => {
      const { taskId, entry } = {
        taskId: "6526b13f4a1c58ed2f7a9964",
        entry: "Updated on Test Service - 1",
      };
      const response = await updateTaskInDB(taskId, entry);

      expect(response).to.be.a("object");
    });

    it.skip("Delete an task by taskId", async () => {
      const taskId = "6526b13f4a1c58ed2f7a9964";
      const response = await deleteTaskInDB(taskId);

      expect(response).to.be.a("object");
    });

    it("Find a task by taskId", async () => {
      const taskId = "6526b217e1833f48484023ce";
      const response = await findTaskByTaskId(taskId);

      expect(response).to.be.a("object");
    });

    it("Getting user tasks", async () => {
      const userId = "6526b0814a1c58ed2f7a9953";
      const response = await getUserTasksFromDB(userId);

      expect(response).to.be.a("array");
    });

    it("Getting user tasks - with an empty userId", async () => {
      const userId = "";
      let errorMessage = "";
      try {
        await getUserTasksFromDB(userId);
      } catch (error) {
        errorMessage = error.message;
      }

      expect(errorMessage).to.include(`Cast to ObjectId failed for value ""`);
    });
  });
});
