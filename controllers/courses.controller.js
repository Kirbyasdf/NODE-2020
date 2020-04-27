const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const Course = require("../models/Course.js");
const Bootcamp = require("../models/Bootcamp.js");

getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ sucess: true, count: courses.length, data: courses });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(new ErrorResponse("No Course with id of " + id, 404));
  }

  res.status(200).json({
    sucess: true,
    data: course,
  });
});

addCourse = asyncHandler(async (req, res, next) => {
  //setting the object to be saved to the correct id
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse("No Bootcamp with id of " + req.params.bootcampId, 404)
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} not authorized to add a course to ${bootcamp._id}`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    sucess: true,
    data: course,
  });
});

updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse("No Course with id of " + id, 404));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User: ${req.user.id} not authorized to update a course: ${course._id}`,
        401
      )
    );
  }
  course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    sucess: true,
    data: course,
  });
});

deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return next(new ErrorResponse("No Course with id of " + id, 404));
  }

  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User: ${req.user.id} not authorized to update a course: ${course._id}`,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    sucess: true,
    message: "course with id: " + id + " deleted",
  });
});

module.exports = {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
};
