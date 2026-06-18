const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  getAdminProfile,
  updateAdminProfile,
  getDashboardStats,
  getAllCustomers,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  updateOrderStatus,
  deleteUser,
} = require(
  "../controllers/adminController"
);


// ADMIN PROFILE
router.get(
  "/profile",
  authMiddleware,
  adminMiddleware,
  getAdminProfile
);

// UPDATE ADMIN PROFILE
router.put(
  "/profile",
  authMiddleware,
  adminMiddleware,
  upload.single("profilePhoto"),
  updateAdminProfile
);


// DASHBOARD
router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);


// CUSTOMERS ONLY
router.get(
  "/customers",
  authMiddleware,
  adminMiddleware,
  getAllCustomers
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

// UPDATE ORDER STATUS
router.put(
  "/orders/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;