const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Public routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin only routes
router.post("/", authMiddleware, adminMiddleware, upload.single("image"), createCategory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single("image"), updateCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;