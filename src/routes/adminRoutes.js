const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  deleteUser,
} = require(
  "../controllers/adminController"
);


// DASHBOARD
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);


// USERS
router.get(
  "/users",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);


// DELETE USER
router.delete(
  "/users/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);


// PRODUCTS
router.get(
  "/products",
  authMiddleware,
  adminMiddleware,
  getAllProducts
);


// ORDERS
router.get(
  "/orders",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

module.exports = router;