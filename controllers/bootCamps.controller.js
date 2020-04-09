const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const Bootcamp = require("../models/Bootcamp.js");

// @desc       get all bootcamp
// @routes     GET /api/v1/bootcamps/
// @access     public

getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({
    success: true,
    bootcampCount: bootcamps.length,
    data: bootcamps,
  });
});

// @desc       get 1 bootcamp
// @routes     GET /api/v1/bootcamps/:id
// @access     public
getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  console.log(bootcamp);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc       create bootcamp
// @routes     POST /api/v1/bootcamps/
// @access     private

createBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc       update bootcamp
// @routes     PATCH /api/v1/bootcamps/:id
// @access     private

updateBootcamps = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc       update bootcamp
// @routes     DEL /api/v1/bootcamps/:id
// @access     private

deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }
  res.status(200).json({
    success: true,
    message: `Bootcamp: "${bootcamp.name}" was deleted id: ${bootcamp._id}`,
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp,
};
