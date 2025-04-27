/* eslint-disable jest/valid-expect */
/* eslint-disable jest/no-conditional-expect */
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);

const expect = chai.expect;
const {
  testUser2,
  testUser1,
  BASE_URL,
} = require("../Services/Utils/Constants");

describe("User API", () => {
  describe("POST login/check", () => {
    it("should allow existing user - log in", () => {
      chai
        .request(BASE_URL)
        .post("/login/authUserAndLogin")
        .send({
          email: testUser2?.email,
          password: testUser2?.password,
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").equal("Logged in");
          }
        });
    });

    it("should handle existing user - invalid credentials (password)", () => {
      chai
        .request(BASE_URL)
        .post("/login/authUserAndLogin")
        .send({
          email: testUser2?.email,
          password: "Deve@1234",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body)
              .to.have.property("message")
              .equal("Invalid credentials");
          }
        });
    });

    it("should handle existing user - invalid credentials (email)", () => {
      chai
        .request(BASE_URL)
        .post("/login/authUserAndLogin")
        .send({
          email: "Devendran0912",
          password: "Dev@1234",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("ackStatus");
          }
        });
    });

    it("should handle non existing user", () => {
      chai
        .request(BASE_URL)
        .post("/login/authUserAndLogin")
        .send({
          email: "tatsumi0912@gmail.com",
          password: "Dev@1234",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body)
              .to.have.property("message")
              .equal("User does not exists");
          }
        });
    });
  });

  describe("Register API", () => {
    it("Creating an valid user", () => {
      chai
        .request(BASE_URL)
        .put("/register/createUser")
        .send({ ...testUser1 })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res).to.have.property("message");
          } else {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property("message").equal("User created");
          }
        });
    });

    it("error - Creating an existing valid user", () => {
      try {
        chai
          .request(BASE_URL)
          .put("/register/createUser")
          .send({
            email: `${testUser2?.email}`,
            firstName: `${testUser2?.firstName}`,
            lastName: `${testUser2?.lastName}`,
            password: `${testUser2?.password}`,
            confirmPassword: `${testUser2?.confirmPassword}`,
          })
          .end((err, res) => {
            if (err) {
              expect(res).to.have.status(500);
              expect(res).to.have.property("message");
            } else {
              expect(res).to.have.status(400);
              expect(res.body)
                .to.have.property("message")
                .equal("User already exists");
            }
          });
      } catch (error) {}
    });

    it("error - Creating an user with an invalid email", () => {
      chai
        .request(BASE_URL)
        .put("/register/createUser")
        .send({
          email: "Anitha8899",
          password: "Dev@1234",
          firstName: "Anitha",
          lastName: "K",
          confirmPassword: "Dev@1234",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("ackStatus").equal("failed");
          }
        });
    });

    it("give error - creating a user with no password match", () => {
      chai
        .request(BASE_URL)
        .put("/register/createUser")
        .send({
          email: `${testUser1?.email}`,
          password: `${testUser1?.password}`,
          firstName: `${testUser1?.firstName}`,
          lastName: `${testUser1?.lastName}`,
          confirmPassword: "rgsergserge@Tvbj3423",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property("ackStatus").equal("completed");
            expect(res.body)
              .to.have.property("message")
              .equal("Enter details correctly");
          }
        });
    });

    it("getting all users", () => {
      chai
        .request(BASE_URL)
        .get("/register/getUsers")
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("message").equal("All Users");
          expect(res.body).to.have.property("data");
        });
    });

    it("checking whether an email exist? - email exists", () => {
      chai
        .request(BASE_URL)
        .post("/register/isUserEmailExists")
        .send({
          email: `${testUser2?.email}`,
          password: `${testUser2?.password}`,
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body)
              .to.have.property("message")
              .equal("email is already in use");
            expect(res.body).to.have.property("data").to.be.a("object");
          }
        });
    });

    it("checking whether an email exist? - email not exists", () => {
      chai
        .request(BASE_URL)
        .post("/register/isUserEmailExists")
        .send({
          email: `${testUser1?.email}`,
          password: `${testUser1?.password}`,
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(200);
            expect(res.body)
              .to.have.property("message")
              .equal("email is available");
            expect(res.body).to.have.property("data").to.be.a("array");
          }
        });
    });
  });

  describe("Tasks API", () => {
    it("Adding an valid task", () => {
      chai
        .request(BASE_URL)
        .put("/task/addTask")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: `${testUser2?.email}`,
          entry: "Test api integration 1",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            // expect(res).to.have.status(201);
            expect(res.body).to.have.property("message").equal("Task Added!");
          }
        });
    });

    it("give warning - adding an empty entry", () => {
      chai
        .request(BASE_URL)
        .put("/task/addTask")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: `${testUser2?.email}`,
          entry: "",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body)
              .to.have.property("message")
              .equal("Task cannot be empty");
          }
        });
    });

    it("give warning - adding an empty task", () => {
      chai
        .request(BASE_URL)
        .post("/task/addTask")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: ``,
          entry: "",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(404);
            expect(res.body)
              .to.have.property("message")
              .equal("Page not found");
          }
        });
    });

    it("Editing an valid task", () => {
      chai
        .request(BASE_URL)
        .patch("/task/editTask")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: `${testUser2?.email}`,
          taskId: `${testUser2?.tasks?.id1}`,
          entry: "Test api integration 1 - update",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").equal("Task edited");
          }
        });
    });

    it("give warning - editing an non existing task", () => {
      chai
        .request(BASE_URL)
        .patch("/task/editTask")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: `${testUser2?.email}`,
          entry: "Test api integration 1 edit",
          taskId: "64f341e92245ab97687076c5",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body)
              .to.have.property("message")
              .equal("Task not found!");
          }
        });
    });

    it("give warning - editing an empty task", () => {
      chai
        .request(BASE_URL)
        .patch("/task/editTask")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: `${testUser2?.email}`,
          entry: "",
          taskId: "64f341e92245ab97687076c5",
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(400);
            expect(res.body)
              .to.have.property("message")
              .equal("Task cannot be empty");
          }
        });
    });

    // it.skip("deleting an existing task", () => {
    //   chai
    //     .request(BASE_URL)
    //     .delete("/task/deleteTask/650a7d370569e1cbfe957b41")
    //     .end((err, res) => {
    //       if (err) {
    //         expect(res).to.have.status(500);
    //         expect(res.body).to.have.property("message");
    //       } else {
    //         expect(res).to.have.status(200);
    //         expect(res.body).to.have.property("message").equal("Task deleted");
    //       }
    //     });
    // });

    // it.skip("give warning deleting an non - existing task", () => {
    //   chai
    //     .request(BASE_URL)
    //     .delete("/task/deleteTask/650bfb44591bbd2879e5a92a")
    //     .set("x-access-token", process.env.LOGIN_TOKEN)
    //     .end((err, res) => {
    //       if (err) {
    //         expect(res).to.have.status(500);
    //         expect(res.body).to.have.property("message");
    //       } else {
    //         expect(res).to.have.status(400);
    //         expect(res.body)
    //           .to.have.property("message")
    //           .equal("Task not found!");
    //         // expect(res.body).to.have.property("error");
    //         // expect(res.body).to.have.property("ackStatus").equal("failed");
    //       }
    //     });
    // });

    it("getting user tasks", () => {
      chai
        .request(BASE_URL)
        .post("/task/findUserTasks")
        .set("x-access-token", process.env.LOGIN_TOKEN)
        .send({
          email: `${testUser2?.email}`,
        })
        .end((err, res) => {
          if (err) {
            expect(res).to.have.status(500);
            expect(res.body).to.have.property("message");
          } else {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("message").equal("User Tasks");
            expect(res.body).to.have.property("ackStatus").equal("completed");
            expect(res.body).to.have.property("data").to.be.a("array");
          }
        });
    });

    // it.skip("getting an non existing user tasks", () => {
    //   chai
    //     .request(BASE_URL)
    //     .post("/task/findUserTasks")
    //     .set("x-access-token", process.env.LOGIN_TOKEN)
    //     .send({
    //       email: `${testUser1?.email}`,
    //     })
    //     .end((err, res) => {
    //       if (err) {
    //         expect(res).to.have.status(500);
    //         expect(res.body).to.have.property("error");
    //         expect(res.body).to.have.property("ackStatus").equal("failed");
    //       } else {
    //         expect(res).to.have.status(404);
    //         // expect(res.body).to.have.property("message").equal("No Tasks");
    //         expect(res.body).to.have.property("error");
    //         // expect(res.body).to.have.property("ackStatus").equal("failed");
    //       }
    //     });
    // });
  });
});
