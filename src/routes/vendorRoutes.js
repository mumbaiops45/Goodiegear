const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  applyVendor,
  getMyVendorProfile,
  approveVendor,
  getAllVendors,
  updateVendorProfile,
} = require(
  "../controllers/vendorController"
);


// APPLY VENDOR
router.post(
  "/apply",
  authMiddleware,
  applyVendor
);


// GET MY PROFILE
router.get(
  "/me",
  authMiddleware,
  getMyVendorProfile
);


// ADMIN GET ALL VENDORS
router.get(
  "/all",
  authMiddleware,
  adminMiddleware,
  getAllVendors
);


// ADMIN APPROVE VENDOR
router.put(
  "/approve/:id",
  authMiddleware,
  adminMiddleware,
  approveVendor
);

router.put(
  "/me",
  authMiddleware,
  updateVendorProfile
);

module.exports = router;