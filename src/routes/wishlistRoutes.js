const express =
  require("express");

const router =
  express.Router();

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  addToWishlist,
  getWishlist,
  removeWishlistItem,
  clearWishlist,
} = require(
  "../controllers/wishlistController"
);


// ==========================
// ADD TO WISHLIST
// ==========================
router.post(
  "/",
  authMiddleware,
  addToWishlist
);


// ==========================
// GET WISHLIST
// ==========================
router.get(
  "/",
  authMiddleware,
  getWishlist
);


// ==========================
// REMOVE ITEM
// ==========================
router.delete(
  "/:productId",
  authMiddleware,
  removeWishlistItem
);


// ==========================
// CLEAR WISHLIST
// ==========================
router.delete(
  "/",
  authMiddleware,
  clearWishlist
);

module.exports =
  router;