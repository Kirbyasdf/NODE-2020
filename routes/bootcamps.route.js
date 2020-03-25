const { Router } = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamps,
  updateBootcamps,
  deleteBootcamp
} = require("../controllers/bootCamps.controller.js");

const router = new Router();

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamps);
//
router
  .route("/:id")
  .get(getBootcamp)
  .patch(updateBootcamps)
  .delete(deleteBootcamp);

//alt way to write the above

//
//
// router.get("/", getBootcamps);
// router.get("/:id", getBootcamp);
// router.post("/", createBootcamps);
// router.patch("/:id", updateBootcamps);
// router.delete("/:id", deleteBootcamp);

module.exports = router;
