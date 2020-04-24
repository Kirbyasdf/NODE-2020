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

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

//get token from model,

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnky: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ sucess: true, token });
};

getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    sucess: true,
    data: user,
  });
});

module.exports = { register, login, getMe };
