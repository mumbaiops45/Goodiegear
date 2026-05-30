const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const vendorMiddleware = require(
  "../middleware/vendorMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getVendorProducts,
} = require(
  "../controllers/productController"
);


// =========================
// CREATE PRODUCT
// =========================
router.post(
  "/",
  authMiddleware,
  vendorMiddleware,
  createProduct
);


// =========================
// GET ALL PRODUCTS
// =========================
router.get(
  "/",
  getProducts
);


// =========================
// GET VENDOR PRODUCTS
// IMPORTANT:
// MUST BE ABOVE "/:id"
// =========================
router.get(
  "/vendor",
  authMiddleware,
  vendorMiddleware,
  getVendorProducts
);


// =========================
// GET SINGLE PRODUCT
// =========================
router.get(
  "/:id",
  getSingleProduct
);


// =========================
// UPDATE PRODUCT
// =========================
router.put(
  "/:id",
  authMiddleware,
  vendorMiddleware,
  updateProduct
);


// =========================
// DELETE PRODUCT
// =========================
router.delete(
  "/:id",
  authMiddleware,
  vendorMiddleware,
  deleteProduct
);


// =========================
// UPLOAD PRODUCT IMAGE
// =========================
router.post(
  "/upload/:id",
  authMiddleware,
  vendorMiddleware,
  upload.single("image"),
  uploadProductImage
);


module.exports = router;