const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const User = require("../models/User.js");

getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("no user found", 404));
  }

  res.status(200).json({
    status: true,
    data: user,
  });
});

createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  if (!user) {
    return next(new ErrorResponse("failed creating user", 404));
  }

  res.status(201).json({
    status: true,
    data: user,
  });
});

updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorResponse("failed updating user", 404));
  }

  res.status(200).json({
    status: true,
    data: user,
  });
});

deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse("failed deleting user", 404));
  }
  user.remove();

  res.status(200).json({
    status: true,
    message: "deleted",
  });
});

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser };
