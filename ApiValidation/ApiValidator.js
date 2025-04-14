const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, removeAdditional: "all" });

const loginUserSchema = require("./Schemas/LoginUsers/LoginSchema.json");
const registerUserSchema = require("./Schemas/RegisterUsers/RegisterSchema.json");
const isUserEmailAvailable = require("./Schemas/RegisterUsers/CheckUserEmailSchema.json");
const addTaskSchema = require("./Schemas/Tasks/AddTasksSchema.json");
const editTaskSchema = require("./Schemas/Tasks/EditTasksSchema.json");

ajv.addSchema(loginUserSchema, "loginUser");
ajv.addSchema(registerUserSchema, "registerUser");
ajv.addSchema(addTaskSchema, "newTasks");
ajv.addSchema(isUserEmailAvailable, "isUserEmailAvailable");
ajv.addSchema(editTaskSchema, "editTask");

const errorResponses = (schemaErrors) => {
  const error = schemaErrors.map((error) => {
    return {
      message: error.message,
    };
  });

  return {
    ackStatus: "failed",
    errors: error,
  };
};

const validateSchema = (schemaName) => {
  return (req, res, next) => {
    const valid = ajv.validate(schemaName, req.body);
    if (!valid) {
      return res.status(400).send(errorResponses(ajv.errors)).end();
    }
    next();
  };
};

module.exports = {
  validateSchema,
};
