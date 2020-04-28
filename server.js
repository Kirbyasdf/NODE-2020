require("dotenv").config({ path: "./config/.env" });
const path = require("path");
const colors = require("colors");
const express = require("express");
const fileupload = require("express-fileupload");
// const logger = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const connectDB = require("./config/db.js");
const bootCampRouter = require("./routes/bootcamps.routes.js");
const courseRouter = require("./routes/courses.routes.js");
const authRouter = require("./routes/auth.routes.js");
const userRouter = require("./routes/users.routes.js");
const reviewRouter = require("./routes/reviews.routes.js");

const app = express();

//connect to DB
connectDB();

// Body Parser
app.use(express.json());
// cors
app.use(cors());

// cookies
app.use(cookieParser());

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// File uploading
app.use(fileupload());
//sanitize data
app.use(mongoSanitize());
//set security headers
app.use(helmet());
//prevent cross site scripting attacks
app.use(xss());
//prevent http param pollution
app.use(hpp());
//prevent spamming attacks
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// set static folder

app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 4000;

// Mount Routes
app.use("/api/v1/bootcamps", bootCampRouter);
app.use("/api/v1/courses", courseRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

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
