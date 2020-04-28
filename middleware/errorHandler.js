const ErrorResponse = require("../utilities/ErrorResponse.js");

const errorHandler = (err, req, res, next) => {
  //copying err being passed through
  let error = { ...err };
  error.message = err.message;
  console.log(err.code);
  //log to console for dev
  console.log(err.stack);

  // Mongoose incorrect formed for Object ID()
  if (err.name === "CastError") {
    const message = `No Resource found`;
    error = new ErrorResponse(message, 404);
  }
  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValadationError") {
    const message = Object.values(err.errors).map((v) => v.message);
    error = new ErrorResponse(message, 400);
  }
  res
    .status(error.statusCode || 500)
    .json({ sucess: false, error: error.message || "SERVER ERROR" });
};

module.exports = errorHandler;
