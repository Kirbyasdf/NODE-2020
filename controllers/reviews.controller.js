const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");
const Bootcamp = require("../models/Bootcamp.js");

getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res
      .status(200)
      .json({ sucess: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(new ErrorResponse("no review found with that id", 404));
  }
  return res.status(200).json({ sucess: true, data: review });
});

createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(new ErrorResponse("no bootcamp found with id", 404));
  }

  const review = await Review.create(req.body);

  return res.status(201).json({ sucess: true, data: review });
});

updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findByIdAndUpdate(req.params.id);
  if (!review) {
    return next(new ErrorResponse("no review found with id", 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    console.log(req.user, req.user.id);
    return next(new ErrorResponse("not authorized to update", 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  return res.status(201).json({ sucess: true, data: review });
});

deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return next(new ErrorResponse("no review found with id", 404));
  }

  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    console.log(req.user, req.user.id);
    return next(new ErrorResponse("not authorized to delete", 401));
  }

  await review.remove();

  return res.status(201).json({ sucess: true, message: "review deleted" });
});

module.exports = {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
};
