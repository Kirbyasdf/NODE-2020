const { Router } = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews.controller.js");

const router = new Router({ mergeParams: true });
const Review = require("../models/Review.js");

const { protect, authorize } = require("../middleware/auth.js");
const advancedResults = require("../middleware/advancedResults.js");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router
  .route("/:id")
  .get(getReview)
  .patch(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

// router.route("/:id").get(getReview).patch(updateReview).delete(deleteReview);

module.exports = router;
