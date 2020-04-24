const asyncHandler = require("../middleware/asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const User = require("../models/User.js");

register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  //CREATE USER
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //create Token with method defined in user model
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  //find user + select password ( since we hae it set to non select in db)
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Login", 401));
  }

  //check password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Login", 401));
  }

  //create Token with method defined in user model
  const token = user.getSignedJwtToken();

  res.status(200).json({ success: true, token });
});

module.exports = { register, login };
