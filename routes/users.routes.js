const { Router } = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller.js");

const router = new Router({ mergeParams: true });
const User = require("../models/User.js");

const { protect, authorize } = require("../middleware/auth.js");
const advancedResults = require("../middleware/advancedResults.js");

///anything below this will use this middleware
router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).patch(createUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
