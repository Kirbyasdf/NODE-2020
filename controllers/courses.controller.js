const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const Course = require("../models/Course.js");

getCourses = asyncHandler(async (req, res, next) => {
  let query;
  console.log("params", req.params);

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find();
  }

  const courses = await query;

  res.status(200).json({
    sucess: true,
    count: courses.length,
    data: courses,
  });
});

module.exports = {
  getCourses,
};
