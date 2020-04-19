const { Router } = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp,
  getBootcampsInRadius,
} = require("../controllers/bootcamps.controller.js");

const router = new Router();

// re-route into courses w/ resource routing
//must add {mergePrarms: true in imported router}
const courseRouter = require("./courses.routes.js");

router.use("/:bootcampId/courses", courseRouter);

router.route("/").get(getBootcamps).post(createBootcamps);

router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamps)
  .delete(deleteBootcamp);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

//alt way to write the above

//
//
// router.get("/", getBootcamps);
// router.get("/:id", getBootcamp);
// router.post("/", createBootcamps);
// router.patch("/:id", updateBootcamps);
// router.delete("/:id", deleteBootcamp);

module.exports = router;
