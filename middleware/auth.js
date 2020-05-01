const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler.js");
const ErrorResponse = require("../utilities/ErrorResponse.js");
const User = require("../models/User.js");

// protect routes

protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse("Not Authorized for route use :no token ", 401)
    );
  }

  //verify token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECERT);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(
      new ErrorResponse("Not Authorized for route use token not match", 401)
    );
  }
});

/// grant access to certain roles
authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `role: ${req.user.role} is not authorize for this route role does not include admin/publisher`,
          403
        )
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
