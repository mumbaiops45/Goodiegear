const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
  applyCoupon,
} = require("../controllers/couponController");

// PUBLIC — apply a coupon
router.post("/apply", applyCoupon);

// ADMIN — manage coupons
router.get("/", authMiddleware, adminMiddleware, getAllCoupons);
router.get("/:id", authMiddleware, adminMiddleware, getCoupon);
router.post("/", authMiddleware, adminMiddleware, createCoupon);
router.put("/:id", authMiddleware, adminMiddleware, updateCoupon);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);
router.patch("/:id/toggle", authMiddleware, adminMiddleware, toggleCoupon);

module.exports = router;
