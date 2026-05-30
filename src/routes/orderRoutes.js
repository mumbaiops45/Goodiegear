const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const vendorMiddleware = require(
  "../middleware/vendorMiddleware"
);

const {
  createOrder,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  createPayment,
  verifyPayment,
  dummyPayment,
  getVendorOrders,
  getVendorEarnings,
} = require(
  "../controllers/orderController"
);


// CREATE ORDER
router.post(
  "/",
  authMiddleware,
  createOrder
);


// CREATE PAYMENT
router.post(
  "/payment/:id",
  authMiddleware,
  createPayment
);


// VERIFY PAYMENT
router.post(
  "/verify-payment",
  authMiddleware,
  verifyPayment
);


// DUMMY PAYMENT
router.put(
  "/dummy-pay/:id",
  authMiddleware,
  dummyPayment
);


// GET MY ORDERS
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);


// GET SINGLE ORDER
router.get(
  "/:id",
  authMiddleware,
  getSingleOrder
);


// UPDATE ORDER STATUS
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);


// VENDOR ORDERS
router.get(
  "/vendor/orders",
  authMiddleware,
  vendorMiddleware,
  getVendorOrders
);


// VENDOR EARNINGS
router.get(
  "/vendor/earnings",
  authMiddleware,
  vendorMiddleware,
  getVendorEarnings
);

module.exports = router;