const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllReviews,
  getProductReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  getPublishedReviews,
} = require("../controllers/reviewController");


// PUBLIC — get published reviews for a product
router.get("/product/:productId", getProductReviews);
router.get("/published", getPublishedReviews);


// CUSTOMER — create / update / delete own review
router.post("/", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

// ADMIN — manage all reviews
router.get("/", authMiddleware, adminMiddleware, getAllReviews);
router.get("/:id", authMiddleware, adminMiddleware, getReview);
router.patch("/:id/approve", authMiddleware, adminMiddleware, approveReview);
router.patch("/:id/reject", authMiddleware, adminMiddleware, rejectReview);
module.exports = router;
