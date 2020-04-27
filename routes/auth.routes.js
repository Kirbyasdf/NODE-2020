const { Router } = require("express");
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
} = require("../controllers/auth.controller.js");

const router = new Router();

const { protect } = require("../middleware/auth.js");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
router.patch("/updatedetails", protect, updateDetails);
router.patch("/updatepassword", protect, updatePassword);

module.exports = router;
