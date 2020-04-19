const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const geocoder = require("../utilities/nodeGeocoder.js");
const Bootcamp = require("../models/Bootcamp.js");

// @desc       get all bootcamp + query
// @routes     GET /api/v1/bootcamps/
// @access     public

getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // copy req.query
  const reqQuery = { ...req.query };

  //filter query for field select for mongodb lang query use

  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach((param) => delete reqQuery[param]);

  //create query string
  let queryString = JSON.stringify(reqQuery);
  //create operators for mongoose query lang
  queryString = queryString.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // greater than, greater than or equal and return the match where// double $$ is just string interp.

  query = Bootcamp.find(JSON.parse(queryString));

  //utilize the select field in mongo

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  //utilize sort field in mongo

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //pagination
  //take in page(base 10) or default page 1
  const page = parseInt(req.query.page, 10) || 1;
  //limit results to 25 per page
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;

  //pagination result ...gives reference to the front end

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    bootcampCount: bootcamps.length,
    pagination,
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

module.exports = {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp,
  getBootcampsInRadius,
};
