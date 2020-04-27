const path = require("path");
const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const geocoder = require("../utilities/nodeGeocoder.js");
const Bootcamp = require("../models/Bootcamp.js");

// @desc       get all bootcamp + query
// @routes     GET /api/v1/bootcamps/
// @access     public

getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc       get 1 bootcamp
// @routes     GET /api/v1/bootcamps/:id
// @access     public

getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc       create bootcamp
// @routes     POST /api/v1/bootcamps/
// @access     private

createBootcamps = asyncHandler(async (req, res, next) => {
  // add user to bootcamp
  req.body.user = req.user.id;
  // check for published bootcmap
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with  ID ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ success: true, data: bootcamp });
});

// @desc       update bootcamp
// @routes     PATCH /api/v1/bootcamps/:id
// @access     private

updateBootcamps = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  let bootcamp = await Bootcamp.findByIdAndUpdate(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }

  //make sure user is bootcamp owner

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.user.id} not authorized to update`, 401)
    );
  }

  bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({ success: true, data: bootcamp });
});

// @desc       delete bootcamp
// @routes     DEL /api/v1/bootcamps/:id
// @access     private

deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.user.id} not authorized to delete`, 401)
    );
  }

  //findByIdAndDelete will not trigger middleware to cascade delete the courses.. must change to .findbyid then.remove()
  bootcamp.remove();

  res.status(200).json({
    success: true,
    message: `Bootcamp: "${bootcamp.name}" was deleted id: ${bootcamp._id}`,
  });
});

// @desc       Get bootcamps within a radius
// @routes     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access     private

getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // earth radius = 3,963 mi OR 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc       upload photo for bootcamp
// @routes     DEL /api/v1/bootcamps/:id/photo
// @access     private

bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with id: ${id}`, 404));
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`User ${req.user.id} not authorized to add photo`, 401)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse("Please upload a photo", 400));
  }

  if (!req.files.file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload correct image format", 400));
  }

  if (req.files.file.size > process.env.MAX_FILE_UPLOAD_SIZE) {
    return next(
      new ErrorResponse(
        "Please up load a file smaller than " +
          process.env.MAX_FILE_UPLOAD_SIZE,
        400
      )
    );
  }
  //the key file is attached from the request as the key
  const file = req.files.file;
  //create custom filename using the default node module
  file.name = `photo_${bootcamp._id}` + path.parse(file.name).ext;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(error);
      return next(new ErrorResponse("Upload failed", 500));
    }
    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });
    res.status(200).json({ sucess: true, data: file.name });
  });
});

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
};
