const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const vendorMiddleware = require(
  "../middleware/vendorMiddleware"
);

const adminMiddleware = require(
  "../middleware/adminMiddleware"
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
  createProductReview,
  getProductReviews,
  getAllReviews,
} = require(
  "../controllers/productController"
);


// =========================
// CREATE PRODUCT
// =========================
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
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

router.get(
  "/reviews/all",
  getAllReviews
);

router.get(
  "/:id/reviews",
  getProductReviews
);

router.post(
  "/:id/reviews",
  authMiddleware,
  createProductReview
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
  adminMiddleware,
  updateProduct
);


// =========================
// DELETE PRODUCT
// =========================
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);


// =========================
// UPLOAD PRODUCT IMAGE
// =========================
router.post(
  "/upload/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadProductImage
);



module.exports = router;