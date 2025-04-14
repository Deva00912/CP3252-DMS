const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const crypto = require("crypto");
require("dotenv").config();

const { registerRouter } = require("./Routes/Register.js");
const { loginRouter } = require("./Routes/Login.js");
const { tasksRouter } = require("./Routes/Tasks.js");

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(" MongoDB Database connected");
  })
  .catch((error) => {
    console.log("MongoDB Connection failed");
    console.log(error.message);
  });

app.listen(process.env.PORT, () => {
  console.log("Server is running at port: ", process.env.PORT);
});

app.use("/register", registerRouter);
app.use("/login", loginRouter);
app.use("/task", tasksRouter);

app.use("/random", (req, res) => {
  res
    .status(200)
    .json({
      randomValue: crypto.randomBytes(64).toString("base64url"),
    })
    .end();
});

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});
