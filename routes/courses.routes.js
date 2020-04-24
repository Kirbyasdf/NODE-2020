const { Router } = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.controller.js");

//see bootcamp controller for details
const Course = require("../models/Course.js");
const advancedResults = require("../middleware/advancedResults.js");

const router = new Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth.js");

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize("publisher", "admin"), addCourse);
router
  .route("/:id")
  .get(getCourse)
  .patch(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

module.exports = router;
