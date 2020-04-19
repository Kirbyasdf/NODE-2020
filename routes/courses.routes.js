const { Router } = require("express");
const { getCourses } = require("../controllers/courses.controller.js");

const router = new Router();

router.route("/").get(getCourses);

module.exports = router;
