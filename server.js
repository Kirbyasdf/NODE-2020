require("dotenv").config({ path: "./config/.env" });
const path = require("path");
const colors = require("colors");
const express = require("express");
const fileupload = require("express-fileupload");
// const logger = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
const bootCampRouter = require("./routes/bootcamps.routes.js");
const courseRouter = require("./routes/courses.routes.js");
const authRouter = require("./routes/auth.routes.js");

//connect to DB
const app = express();

connectDB();

// Body Parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// File uploading
app.use(fileupload());

// set static folder

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 4000;

// Mount Routes
app.use("/api/v1/bootcamps", bootCampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);

// Middleware logging * MUST BE AFTER ALL RELEVENT routes
app.use(errorHandler);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ type: "error", message: err.message });
});

const server = app.listen(PORT, () =>
  console.log(
    (`RUNNING ::: ${process.env.NODE_ENV} ::: - GOOD 2 GO on PORT: ` + PORT)
      .yellow
  )
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error((`ERR: ` + err.message).red);
  // Close server & exit process
  server.close(() => process.exit(1)); //pass 1 to exit with failure
});
