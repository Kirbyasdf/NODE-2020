const { Router } = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps.controller.js");

// pass middleware to route w/model(below) + controller func
const advancedResults = require("../middleware/advancedResults.js");
const Bootcamp = require("../models/Bootcamp.js");

// re-route into courses w/ resource routing
//must add {mergePrarms: true in imported router}
const courseRouter = require("./courses.routes.js");

const router = new Router();

const { protect, authorize } = require("../middleware/auth.js");

router.use("/:bootcampId/courses", courseRouter);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamps);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(protect, authorize("publisher", "admin"), updateBootcamps)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/:id/photo")
  .patch(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

module.exports = router;
