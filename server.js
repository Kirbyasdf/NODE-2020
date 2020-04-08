require("dotenv").config({ path: "./config/.env" });
const colors = require("colors");
const express = require("express");
// const logger = require("./middleware/logger.js");
const morgan = require("morgan");
const connectDB = require("./config/db.js");
//import routes
const bootCampRouter = require("./routes/bootcamps.route.js");
//connect to DB
const app = express();

connectDB();

// Body Parser
app.use(express.json());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const PORT = process.env.PORT || 4000;

app.use("/api/v1/bootcamps", bootCampRouter);

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
